import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2, MapPin, Star } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
          <Heart size={28} fill="var(--primary)" color="var(--primary)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Your Wishlist</h1>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.3rem' }}>
            ({wishlist.length} {wishlist.length === 1 ? 'stay' : 'stays'})
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Heart size={56} color="var(--border-strong)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No saved stays yet</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Tap the heart icon on any listing to save it here.
            </p>
            <Link to="/" style={{
              display: 'inline-flex', padding: '0.8rem 1.5rem',
              background: 'var(--primary-gradient)', color: '#fff',
              borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(227, 28, 95, 0.35)'
            }}>
              Start exploring
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.75rem'
          }}>
            {wishlist.map((listing, i) => (
              <div key={listing._id} className="animate-fade-in" style={{
                animationDelay: `${i * 0.05}s`,
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                transition: 'var(--transition)',
                boxShadow: 'var(--card-shadow)'
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--hover-shadow)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--card-shadow)'}
              >
                <Link to={`/listings/${listing._id}`}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img
                      src={listing.image?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
                      alt={listing.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {listing.category && (
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
                        color: '#fff', fontSize: '0.72rem', fontWeight: 700,
                        padding: '4px 10px', borderRadius: 'var(--radius-full)'
                      }}>
                        {listing.category}
                      </div>
                    )}
                  </div>
                </Link>

                <div style={{ padding: '1rem 1.15rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <Link to={`/listings/${listing._id}`} style={{ color: 'var(--text-primary)' }}>{listing.title}</Link>
                      </h3>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} /> {listing.location}, {listing.country}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.88rem', fontWeight: 600, flexShrink: 0 }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>₹{(listing.price || 0).toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> / night</span>
                    </div>
                    <button
                      onClick={() => toggleWishlist(listing)}
                      title="Remove from wishlist"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)',
                        border: '1px solid #fecaca', color: '#ef4444',
                        fontSize: '0.82rem', fontWeight: 600, background: '#fef2f2'
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
