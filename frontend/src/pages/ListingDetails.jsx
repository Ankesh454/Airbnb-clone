import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ImageGallery } from '../components/ImageGallery';
import { BookingWidget } from '../components/BookingWidget';
import { ReviewSection } from '../components/ReviewSection';
import { MapView } from '../components/MapView';
import { Footer } from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Star, Share, Heart, ShieldCheck, Award, Users,
  Wifi, Car, Wind, Laptop, UtensilsCrossed, Waves, TreePine,
  Loader2, Pencil, Trash2, ChevronRight
} from 'lucide-react';

const AMENITY_ICONS = {
  'Wifi': Wifi,
  'Free Parking': Car,
  'Air Conditioning': Wind,
  'Dedicated Workspace': Laptop,
  'Kitchen': UtensilsCrossed,
  'Pool': Waves,
  'Garden': TreePine,
};

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist, isWishlisted } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapToken, setMapToken] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchListing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getListingById(id);
      if (res.success) setListing(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
    api.getMapboxToken().then(setMapToken);
  }, [fetchListing]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    setDeleting(true);
    try {
      const res = await api.deleteListing(id);
      if (res.success) navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading listing...</span>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Listing not found.</p>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>Go home</Link>
        </div>
      </>
    );
  }

  const avgRating = listing.review?.length > 0
    ? (listing.review.reduce((a, r) => a + r.rating, 0) / listing.review.length).toFixed(1)
    : '4.9';
  const reviewCount = listing.review?.length || 0;
  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingTop: '1.5rem', paddingBottom: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Home</Link>
          <ChevronRight size={13} />
          <span>{listing.location}</span>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-secondary)' }}>{listing.title}</span>
        </nav>

        {/* Title + Actions Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
              {listing.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.9rem', fontWeight: 600 }}>
                <Star size={15} fill="#f59e0b" color="#f59e0b" /> {avgRating}
              </div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>· {reviewCount} reviews</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <Award size={14} color="var(--primary)" /> Superhost
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <MapPin size={14} /> {listing.location}, {listing.country}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <Share size={15} /> Share
            </button>
            <button
              onClick={() => toggleWishlist(listing)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            >
              <Heart size={15} fill={isWishlisted(listing._id) ? 'var(--primary)' : 'none'} color={isWishlisted(listing._id) ? 'var(--primary)' : 'currentColor'} /> Save
            </button>
            {isOwner && (
              <>
                <Link to={`/listings/${id}/edit`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  <Pencil size={15} /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', color: '#ef4444', background: '#fef2f2' }}
                >
                  <Trash2 size={15} /> {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery imageUrl={listing.image?.url} images={listing.images} title={listing.title} />

        {/* Content: Details + Booking Widget */}
        <div className="details-split-layout">
          <div>
            {/* Host Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Entire home hosted by {listing.owner?.username || 'Host'}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {listing.maxGuests || 2} guests · {listing.bedrooms || 1} bedrooms · {listing.bathrooms || 1} bathroom
                </p>
              </div>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'var(--primary-gradient)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.3rem', position: 'relative'
              }}>
                {(listing.owner?.username || 'H').charAt(0).toUpperCase()}
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#10b981', border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheck size={10} color="#fff" />
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: Award, title: 'Superhost', desc: `${listing.owner?.username || 'This host'} is a Superhost — experienced, highly rated hosts.` },
                { icon: MapPin, title: 'Great location', desc: '95% of recent guests gave the location a 5-star rating.' },
                { icon: ShieldCheck, title: 'Free cancellation for 48 hours', desc: 'Get a full refund if you change your mind.' },
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <feat.icon size={24} color="var(--text-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>{feat.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>About this place</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {listing.description || 'This is a beautiful property. Contact the host for details.'}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>What this place offers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {(listing.amenities || ['Wifi', 'Kitchen', 'Free Parking']).map((am) => {
                  const Icon = AMENITY_ICONS[am] || Wifi;
                  return (
                    <div key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      <Icon size={22} color="var(--text-primary)" />
                      <span>{am}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div style={{ padding: '1.5rem 0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Where you'll be</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {listing.location}, {listing.country}
              </p>
              {mapToken && listing.geometry?.coordinates && (
                <div style={{ height: '350px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <MapView
                    listings={[listing]}
                    token={mapToken}
                    centerCoordinates={listing.geometry.coordinates}
                    zoom={12}
                  />
                </div>
              )}
            </div>

            {/* Reviews */}
            <ReviewSection listingId={id} reviews={listing.review || []} onReviewsUpdate={fetchListing} />
          </div>

          {/* Sticky Booking Widget */}
          <BookingWidget listing={listing} avgRating={avgRating} reviewCount={reviewCount} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingDetails;
