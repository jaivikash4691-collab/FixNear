import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Car, 
  Zap, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { RatingStars } from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';
import { useToast } from '../context/ToastContext';

export const MechanicCard = ({ mechanic, onBookClick = null, initialFavorited = false }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useToast();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in to save favorite workshops', 'warning');
      return;
    }
    if (!isCustomer) {
      showToast('Only customer accounts can save favorites', 'info');
      return;
    }

    try {
      setFavLoading(true);
      const res = await favoriteService.toggleFavorite(mechanic._id);
      if (res.success) {
        setIsFavorited(res.data.isFavorited);
        showToast(res.message, 'success');
      }
    } catch (error) {
      showToast(error.message || 'Error updating favorites', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.25rem',
      }}
    >
      <div>
        {/* Header: Verified badge & Heart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.65rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} /> Verified
              </span>
              {mechanic.emergencyService && (
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                  <Zap size={12} /> 24/7 Roadside
                </span>
              )}
            </div>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.3,
            }}>
              <Link to={`/mechanic/${mechanic._id}`} style={{ color: 'inherit' }}>
                {mechanic.businessName}
              </Link>
            </h3>
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorited ? '#ef4444' : 'var(--text-dim)',
              flexShrink: 0,
            }}
            title={isFavorited ? 'Remove from favorites' : 'Save workshop'}
          >
            <Heart
              size={16}
              fill={isFavorited ? '#ef4444' : 'transparent'}
              stroke={isFavorited ? '#ef4444' : 'currentColor'}
            />
          </button>
        </div>

        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <RatingStars
            rating={mechanic.averageRating || 4.8}
            reviewCount={mechanic.reviewCount || 0}
            showValue={true}
            size={14}
          />
        </div>

        {/* Location & Distance */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
        }}>
          <MapPin size={14} color="var(--primary)" flexShrink={0} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {mechanic.address ? `${mechanic.address}, ${mechanic.city}` : mechanic.city || 'Bangalore'}
          </span>
          {mechanic.distanceKm !== null && mechanic.distanceKm !== undefined && (
            <span style={{
              fontWeight: 700,
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '0.75rem',
              marginLeft: 'auto',
              flexShrink: 0,
            }}>
              {mechanic.distanceKm} km
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {mechanic.description}
        </p>

        {/* Supported Vehicle Types */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
          {(mechanic.vehicleTypesSupported || ['Car', 'Bike', 'SUV']).map((vType) => (
            <span
              key={vType}
              style={{
                fontSize: '0.725rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-dim)',
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              {vType}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.75rem',
        marginTop: '0.35rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Starting from
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
            ${mechanic.startingPrice || 35}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Link
            to={`/mechanic/${mechanic._id}`}
            className="btn btn-outline btn-sm"
          >
            Details
          </Link>
          <button
            onClick={() => {
              if (onBookClick) {
                onBookClick(mechanic);
              } else {
                window.location.href = `/mechanic/${mechanic._id}?book=true`;
              }
            }}
            className="btn btn-primary btn-sm"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};
