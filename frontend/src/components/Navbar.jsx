import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Search, 
  User, 
  Menu, 
  Heart, 
  PlusCircle, 
  LogOut, 
  LogIn, 
  UserPlus,
  X,
  Compass
} from 'lucide-react';

export const Navbar = ({ searchVal, onSearchChange, onSearchSubmit }) => {
  const { user, logout, wishlist } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)'
    }}>
      {/* Top Navbar Row */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        gap: '0.75rem'
      }}>
        {/* Brand Logo - Travelora */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--primary)',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          flexShrink: 0
        }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: '12px',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)'
          }}>
            <Sparkles size={22} />
          </div>
          <span>Travelora</span>
        </Link>

        {/* Desktop Search Bar (Hidden on mobile <= 768px) */}
        <div className="hide-mobile" style={{ flex: 1, maxWidth: '440px', justifyContent: 'center' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 8px 5px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              width: '100%',
              transition: 'var(--transition)'
            }}
          >
            <input
              type="text"
              placeholder="Search destinations, villas, country..."
              value={searchVal || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                background: 'transparent'
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                background: 'var(--primary-gradient)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(255, 56, 92, 0.35)',
                cursor: 'pointer'
              }}
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Desktop Controls (Hidden on mobile) */}
        <div className="hide-mobile" style={{ alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link
            to="/listings/new"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition)'
            }}
          >
            <PlusCircle size={16} color="var(--primary)" />
            <span>Host a home</span>
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
            title="Wishlist"
          >
            <Heart size={20} fill={wishlist.length > 0 ? "var(--primary)" : "none"} color={wishlist.length > 0 ? "var(--primary)" : "currentColor"} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                background: 'var(--primary)', color: '#fff',
                fontSize: '10px', fontWeight: 700, borderRadius: '50%',
                width: '15px', height: '15px', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 12px',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <Menu size={16} color="var(--text-secondary)" />
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: user ? 'var(--primary-gradient)' : '#64748b',
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700
              }}>
                {user ? (user.username?.charAt(0).toUpperCase() || 'U') : <User size={14} />}
              </div>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '48px',
                width: '210px', backgroundColor: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid var(--border)',
                overflow: 'hidden', zIndex: 110,
                animation: 'slideDown 0.2s ease-out'
              }}>
                {user ? (
                  <>
                    <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{user.username}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email || 'Member'}</p>
                    </div>
                    <Link to="/listings/new" onClick={() => setDropdownOpen(false)} style={menuItemStyle}>
                      <PlusCircle size={15} /> Host a home
                    </Link>
                    <Link to="/wishlist" onClick={() => setDropdownOpen(false)} style={menuItemStyle}>
                      <Heart size={15} /> Wishlist ({wishlist.length})
                    </Link>
                    <button onClick={handleLogout} style={{ ...menuItemStyle, color: '#ef4444', borderTop: '1px solid var(--border)', width: '100%' }}>
                      <LogOut size={15} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setDropdownOpen(false)} style={{ ...menuItemStyle, fontWeight: 700, color: 'var(--primary)' }}>
                      <LogIn size={15} /> Log in
                    </Link>
                    <Link to="/signup" onClick={() => setDropdownOpen(false)} style={menuItemStyle}>
                      <UserPlus size={15} /> Sign up
                    </Link>
                    <Link to="/listings/new" onClick={() => setDropdownOpen(false)} style={{ ...menuItemStyle, borderTop: '1px solid var(--border)' }}>
                      <PlusCircle size={15} /> Host a home
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle (Right side on mobile) */}
        <div className="show-mobile-only" style={{ alignItems: 'center' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: '#fff',
              color: 'var(--text-primary)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Second Line on Mobile: Dedicated Full-Width Search Bar */}
      <div className="show-mobile-only" style={{
        padding: '0 0.85rem 0.75rem 0.85rem',
        width: '100%'
      }}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (onSearchSubmit) onSearchSubmit();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 8px 6px 14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            width: '100%'
          }}
        >
          <Search size={16} color="var(--primary)" style={{ flexShrink: 0, marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Where to? (e.g. Goa, Paris, Villa...)"
            value={searchVal || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange('')}
              style={{
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            style={{
              background: 'var(--primary-gradient)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(255, 56, 92, 0.35)',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#fff',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.25rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.25s ease-out'
        }}>
          {user ? (
            <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary-gradient)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{user.username}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email || 'Member'}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link
              to="/listings/new"
              onClick={() => setMobileMenuOpen(false)}
              style={mobileItemStyle}
            >
              <PlusCircle size={17} color="var(--primary)" />
              <span>Host a home</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              style={mobileItemStyle}
            >
              <Heart size={17} color="var(--primary)" />
              <span>Wishlist ({wishlist.length})</span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                style={{ ...mobileItemStyle, color: '#ef4444', borderTop: '1px solid var(--border)', marginTop: '0.4rem' }}
              >
                <LogOut size={17} />
                <span>Log out</span>
              </button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.7rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--primary)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '0.7rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.7rem 1rem',
  fontSize: '0.86rem',
  color: 'var(--text-primary)',
  transition: 'background-color 0.15s ease',
  cursor: 'pointer'
};

const mobileItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 0.5rem',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-sm)'
};

export default Navbar;
