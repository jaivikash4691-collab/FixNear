import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { favoriteService } from '../../services/favoriteService';
import { MechanicCard } from '../../components/MechanicCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const FavoritesPage = () => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getMyFavorites();
      if (res.success && res.data?.favorites) {
        setFavorites(res.data.favorites);
      }
    } catch (error) {
      showToast('Failed to load saved mechanics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Saved Mechanics ({favorites.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Your trusted bookmarked service centers for fast access and repeat bookings.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Heart size={32} />}
          title="No saved mechanics"
          description="Save mechanics you trust while searching to easily find them when you need service."
          action={
            <Link to="/find-mechanic" className="btn btn-primary">
              <Search size={16} /> Discover Mechanics
            </Link>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {favorites.map((fav) => (
            <MechanicCard
              key={fav._id}
              mechanic={fav.mechanic}
              initialFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
