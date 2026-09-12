import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  Wrench, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign,
  Activity
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import { ServiceTimeline } from '../../components/ServiceTimeline';
import { StatusBadge } from '../../components/StatusBadge';
import { ReviewModal } from '../../components/ReviewModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const { socket, joinRequestRoom, leaveRequestRoom } = useSocket();
  const { showToast } = useToast();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await requestService.getRequestById(id);
      if (res.success && res.data?.request) {
        setRequest(res.data.request);
      }
    } catch (error) {
      showToast('Failed to load service tracking details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
    joinRequestRoom(id);

    return () => {
      leaveRequestRoom(id);
    };
  }, [id]);

  // Real-time socket event listener for this specific request
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      if (data.requestId === id) {
        showToast(`⚡ Live Update: Repair status updated to ${data.status}!`, 'info');
        fetchRequestDetails();
      }
    };

    socket.on('service_status_updated', handleStatusUpdate);

    return () => {
      socket.off('service_status_updated', handleStatusUpdate);
    };
  }, [socket, id]);

  if (loading) {
    return <SkeletonLoader type="card" count={2} />;
  }

  if (!request) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Service Request Not Found</h3>
        <Link to="/customer/service-history" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Service History
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back Link */}
      <div>
        <Link
          to="/customer/service-history"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={16} /> Back to History
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                <Activity size={12} /> Live Status Tracking
              </span>
              <StatusBadge status={request.status} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {request.serviceName}
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              ORDER ID: #{request._id.toUpperCase()}
            </p>
          </div>

          {/* Action to Review if COMPLETED */}
          {request.status === 'COMPLETED' && !request.ratingGiven && (
            <button
              onClick={() => setIsReviewOpen(true)}
              className="btn btn-primary"
            >
              <Star size={16} /> Leave Verified Review
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Live Timeline on Left, Details on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="tracking-grid">
        {/* Left: 6-Stage Visual Timeline */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Service Progress Timeline
            </h2>
            <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
              Live updates enabled
            </span>
          </div>

          <ServiceTimeline
            status={request.status}
            statusHistory={request.statusHistory}
          />
        </div>

        {/* Right: Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Workshop Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={17} color="var(--primary)" />
              Service Workshop
            </h3>

            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {request.mechanic?.businessName}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--primary)" />
                {request.mechanic?.address || request.mechanic?.city}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--success)" />
                {request.mechanic?.phone}
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Link to={`/mechanic/${request.mechanic?._id}`} style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                View Full Workshop Profile →
              </Link>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Car size={17} color="var(--secondary)" />
              Vehicle Serviced
            </h3>

            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {request.vehicle?.brand} {request.vehicle?.model}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
              {request.vehicle?.year} • {request.vehicle?.fuelType}
            </div>

            <div style={{
              display: 'inline-block',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}>
              {request.vehicle?.registrationNumber}
            </div>
          </div>

          {/* Billing & Estimates */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              Service Billing Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Initial Estimate:</span>
              <span>${request.estimatedCost || 0}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#ffffff',
            }}>
              <span>Total Bill:</span>
              <span style={{ color: 'var(--primary)' }}>
                ${request.finalCost || request.estimatedCost || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        request={request}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewed={() => {
          fetchRequestDetails();
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .tracking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
