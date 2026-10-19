import { Compass, Globe, Mail, Code2, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      marginTop: '4rem',
      paddingTop: '3.5rem',
      paddingBottom: '1.5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid #1e293b'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #ff385c, #e00b41)',
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                color: '#fff'
              }}>
                <Sparkles size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Travelora</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: '#94a3b8' }}>
              Discover curated stays, villas, and unforgettable experiences worldwide. Built as a high-end portfolio project.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[Code2, Share2, Sparkles, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff385c'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explore</h4>
            {['All Stays', 'Beachfront', 'Mountains', 'Iconic Cities', 'Luxury', 'Camping'].map((item) => (
              <Link key={item} to="/" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#94a3b8',
                padding: '0.3rem 0',
                transition: 'color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Hosting */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hosting</h4>
            {['Host Your Home', 'Responsible Hosting', 'AirCover for Hosts', 'Resources', 'Community Forum'].map((item) => (
              <Link key={item} to="/" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#94a3b8',
                padding: '0.3rem 0',
                transition: 'color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Support</h4>
            {['Help Center', 'Safety Info', 'Cancellation Options', 'Report Issue', 'Accessibility'].map((item) => (
              <Link key={item} to="/" style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#94a3b8',
                padding: '0.3rem 0',
                transition: 'color 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            © {new Date().getFullYear()} Wanderlust, Inc. · Portfolio Project · All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <span>Sitemap</span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={13} /> English (IN)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
