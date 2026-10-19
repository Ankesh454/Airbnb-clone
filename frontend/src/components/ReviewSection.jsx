import React, { useState } from 'react';
import { Star, Trash2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ReviewSection = ({ listingId, reviews, onReviewsUpdate }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await api.addReview(listingId, { rating, comment });
      if (res.success) {
        setComment('');
        setRating(5);
        if (onReviewsUpdate) onReviewsUpdate();
      } else {
        setError(res.message || 'Failed to submit review');
      }
    } catch {
      setError('An error occurred. Make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await api.deleteReview(listingId, reviewId);
      if (res.success && onReviewsUpdate) {
        onReviewsUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* Reviews Summary Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <Star size={24} fill="#f59e0b" color="#f59e0b" />
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {avgRating} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </h3>
      </div>

      {/* Review Ratings Breakdown Bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem 2.5rem',
        marginBottom: '2rem',
        padding: '1.25rem',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        {[
          { label: 'Cleanliness', score: '4.9' },
          { label: 'Accuracy', score: '5.0' },
          { label: 'Communication', score: '4.9' },
          { label: 'Location', score: '4.8' },
          { label: 'Check-in', score: '5.0' },
          { label: 'Value', score: '4.7' },
        ].map((cat) => (
          <div key={cat.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '90px', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(parseFloat(cat.score) / 5) * 100}%`, height: '100%', backgroundColor: 'var(--text-primary)' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, minWidth: '22px' }}>{cat.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Leave a review</h4>

          {/* Star selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ padding: '2px', cursor: 'pointer' }}
              >
                <Star
                  size={24}
                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                  color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
              {rating} of 5 stars
            </span>
          </div>

          <textarea
            placeholder="Share details of your own experience at this place..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              outline: 'none',
              fontSize: '0.92rem',
              resize: 'vertical',
              marginBottom: '0.85rem'
            }}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.65rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              backgroundColor: 'var(--text-primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              opacity: submitting ? 0.7 : 1
            }}
          >
            <Send size={15} />
            <span>{submitting ? 'Submitting...' : 'Post review'}</span>
          </button>
        </form>
      ) : (
        <div style={{
          padding: '1.25rem',
          backgroundColor: 'var(--surface-hover)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Please <a href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>log in</a> to leave a review.
        </div>
      )}

      {/* Review Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {reviews.map((rev) => (
          <div key={rev._id} style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  {rev.author?.username ? rev.author.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
                    {rev.author?.username || 'Guest'}
                  </h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? '#f59e0b' : 'none'}
                        color={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Verified Stay</span>
                  </div>
                </div>
              </div>

              {user && (user._id === rev.author?._id || user._id === rev.author) && (
                <button
                  onClick={() => handleDelete(rev._id)}
                  title="Delete review"
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {rev.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
