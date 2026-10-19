import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapView = ({ listings, token, onSelectListing, centerCoordinates, zoom = 3 }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!token || !mapContainerRef.current) return;

    mapboxgl.accessToken = token;

    const initialCenter = centerCoordinates || 
      (listings.length > 0 && listings[0].geometry?.coordinates 
        ? listings[0].geometry.coordinates 
        : [77.2090, 28.6139]);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: zoom,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Add custom markers for each listing
      listings.forEach((listing) => {
        if (!listing.geometry?.coordinates) return;

        const el = document.createElement('div');
        el.className = 'custom-map-pill';
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#0f172a';
        el.style.fontWeight = '700';
        el.style.fontSize = '12px';
        el.style.padding = '5px 9px';
        el.style.borderRadius = '24px';
        el.style.boxShadow = '0 3px 10px rgba(0,0,0,0.22)';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.border = '1px solid rgba(0,0,0,0.08)';
        el.innerText = `₹${(listing.price || 0).toLocaleString('en-IN')}`;

        el.addEventListener('mouseenter', () => {
          el.style.backgroundColor = '#0f172a';
          el.style.color = '#ffffff';
          el.style.transform = 'scale(1.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.backgroundColor = '#ffffff';
          el.style.color = '#0f172a';
          el.style.transform = 'scale(1)';
        });

        const popupHtml = `
          <div style="padding: 4px; max-width: 200px;">
            <img src="${listing.image?.url}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 2px 0;">${listing.title}</h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">${listing.location}, ${listing.country}</p>
            <p style="font-size: 13px; font-weight: 800; margin: 0; color: #ff385c;">₹${(listing.price || 0).toLocaleString('en-IN')} / night</p>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);

        new mapboxgl.Marker(el)
          .setLngLat(listing.geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [listings, token, centerCoordinates, zoom]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '450px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '450px' }} />
    </div>
  );
};
