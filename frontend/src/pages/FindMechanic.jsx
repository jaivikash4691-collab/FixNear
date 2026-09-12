import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  RotateCcw, 
  Navigation,
  Zap
} from 'lucide-react';
import { mechanicService } from '../services/mechanicService';
import { MechanicCard } from '../components/MechanicCard';
import { MapView } from '../components/MapView';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { RequestServiceModal } from '../components/RequestServiceModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';

export const FindMechanic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { latitude, longitude, isAllowed, refreshLocation } = useGeolocation();
  const { showToast } = useToast();

  // Search and Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [serviceCategory, setServiceCategory] = useState(searchParams.get('service') || '');
  const [vehicleType, setVehicleType] = useState(searchParams.get('vehicleType') || '');
  const [minRating, setMinRating] = useState('');
  const [radiusKm, setRadiusKm] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [sort, setSort] = useState('rating');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Data States
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [bookingMechanic, setBookingMechanic] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const params = {
        search: debouncedSearch || undefined,
        serviceCategory: serviceCategory || undefined,
        vehicleType: vehicleType || undefined,
        minRating: minRating || undefined,
        emergencyService: emergencyOnly ? 'true' : undefined,
        radiusKm: radiusKm || undefined,
        sort,
        lat: latitude,
        lng: longitude,
      };

      const res = await mechanicService.getMechanics(params);
      if (res.success && res.data?.mechanics) {
        setMechanics(res.data.mechanics);
      }
    } catch (error) {
      showToast('Error loading mechanics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, [debouncedSearch, serviceCategory, vehicleType, minRating, emergencyOnly, radiusKm, sort, latitude, longitude]);

  const handleResetFilters = () => {
    setSearch('');
    setServiceCategory('');
    setVehicleType('');
    setMinRating('');
    setRadiusKm('');
    setEmergencyOnly(false);
    setSort('rating');
    setSearchParams({});
  };

  const categories = [
    'General Service',
    'Engine Repair',
    'Brake Service',
    'Battery Service',
    'Tyre Service',
    'Oil Change',
    'AC Service',
    'Electrical Repair',
    'Emergency Repair',
  ];

  return (
    <div className="container-wide" style={{ padding: '2rem 1.5rem', minHeight: '85vh' }}>
      {/* Top Header & Search Strip */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Find Local Mechanics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {mechanics.length} verified workshops matching your search
            </p>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              display: 'flex',
            }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.4rem 0.85rem' }}
              >
                <Grid size={15} /> List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', padding: '0.4rem 0.85rem' }}
              >
                <MapIcon size={15} /> Map View
              </button>
            </div>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '0.65rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by workshop name, service (e.g. brakes, AC, clutch), or landmark..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', backgroundColor: 'transparent', border: 'none' }}
            />
          </div>

          {/* Location button */}
          <button
            onClick={() => {
              refreshLocation();
              showToast('Location updated from your browser GPS', 'info');
            }}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            title="Use current GPS location"
          >
            <Navigation size={14} color={isAllowed ? '#10b981' : 'var(--text-dim)'} />
            {isAllowed ? 'Using GPS' : 'Detect Location'}
          </button>

          {/* Sort Selector */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', padding: '0.45rem 0.65rem' }}
            >
              <option value="rating">Highest Rated</option>
              <option value="nearest">Nearest to Me</option>
              <option value="price_asc">Lowest Price</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.75rem', alignItems: 'flex-start' }} className="find-mechanic-layout">
        {/* Left Filter Sidebar */}
        <aside
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
          className={`filter-sidebar ${showFiltersMobile ? 'show-mobile' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={15} color="var(--primary)" />
              Filter Results
            </h3>
            <button
              onClick={handleResetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
              }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Search Radius */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Distance Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
            >
              <option value="">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">All Vehicle Types</option>
              <option value="Car">Car</option>
              <option value="Bike">Motorcycle</option>
              <option value="Scooter">Scooter</option>
              <option value="SUV">SUV</option>
            </select>
          </div>

          {/* Service Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Service Category
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
            >
              <option value="">All Services</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>
          </div>

          {/* 24/7 Roadside Rescue */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={15} color="#f59e0b" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                24/7 Roadside Rescue
              </span>
            </div>
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
          </div>
        </aside>

        {/* Results Area */}
        <section style={{ flex: 1 }}>
          {loading ? (
            <SkeletonLoader type="card" count={4} />
          ) : mechanics.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="No workshops found"
              description="No mechanics match your current filters. Try increasing the search distance radius or clearing the vehicle type filter."
              action={
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear Filters
                </button>
              }
            />
          ) : viewMode === 'map' ? (
            <div style={{ height: '580px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <MapView
                mechanics={mechanics}
                userLocation={{ latitude, longitude }}
                onMechanicSelect={(mech) => {
                  setBookingMechanic(mech);
                }}
              />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}>
              {mechanics.map((mech) => (
                <MechanicCard
                  key={mech._id}
                  mechanic={mech}
                  onBookClick={(selected) => {
                    setBookingMechanic(selected);
                    setIsBookingOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {bookingMechanic && (
        <RequestServiceModal
          mechanic={bookingMechanic}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setBookingMechanic(null);
          }}
          onSuccess={() => {
            setIsBookingOpen(false);
            setBookingMechanic(null);
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .find-mechanic-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar {
            display: none !important;
          }
          .filter-sidebar.show-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
