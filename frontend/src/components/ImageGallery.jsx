import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3x3, ImageOff } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
];

export const ImageGallery = ({ imageUrl, images: propImages, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Build resolved list of photos
  let resolvedImages = [];

  if (Array.isArray(propImages) && propImages.length > 0) {
    resolvedImages = propImages.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  }

  if (resolvedImages.length === 0 && imageUrl) {
    resolvedImages.push(imageUrl);
  }

  // Fill up to 5 photos with curated high-res fallbacks if less than 5 are provided
  while (resolvedImages.length < 5) {
    resolvedImages.push(FALLBACK_IMAGES[resolvedImages.length % FALLBACK_IMAGES.length]);
  }

  const handleImageError = (e, index) => {
    e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  return (
    <>
      {/* 5-Image Masonry Grid Layout (scales responsively on mobile) */}
      <div
        className="gallery-grid"
        style={{
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={() => setLightboxOpen(true)}
      >
        {/* Main large image */}
        <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3', overflow: 'hidden' }}>
          <img
            src={resolvedImages[0]}
            alt={title}
            onError={(e) => handleImageError(e, 0)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        {/* 4 Supporting images in 2x2 grid */}
        {resolvedImages.slice(1, 5).map((img, i) => (
          <div key={i} className="gallery-secondary" style={{ overflow: 'hidden' }}>
            <img
              src={img}
              alt={`${title} photo ${i + 2}`}
              onError={(e) => handleImageError(e, i + 1)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}

        {/* "Show all photos" button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: '#ffffff',
            color: 'var(--text-primary)',
            border: '1px solid #1e293b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '7px 15px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Grid3x3 size={15} />
          Show all photos ({resolvedImages.length})
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={resolvedImages}
          title={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

const Lightbox = ({ images, title, onClose }) => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            color: '#fff',
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>
        <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
          {current + 1} / {images.length} — {title}
        </span>
        <div style={{ width: '40px' }} />
      </div>

      {/* Image Display */}
      <img
        src={images[current]}
        alt={`Photo ${current + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '85vw',
          maxHeight: '80vh',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      />

      {/* Navigation arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
