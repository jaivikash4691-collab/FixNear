import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Clock, 
  Heart, 
  Plus, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  AlertCircle
} from 'lucide-react';
import { statsService } from '../../services/statsService';
import { vehicleService } from '../../services/vehicleService';
import { mechanicService } from '../../services/mechanicService';
import { StatusBadge } from '../../components/StatusBadge';
import { MechanicCard } from '../../components/MechanicCard';
import { VehicleCard } from '../../components/VehicleCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, vehiclesRes, mechanicsRes] = await Promise.all([
          statsService.getCustomerStats(),
          vehicleService.getMyVehicles(),
          mechanicService.getFeaturedMechanics(),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (vehiclesRes.success) setVehicles(vehiclesRes.data?.vehicles || []);
        if (mechanicsRes.success) setNearbyMechanics(mechanicsRes.data?.mechanics?.slice(0, 3) || []);
      } catch (error) {
        showToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <SkeletonLoader type="card" count={4} />;
  }

  const kpis = stats?.kpis || {
    activeRepairs: 0,
    vehiclesCount: 0,
    completedServices: 0,
    savedMechanicsCount: 0,
  };

  const activeRequest = stats?.activeRequest;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome & Quick Action Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your garage, track vehicle servicing, and find trusted local mechanics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/find-mechanic" className="btn btn-primary btn-sm">
            <Search size={15} /> Find a Mechanic
          </Link>
          <Link to="/customer/vehicles" className="btn btn-outline btn-sm">
            <Plus size={15} /> Add Vehicle
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.activeRepairs}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Active Repairs</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: 'var(--secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Car size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.vehiclesCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>My Vehicles</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.completedServices}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Completed Jobs</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Heart size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.savedMechanicsCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Saved Garages</div>
          </div>
        </div>
      </div>

      {/* Hero Active Repair Card */}
      {activeRequest && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid var(--border-glow)',
            padding: '1.75rem',
            position: 'relative',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  <Activity size={12} /> Active Service in Progress
                </span>
                <StatusBadge status={activeRequest.status} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activeRequest.serviceName}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Vehicle: <strong style={{ color: '#ffffff' }}>{activeRequest.vehicle?.brand} {activeRequest.vehicle?.model}</strong> ({activeRequest.vehicle?.registrationNumber}) • Workshop: <strong style={{ color: '#ffffff' }}>{activeRequest.mechanic?.businessName}</strong>
              </p>
            </div>

            <Link
              to={`/customer/services/${activeRequest._id}`}
              className="btn btn-primary btn-sm"
            >
              Track Live Timeline <ArrowRight size={14} />
            </Link>
          </div>

          {activeRequest.technicianNotes && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              borderLeft: '3px solid var(--primary)',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
            }}>
              <strong>Technician Work Log:</strong> {activeRequest.technicianNotes}
            </div>
          )}
        </div>
      )}

      {/* My Vehicles Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>My Garage</h2>
          <Link to="/customer/vehicles" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage Garage ({vehicles.length})
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <Car size={32} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>You haven't added a vehicle yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.35rem 0 1.25rem' }}>
              Add your car, bike, or SUV to request fast service estimates and maintain service logs.
            </p>
            <Link to="/customer/vehicles" className="btn btn-primary btn-sm">
              <Plus size={14} /> Add First Vehicle
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {vehicles.slice(0, 3).map((v) => (
              <div key={v._id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {v.vehicleType === 'Bike' || v.vehicleType === 'Scooter' ? '🏍️' : v.vehicleType === 'SUV' ? '🚙' : '🚗'}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{v.brand} {v.model}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {v.year} • {v.fuelType} • {v.registrationNumber}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current Mileage: {v.mileage ? `${v.mileage.toLocaleString()} km` : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Local Workshops */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Top Recommended Workshops</h2>
          <Link to="/find-mechanic" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Browse All Mechanics
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {nearbyMechanics.map((mech) => (
            <MechanicCard key={mech._id} mechanic={mech} />
          ))}
        </div>
      </div>
    </div>
  );
};
