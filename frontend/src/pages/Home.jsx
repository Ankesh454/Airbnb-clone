import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { CategoryBar } from '../components/CategoryBar';
import { ListingCard } from '../components/ListingCard';
import { MapView } from '../components/MapView';
import { Footer } from '../components/Footer';
import { api } from '../services/api';
import { Map, LayoutGrid, Loader2 } from 'lucide-react';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showTax, setShowTax] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapToken, setMapToken] = useState('');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      const res = await api.getListings(params);
      if (res.success) {
        setListings(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    api.getMapboxToken().then((t) => setMapToken(t));
  }, []);

  const handleSearchSubmit = () => {
    fetchListings();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar searchVal={search} onSearchChange={setSearch} onSearchSubmit={handleSearchSubmit} />
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showTax={showTax}
        onToggleTax={() => setShowTax(!showTax)}
      />

      <main style={{ flex: 1 }}>
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '40vh',
              gap: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>Loading amazing stays...</span>
              <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : showMap ? (
            /* Map + Grid Split View */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: '70vh' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
                maxHeight: '75vh',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}>
                {listings.map((listing, i) => (
                  <div key={listing._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <ListingCard listing={listing} showTax={showTax} />
                  </div>
                ))}
              </div>
              <div style={{ position: 'sticky', top: '170px', height: '75vh' }}>
                <MapView listings={listings} token={mapToken} />
              </div>
            </div>
          ) : (
            /* Standard Listing Grid */
            <>
              {listings.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 1rem',
                  color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No stays found</p>
                  <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="listings-grid">
                  {listings.map((listing, i) => (
                    <div key={listing._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                      <ListingCard listing={listing} showTax={showTax} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Map/Grid Toggle */}
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.5rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
          zIndex: 80,
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
      >
        {showMap ? <LayoutGrid size={17} /> : <Map size={17} />}
        <span>{showMap ? 'Show list' : 'Show map'}</span>
      </button>

      <Footer />
    </div>
  );
};

export default Home;
