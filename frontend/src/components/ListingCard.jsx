import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ListingCard = ({ listing, showTax }) => {
  const { toggleWishlist, isWishlisted } = useAuth();
  const wish = isWishlisted(listing._id);

  // Calculate average rating if reviews exist
  const avgRating = listing.review && listing.review.length > 0
    ? (listing.review.reduce((acc, r) => acc + (typeof r === 'object' ? r.rating : 5), 0) / listing.review.length).toFixed(1)
    : '4.9';

  // Tax breakdown calculation (18% GST example)
  const basePrice = listing.price || 1200;
  const totalPrice = showTax ? Math.round(basePrice * 1.18) : basePrice;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'var(--transition)'
    }}>
      {/* Image Container with Wishlist Heart */}
      <div style={{
        position: 'relative',
        aspectRatio: '20/19',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: '#e2e8f0'
      }}>
        <Link to={`/listings/${listing._id}`} style={{ width: '100%', height: '100%', display: 'block' }}>
          <img
            src={listing.image?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
            alt={listing.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(listing);
          }}
          aria-label="Save to wishlist"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '8px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.88)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart
            size={18}
            fill={wish ? 'var(--primary)' : 'rgba(0,0,0,0.3)'}
            color={wish ? 'var(--primary)' : '#ffffff'}
            strokeWidth={2}
          />
        </button>

        {/* Category Pill Tag */}
        {listing.category && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.02em'
          }}>
            {listing.category}
          </div>
        )}
      </div>

      {/* Card Details */}
      <Link to={`/listings/${listing._id}`} style={{ padding: '0.75rem 0.2rem 0.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{
            fontSize: '0.96rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80%'
          }}>
            {listing.location}, {listing.country}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.88rem', fontWeight: 600 }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{avgRating}</span>
          </div>
        </div>

        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
          margin: '2px 0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {listing.title}
        </p>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {listing.bedrooms || 1} bed · {listing.bathrooms || 1} bath
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            night {showTax && <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>total with tax</span>}
          </span>
        </div>
      </Link>
    </div>
  );
};
