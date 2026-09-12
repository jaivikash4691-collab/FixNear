import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';

export const ReviewModal = ({ request, isOpen, onClose, onReviewed }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      showToast('Please provide your review comments', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await reviewService.createReview({
        serviceRequestId: request._id,
        rating,
        comment,
      });

      if (res.success) {
        showToast('Thank you! Your verified review has been published.', 'success');
        if (onReviewed) onReviewed(res.data.review);
        onClose();
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span className="badge badge-success" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
              Verified Service Review
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Review {request.mechanic?.businessName || 'Mechanic'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-dim)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Star Selector */}
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              How was your service experience?
            </label>
            <RatingStars
              rating={rating}
              size={32}
              interactive={true}
              onChange={(newRating) => setRating(newRating)}
            />
            <div style={{ marginTop: '0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>
              {rating === 5 && '🌟 Outstanding & Highly Recommended!'}
              {rating === 4 && '👍 Great & Professional Work'}
              {rating === 3 && '👌 Satisfactory Service'}
              {rating === 2 && '⚠️ Needs Improvement'}
              {rating === 1 && '👎 Poor Experience'}
            </div>
          </div>

          {/* Feedback comment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Your Detailed Feedback *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other drivers about the quality of repair, turnaround time, technician honesty, and garage cleanliness..."
              required
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
