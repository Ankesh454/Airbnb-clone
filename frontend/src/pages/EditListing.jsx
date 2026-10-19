import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ImagePlus, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Users, 
  Loader2,
  X,
  Plus
} from 'lucide-react';

const CATEGORIES = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Beachfront", "Cabins", "Luxury"];
const AMENITY_OPTIONS = ["Wifi", "Kitchen", "Free Parking", "Air Conditioning", "Dedicated Workspace", "Pool", "Garden", "TV", "Washer", "Dryer", "Iron"];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [urlInputs, setUrlInputs] = useState(['']);

  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '', country: '',
    category: 'Trending', bedrooms: '1', bathrooms: '1', maxGuests: '2',
    amenities: [],
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.getListingById(id);
        if (res.success) {
          const l = res.data;
          setForm({
            title: l.title || '', description: l.description || '',
            price: l.price?.toString() || '', location: l.location || '',
            country: l.country || '', category: l.category || 'Trending',
            bedrooms: l.bedrooms?.toString() || '1', bathrooms: l.bathrooms?.toString() || '1',
            maxGuests: l.maxGuests?.toString() || '2',
            amenities: l.amenities || [],
          });

          // Preload existing images
          const imgs = (l.images && l.images.length > 0)
            ? l.images.map(img => img.url)
            : (l.image?.url ? [l.image.url] : []);
          setExistingImages(imgs);
          setImagePreviews(imgs);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmenityToggle = (am) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(am) ? prev.amenities.filter((a) => a !== am) : [...prev.amenities, am]
    }));
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const combinedFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(combinedFiles);
    setImagePreviews(combinedFiles.map(file => URL.createObjectURL(file)));
  };

  const removePhoto = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  const handleUrlChange = (index, value) => {
    const updated = [...urlInputs];
    updated[index] = value;
    setUrlInputs(updated);
  };

  const addUrlInput = () => {
    if (urlInputs.length < 5) setUrlInputs([...urlInputs, '']);
  };

  const removeUrlInput = (index) => {
    setUrlInputs(urlInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'amenities') formData.append(key, val.join(','));
        else formData.append(key, val);
      });

      // Append new files
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      // Append URLs
      const validUrls = urlInputs.map(u => u.trim()).filter(Boolean);
      if (validUrls.length > 0) {
        validUrls.forEach(url => {
          formData.append('imageUrls', url);
        });
      }

      const res = await api.updateListing(id, formData);
      if (res.success) navigate(`/listings/${id}`);
      else setError(res.message || 'Update failed');
    } catch { setError('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  if (!user) {
    return (<><Navbar /><div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}><p>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>log in</Link>.</p></div><Footer /></>);
  }

  if (loading) {
    return (<><Navbar /><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '0.5rem', color: 'var(--text-muted)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /><span>Loading...</span><style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style></div></>);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Edit Listing</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update your property details and photos below.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Multiple Photos Upload */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  Property Photos (Up to 5)
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {imagePreviews.length}/5 photos
                </span>
              </div>

              {/* Previews grid */}
              {imagePreviews.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '10px',
                  marginBottom: '1rem'
                }}>
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: idx === 0 ? '2px solid var(--primary)' : '1px solid var(--border)'
                    }}>
                      <img
                        src={preview}
                        alt={`Photo ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {idx === 0 && (
                        <span style={{
                          position: 'absolute', bottom: 4, left: 4,
                          background: 'rgba(0,0,0,0.7)', color: '#fff',
                          fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700
                        }}>
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(0,0,0,0.65)', color: '#fff',
                          border: 'none', borderRadius: '50%',
                          width: '22px', height: '22px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone */}
              {imagePreviews.length < 5 && (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '100%', minHeight: '160px', border: '2px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', overflow: 'hidden',
                  background: 'var(--surface-hover)', padding: '1.5rem'
                }}>
                  <ImagePlus size={36} style={{ marginBottom: '0.5rem', color: 'var(--primary)' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Upload New Photos (Select up to 5)</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Click or drag & drop images to replace/add
                  </p>
                  <input type="file" accept="image/*" multiple onChange={handleMultipleFiles} style={{ display: 'none' }} />
                </label>
              )}

              {/* Image URL input */}
              <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Or add image URLs:
                </p>
                {urlInputs.map((url, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="url"
                      placeholder={`https://images.unsplash.com/... (Photo ${idx + 1})`}
                      value={url}
                      onChange={(e) => handleUrlChange(idx, e.target.value)}
                      style={{
                        flex: 1, padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                        fontSize: '0.85rem'
                      }}
                    />
                    {urlInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUrlInput(idx)}
                        style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0 8px', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {urlInputs.length < 5 && (
                  <button
                    type="button"
                    onClick={addUrlInput}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.2rem' }}
                  >
                    <Plus size={13} /> Add another image URL
                  </button>
                )}
              </div>
            </div>

            <InputField label="Title" name="title" value={form.title} onChange={handleChange} required />
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} required
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', fontSize: '0.92rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField label="Location" name="location" value={form.location} onChange={handleChange} icon={<MapPin size={16} />} required />
              <InputField label="Country" name="country" value={form.country} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} icon={<DollarSign size={16} />} required />
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', fontSize: '0.92rem', background: '#fff', fontFamily: 'inherit' }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <InputField label="Bedrooms" name="bedrooms" type="number" min="1" value={form.bedrooms} onChange={handleChange} icon={<Bed size={16} />} />
              <InputField label="Bathrooms" name="bathrooms" type="number" min="1" value={form.bathrooms} onChange={handleChange} icon={<Bath size={16} />} />
              <InputField label="Max Guests" name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={handleChange} icon={<Users size={16} />} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Amenities</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {AMENITY_OPTIONS.map((am) => {
                  const selected = form.amenities.includes(am);
                  return (
                    <button key={am} type="button" onClick={() => handleAmenityToggle(am)}
                      style={{
                        padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-pill)',
                        border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: selected ? 'var(--primary-subtle)' : '#fff',
                        color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer'
                      }}>
                      {am}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#b91c1c', fontSize: '0.88rem' }}>{error}</div>}

            <button type="submit" disabled={submitting}
              style={{
                padding: '0.9rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-gradient)',
                color: '#fff', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)', cursor: submitting ? 'not-allowed' : 'pointer'
              }}>
              {submitting ? (<><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /><span>Updating Listing...</span></>) : <span>Update Listing</span>}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const InputField = ({ label, icon, ...props }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>{label}</label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>}
      <input {...props} style={{ width: '100%', padding: '0.85rem', paddingLeft: icon ? '2.4rem' : '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', outline: 'none', fontSize: '0.92rem', fontFamily: 'inherit' }} />
    </div>
  </div>
);

export default EditListing;
