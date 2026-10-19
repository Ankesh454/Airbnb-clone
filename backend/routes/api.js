const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

const JWT_SECRET = process.env.SECRET || "supersecretkeywanderlust";

// Middleware to authenticate JWT or Session
const apiAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    }
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ success: false, message: "Please log in to perform this action" });
};

// ==================== AUTH API ==================== //

// Register
router.post("/auth/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username or email already in use" });
        }
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        const token = jwt.sign(
            { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            token,
            user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email }
        });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
}));

// Login
router.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ success: false, message: info?.message || "Invalid credentials" });
        }
        const token = jwt.sign(
            { _id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            success: true,
            message: "Logged in successfully!",
            token,
            user: { _id: user._id, username: user.username, email: user.email }
        });
    })(req, res, next);
});

// Current user profile
router.get("/auth/me", apiAuthenticate, async (req, res) => {
    const user = await User.findById(req.user._id).select("-hash -salt");
    res.json({ success: true, user });
});

// Config: send Mapbox Token to frontend
router.get("/config/mapbox-token", (req, res) => {
    res.json({ token: process.env.MAP_TOKEN });
});

// ==================== LISTINGS API ==================== //

// Get all listings with search, category & pricing filters
router.get("/listings", wrapAsync(async (req, res) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = {};

    if (category && category !== "All") {
        query.category = category;
    }

    if (search) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
        ];
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { _id: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };

    const listings = await Listing.find(query).populate("owner", "username email").sort(sortOption);
    res.json({ success: true, count: listings.length, data: listings });
}));

// Get single listing with reviews and owner
router.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author", select: "username" }
        })
        .populate("owner", "username email");

    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, data: listing });
}));

// Create new listing (supports up to 5 photos)
router.post("/listings", apiAuthenticate, upload.array("images", 5), wrapAsync(async (req, res) => {
    let geoResponse;
    try {
        geoResponse = await geocodingClient.forwardGeocode({
            query: `${req.body.location}, ${req.body.country}`,
            limit: 1
        }).send();
    } catch (err) {
        console.error("Geocoding error:", err);
    }

    const geometry = geoResponse?.body?.features?.[0]?.geometry || {
        type: "Point",
        coordinates: [77.2090, 28.6139] // Default coordinates if geocoding fails
    };

    // Process multiple uploaded files or fallback URLs
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
        uploadedImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    } else if (req.body.imageUrls) {
        const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
        uploadedImages = urls.map((u, i) => ({ url: u, filename: `url_image_${i}` }));
    } else if (req.body.imageUrl) {
        uploadedImages = [{ url: req.body.imageUrl, filename: "url_image" }];
    } else {
        uploadedImages = [{
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            filename: "listing_default"
        }];
    }

    const primaryImage = uploadedImages[0];

    const newListing = new Listing({
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        location: req.body.location,
        country: req.body.country,
        category: req.body.category || "Trending",
        bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : 1,
        bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : 1,
        maxGuests: req.body.maxGuests ? Number(req.body.maxGuests) : 2,
        amenities: typeof req.body.amenities === "string" ? req.body.amenities.split(",").map(a => a.trim()) : req.body.amenities || ["Wifi", "Free Parking"],
        image: primaryImage,
        images: uploadedImages,
        owner: req.user._id,
        geometry
    });

    const saved = await newListing.save();
    res.status(201).json({ success: true, message: "Listing published successfully!", data: saved });
}));

// Update listing (supports updating or adding photos)
router.put("/listings/:id", apiAuthenticate, upload.array("images", 5), wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You do not have permission to edit this listing" });
    }

    if (req.body.title) listing.title = req.body.title;
    if (req.body.description) listing.description = req.body.description;
    if (req.body.price) listing.price = Number(req.body.price);
    if (req.body.location) listing.location = req.body.location;
    if (req.body.country) listing.country = req.body.country;
    if (req.body.category) listing.category = req.body.category;
    if (req.body.bedrooms) listing.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms) listing.bathrooms = Number(req.body.bathrooms);
    if (req.body.maxGuests) listing.maxGuests = Number(req.body.maxGuests);
    if (req.body.amenities) {
        listing.amenities = typeof req.body.amenities === "string" ? req.body.amenities.split(",").map(a => a.trim()) : req.body.amenities;
    }

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
        listing.images = newImages;
        listing.image = newImages[0];
    } else if (req.body.imageUrl) {
        listing.image = { url: req.body.imageUrl, filename: "updated_image" };
        listing.images = [listing.image];
    }

    if (req.body.location) {
        try {
            const geoResponse = await geocodingClient.forwardGeocode({
                query: `${req.body.location}, ${req.body.country || listing.country}`,
                limit: 1
            }).send();
            if (geoResponse.body.features.length) {
                listing.geometry = geoResponse.body.features[0].geometry;
            }
        } catch (e) {
            console.log("Geocoding skip on update");
        }
    }

    await listing.save();
    res.json({ success: true, message: "Listing updated successfully!", data: listing });
}));

// Delete listing
router.delete("/listings/:id", apiAuthenticate, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You do not have permission to delete this listing" });
    }

    await Listing.findByIdAndDelete(id);
    res.json({ success: true, message: "Listing deleted successfully" });
}));

// ==================== REVIEWS API ==================== //

// Add review to listing
router.post("/listings/:id/reviews", apiAuthenticate, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const newReview = new Review({
        rating: Number(rating),
        comment,
        author: req.user._id
    });

    listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    const populatedReview = await Review.findById(newReview._id).populate("author", "username");
    res.status(201).json({ success: true, message: "Review added!", data: populatedReview });
}));

// Delete review
router.delete("/listings/:id/reviews/:reviewId", apiAuthenticate, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "You can only delete your own review" });
    }

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: "Review deleted successfully" });
}));

module.exports = router;
