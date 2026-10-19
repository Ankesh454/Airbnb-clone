import React, { useState } from 'react';
import { Star, ShieldCheck, Calendar, Users, ChevronDown } from 'lucide-react';

export const BookingWidget = ({ listing, avgRating, reviewCount }) => {
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 6);
    return next.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

  // Nights calculation
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

  const basePrice = listing.price || 1500;
  const subtotal = basePrice * nights;
  const cleaningFee = Math.round(basePrice * 0.12);
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 4500);
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      boxShadow: 'var(--card-shadow)',
      position: 'sticky',
      top: '110px'
    }}>
      {/* Price Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{basePrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}> / night</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: 600 }}>
          <Star size={15} fill="#f59e0b" color="#f59e0b" />
          <span>{avgRating}</span>
          <span style={{ color: 'var(--text-muted)' }}>· {reviewCount} reviews</span>
        </div>
      </div>

      {/* Date & Guest Input Box */}
      <div style={{
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-strong)' }}>
          <div style={{ padding: '0.6rem 0.75rem', borderRight: '1px solid var(--border-strong)' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>CHECK-IN</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', fontWeight: 600 }}
            />
          </div>
          <div style={{ padding: '0.6rem 0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>CHECKOUT</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem', fontWeight: 600 }}
            />
          </div>
        </div>

        <div style={{ padding: '0.6rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>GUESTS</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', fontWeight: 600 }}
            >
              {[...Array(listing.maxGuests || 4)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
          <Users size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Reserve CTA Button */}
      <button
        onClick={handleReserve}
        style={{
          width: '100%',
          padding: '0.95rem',
          background: 'var(--primary-gradient)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 14px rgba(227, 28, 95, 0.4)',
          marginBottom: '0.75rem'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        {isBooked ? '✓ Reserved Successfully!' : 'Reserve'}
      </button>

      {isBooked && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          fontSize: '0.85rem',
          textAlign: 'center',
          marginBottom: '1rem',
          fontWeight: 600
        }}>
          Booking confirmed! An email reservation itinerary has been sent.
        </div>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        You won't be charged yet
      </p>

      {/* Pricing Breakdown Line Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ textDecoration: 'underline' }}>₹{basePrice.toLocaleString('en-IN')} × {nights} nights</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
          <span>₹{cleaningFee.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ textDecoration: 'underline' }}>Wanderlust service fee</span>
          <span>₹{serviceFee.toLocaleString('en-IN')}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          <span>Total before taxes</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Guarantee Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginTop: '1.25rem',
        padding: '0.75rem',
        backgroundColor: 'var(--surface-hover)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        <ShieldCheck size={20} color="var(--primary)" />
        <span><strong>WanderCover Protection:</strong> Every booking includes free protection from Host cancellations and check-in issues.</span>
      </div>
    </div>
  );
};
