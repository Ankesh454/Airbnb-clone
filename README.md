# 🌍 Travel-Ora — Airbnb Clone

A **full-stack Airbnb-inspired** accommodation booking platform built as a professional portfolio project. Features a modern React frontend with an Express REST API backend.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-26-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express-5-000000?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![Mapbox](https://img.shields.io/badge/Mapbox-GL-000000?logo=mapbox) ![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?logo=cloudinary)

---

## ✨ Features

### 🎨 Frontend (React + Vite)
- **Interactive Category Filter Bar** — Trending, Rooms, Mountains, Castles, Arctic, Beachfront, Luxury & more
- **Real-time Search** — Instant filtering by title, location, or country
- **Airbnb-style Listing Cards** — Image hover zoom, category badge, star rating, wishlist heart
- **Map/Grid Toggle** — Switch between listing grid and interactive Mapbox split-view
- **Detailed Listing Page** — 5-image masonry gallery, fullscreen lightbox, host profile with Superhost badge
- **Booking Calculator** — Date picker, guest counter, dynamic nights calculation with cleaning & service fee breakdown
- **Review System** — Star rating picker, category breakdown bars (Cleanliness, Accuracy, Location, etc.)
- **Wishlist** — Persistent client-side wishlist with add/remove functionality
- **Auth (JWT)** — Modern login/signup pages with branded design, password visibility toggle
- **Glassmorphic UI** — Plus Jakarta Sans typography, smooth animations, skeleton loaders
- **Responsive Design** — Works seamlessly across desktop and tablet viewports

### 🔧 Backend (Express REST API)
- **RESTful JSON API** — Clean `/api/` endpoints for listings, reviews, and authentication
- **JWT Authentication** — Secure token-based auth with 7-day expiration
- **MongoDB Atlas** — Mongoose models with categories, amenities, bedrooms, bathrooms, maxGuests
- **Cloudinary** — Image upload and transformation via Multer
- **Mapbox Geocoding** — Automatic coordinate resolution for listing locations
- **CORS Enabled** — Full cross-origin support for frontend-backend communication

---

## 📁 Project Structure

```
MajorProject/
├── backend/                    # Express REST API Server
│   ├── .env                    # Environment variables
│   ├── app.js                  # Express app entry point
│   ├── package.json
│   ├── cloudConfig.js          # Cloudinary configuration
│   ├── middleware.js            # Auth & validation middleware
│   ├── schema.js               # Joi validation schemas
│   ├── controllers/
│   │   ├── listings.js         # EJS listing controllers (legacy)
│   │   ├── reviews.js          # EJS review controllers (legacy)
│   │   └── users.js            # EJS user controllers (legacy)
│   ├── models/
│   │   ├── listing.js          # Listing Mongoose schema
│   │   ├── review.js           # Review Mongoose schema
│   │   └── user.js             # User schema (passport-local-mongoose)
│   ├── routes/
│   │   ├── api.js              # ★ REST API routes (listings, reviews, auth)
│   │   ├── listing.js          # EJS listing routes (legacy)
│   │   ├── review.js           # EJS review routes (legacy)
│   │   └── user.js             # EJS user routes (legacy)
│   ├── init/
│   │   ├── data.js             # Sample seed data
│   │   └── index.js            # Database seeder script
│   ├── utils/
│   │   ├── ExpressError.js     # Custom error class
│   │   └── wrapAsync.js        # Async error wrapper
│   └── views/                  # EJS templates (legacy, still functional)
│
├── frontend/                   # React + Vite Application
│   ├── index.html              # HTML entry with Mapbox CSS & fonts
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router & AuthProvider
│       ├── index.css           # Global design system (CSS variables)
│       ├── context/
│       │   └── AuthContext.jsx # Auth state + Wishlist provider
│       ├── services/
│       │   └── api.js          # API client (fetch wrapper)
│       ├── components/
│       │   ├── Navbar.jsx      # Sticky header with search & profile
│       │   ├── CategoryBar.jsx # Filter chips + tax toggle
│       │   ├── ListingCard.jsx # Listing grid card
│       │   ├── MapView.jsx     # Mapbox GL interactive map
│       │   ├── BookingWidget.jsx # Reservation calculator
│       │   ├── ReviewSection.jsx # Reviews + rating breakdown
│       │   ├── ImageGallery.jsx # 5-image grid + lightbox
│       │   └── Footer.jsx      # Site footer
│       └── pages/
│           ├── Home.jsx        # Landing page (grid + map toggle)
│           ├── ListingDetails.jsx # Full listing detail view
│           ├── CreateListing.jsx  # Host a home form
│           ├── EditListing.jsx    # Edit existing listing
│           ├── Login.jsx          # Login page
│           ├── Signup.jsx         # Registration page
│           └── Wishlist.jsx       # Saved listings
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Mapbox account

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
MAP_TOKEN=your_mapbox_token
ATLASDB_URL=your_mongodb_atlas_url
SECRET=your_session_secret
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```

### 3. Run Both Servers
```bash
# Terminal 1 — Backend (port 8080)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🛠 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login & get JWT |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/config/mapbox-token` | Get Mapbox token |
| `GET` | `/api/listings` | Get all listings (with search/filter) |
| `GET` | `/api/listings/:id` | Get single listing |
| `POST` | `/api/listings` | Create listing (auth required) |
| `PUT` | `/api/listings/:id` | Update listing (owner only) |
| `DELETE` | `/api/listings/:id` | Delete listing (owner only) |
| `POST` | `/api/listings/:id/reviews` | Add review (auth required) |
| `DELETE` | `/api/listings/:id/reviews/:reviewId` | Delete review (author only) |

---

## 📌 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, React Router 7, Lucide Icons, Mapbox GL |
| Backend | Node.js, Express 5, Mongoose, Passport, JWT |
| Database | MongoDB Atlas |
| Storage | Cloudinary |
| Maps | Mapbox GL JS + Geocoding SDK |
| Styling | CSS Variables, Glassmorphism, Plus Jakarta Sans |

---

## 👤 Author

Built by **Ankesh Kumar** as a full-stack portfolio project.

---

## 📜 License

This project is for educational and portfolio purposes.
