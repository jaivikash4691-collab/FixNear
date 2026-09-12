import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  max = 5,
  size = 16,
  interactive = false,
  onChange = null,
  showValue = false,
  reviewCount = null,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                padding: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFilled ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (interactive) e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                if (interactive) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Star
                size={size}
                fill={isFilled ? '#f59e0b' : 'transparent'}
                stroke={isFilled ? '#f59e0b' : 'currentColor'}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}

      {reviewCount !== null && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
