import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  CalendarClock, 
  DollarSign, 
  Star, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Activity
} from 'lucide-react';
import { statsService } from '../../services/statsService';
import { requestService } from '../../services/requestService';
import { StatusBadge } from '../../components/StatusBadge';
import { StatusUpdateModal } from '../../components/StatusUpdateModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const MechanicDashboard = () => {
  const { user, mechanicProfile } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsService.getMechanicStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      showToast('Error loading workshop stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <SkeletonLoader type="card" count={4} />;
  }

  const kpis = stats?.kpis || {
    todayRequests: 0,
    pendingRequests: 0,
    activeRepairs: 0,
    completedServices: 0,
    totalServices: 0,
    totalRevenue: 0,
    customerCount: 0,
    averageRating: 4.8,
    reviewCount: 0,
  };

  const recentRequests = stats?.recentRequests || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-secondary">Verified Workshop</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              {mechanicProfile?.city || 'Bangalore'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {mechanicProfile?.businessName || `${user?.name}'s Workshop`}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Workshop operations, active service queue, and live repair updates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/mechanic/requests" className="btn btn-primary btn-sm">
            <CalendarClock size={16} /> View All Requests ({kpis.totalServices})
          </Link>
          <Link to="/mechanic/services" className="btn btn-outline btn-sm">
            <Wrench size={16} /> Manage Service Menu
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Today's Requests */}
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
            <CalendarClock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.todayRequests}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Today's Bookings</div>
          </div>
        </div>

        {/* Active Repairs in Bay */}
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
            <Wrench size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.activeRepairs}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Active in Bays</div>
          </div>
        </div>

        {/* Total Completed */}
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
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{kpis.completedServices}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Jobs Completed</div>
          </div>
        </div>

        {/* Workshop Revenue */}
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
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              ${kpis.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Gross Billed</div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Star size={22} fill="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              {kpis.averageRating || 4.8}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Rating ({kpis.reviewCount} reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Pending / Active Requests Table Preview */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Service Requests Queue
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Latest bookings and active repairs requiring workshop action.
            </p>
          </div>

          <Link to="/mechanic/requests" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Open Kanban / Full Queue →
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No recent service requests received.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentRequests.map((req) => (
              <div
                key={req._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                    <StatusBadge status={req.status} size="sm" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {req.serviceName}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Customer: <strong style={{ color: '#ffffff' }}>{req.customer?.name}</strong> ({req.customer?.phone || 'N/A'}) • Vehicle: <strong style={{ color: '#ffffff' }}>{req.vehicle?.brand} {req.vehicle?.model}</strong> [{req.vehicle?.registrationNumber}]
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Slot: {req.preferredDate} at {req.preferredTime} • Problem: "{req.problemDescription}"
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>EST / BILL</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      ${req.finalCost || req.estimatedCost || 0}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsUpdateModalOpen(true);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Update Stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          request={selectedRequest}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRequest(null);
          }}
          onUpdated={() => {
            fetchStats();
          }}
        />
      )}
    </div>
  );
};
