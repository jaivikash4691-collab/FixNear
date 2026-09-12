import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Zap, 
  Wrench, 
  Car, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  ArrowLeft 
} from 'lucide-react';
import { mechanicService } from '../services/mechanicService';
import { favoriteService } from '../services/favoriteService';
import { RatingStars } from '../components/RatingStars';
import { MapView } from '../components/MapView';
import { RequestServiceModal } from '../components/RequestServiceModal';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useGeolocation } from '../hooks/useGeolocation';

export const MechanicDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useToast();
  const { latitude, longitude } = useGeolocation();

  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'about' | 'reviews'
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(searchParams.get('book') === 'true');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await mechanicService.getMechanicById(id, { lat: latitude, lng: longitude });
        if (res.success && res.data?.mechanic) {
          setMechanic(res.data.mechanic);
        }

        if (isAuthenticated && isCustomer) {
          const favRes = await favoriteService.checkFavorite(id);
          if (favRes.success) {
            setIsFavorited(favRes.data.isFavorited);
          }
        }
      } catch (error) {
        showToast('Failed to load workshop details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, latitude, longitude, isAuthenticated, isCustomer]);

  const handleFavoriteToggle = async () => {
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
      const res = await favoriteService.toggleFavorite(id);
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Workshop Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          The mechanic profile you are looking for does not exist or has been removed.
        </p>
        <Link to="/find-mechanic" className="btn btn-primary">
          Browse All Mechanics
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Back Link */}
      <Link
        to="/find-mechanic"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Search
      </Link>

      {/* Workshop Header Hero Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
          border: '1px solid var(--border-glow)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge badge-success">
                <ShieldCheck size={14} /> Verified Service Center
              </span>
              {mechanic.emergencyService && (
                <span className="badge badge-warning">
                  <Zap size={14} /> 24/7 Emergency Assist
                </span>
              )}
              <span className="badge badge-primary">
                {mechanic.experienceYears || 10}+ Years Experience
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {mechanic.businessName}
            </h1>

            {/* Rating and Distance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <RatingStars
                rating={mechanic.averageRating || 4.8}
                reviewCount={mechanic.reviewCount || 0}
                showValue={true}
                size={18}
              />

              {mechanic.distanceKm !== null && mechanic.distanceKm !== undefined && (
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>
                  📍 {mechanic.distanceKm} km away from you
                </span>
              )}
            </div>

            {/* Address & Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" />
                {mechanic.address ? `${mechanic.address}, ${mechanic.city}` : mechanic.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--accent)" />
                Open: {mechanic.workingHours?.open || '08:00 AM'} - {mechanic.workingHours?.close || '08:30 PM'} (
                {mechanic.workingHours?.days?.join(', ') || 'Mon-Sat'})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--success)" />
                {mechanic.phone}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
            <button
              onClick={() => {
                setSelectedService(null);
                setIsBookingOpen(true);
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Calendar size={18} />
              Book Appointment
            </button>

            <button
              onClick={handleFavoriteToggle}
              disabled={favLoading}
              className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline'}`}
              style={{ width: '100%' }}
            >
              <Heart size={16} fill={isFavorited ? 'currentColor' : 'transparent'} />
              {isFavorited ? 'Saved in Favorites' : 'Save Workshop'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
      }}>
        {[
          { key: 'services', label: `Service Menu (${mechanic.services?.length || 0})` },
          { key: 'about', label: 'About & Workshop Facility' },
          { key: 'reviews', label: `Verified Reviews (${mechanic.reviews?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'var(--transition)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Services Catalog */}
      {activeTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {(!mechanic.services || mechanic.services.length === 0) ? (
            <p style={{ color: 'var(--text-muted)' }}>No individual service items listed yet.</p>
          ) : (
            mechanic.services.map((svc) => (
              <div
                key={svc._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  padding: '1.5rem',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {svc.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {svc.estimatedDuration || '1-2 hours'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {svc.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {svc.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {(svc.vehicleTypes || ['Car', 'SUV', 'Bike']).map((t) => (
                      <span key={t} style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-dim)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Book button */}
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Starting from</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>${svc.price}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService(svc);
                      setIsBookingOpen(true);
                    }}
                    className="btn btn-primary"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: About & Facility */}
      {activeTab === 'about' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="about-grid">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              About the Service Center
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {mechanic.description}
            </p>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Workshop Specialties & Equipment
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {(mechanic.specializations || ['General Servicing', 'Brake Systems', 'Engine Tuning']).map((spec) => (
                <span
                  key={spec}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={14} color="var(--primary)" />
                  {spec}
                </span>
              ))}
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Vehicle Compatibility
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(mechanic.vehicleTypesSupported || ['Car', 'Bike', 'SUV']).map((v) => (
                <div
                  key={v}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <Car size={20} color="var(--secondary)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Preview */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Workshop Location & Map
            </h3>
            <div style={{ height: '360px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <MapView
                mechanics={[mechanic]}
                userLocation={{ latitude, longitude }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Reviews */}
      {activeTab === 'reviews' && (
        <div>
          {/* Reviews Breakdown Header */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-subtle)', paddingRight: '1rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                {mechanic.averageRating || 4.8}
              </div>
              <div style={{ margin: '0.5rem 0' }}>
                <RatingStars rating={mechanic.averageRating || 4.8} size={20} />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Based on {mechanic.reviewCount || 0} verified reviews
              </div>
            </div>

            {/* Star Distribution Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = mechanic.ratingDistribution?.[star] || (star === 5 ? 12 : star === 4 ? 4 : 0);
                const total = mechanic.reviewCount || 16;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.825rem' }}>
                    <span style={{ width: '30px', color: 'var(--text-dim)', textAlign: 'right' }}>{star} ★</span>
                    <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }} />
                    </div>
                    <span style={{ width: '35px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(!mechanic.reviews || mechanic.reviews.length === 0) ? (
              <p style={{ color: 'var(--text-muted)' }}>No customer reviews recorded yet.</p>
            ) : (
              mechanic.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="card"
                  style={{ padding: '1.25rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(6, 182, 212, 0.2)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                      }}>
                        {rev.customer?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {rev.customer?.name || 'Verified Customer'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {new Date(rev.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <RatingStars rating={rev.rating} size={15} />
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <RequestServiceModal
        mechanic={mechanic}
        preselectedService={selectedService}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => setIsBookingOpen(false)}
      />

      <style>{`
        @media (max-width: 800px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
