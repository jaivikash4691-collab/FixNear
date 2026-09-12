import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Car, 
  Calendar, 
  Wrench, 
  Star, 
  ArrowRight, 
  XCircle, 
  CheckCircle2, 
  DollarSign 
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import { StatusBadge } from '../../components/StatusBadge';
import { ReviewModal } from '../../components/ReviewModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const CustomerHistoryPage = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState('active'); // 'active' | 'history'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewRequest, setReviewRequest] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestService.getCustomerRequests({ type: tab });
      if (res.success && res.data?.requests) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      showToast('Failed to load service requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  const handleCancelRequest = async (requestId) => {
    const reason = window.prompt('Please provide a brief reason for cancellation:');
    if (!reason) return;

    try {
      const res = await requestService.cancelRequest(requestId, { reason });
      if (res.success) {
        showToast('Service request cancelled', 'info');
        fetchRequests();
      }
    } catch (error) {
      showToast(error.message || 'Failed to cancel request', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Service History & Tracking
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Monitor live active repairs or view past service invoices and leave reviews.
          </p>
        </div>

        <Link to="/find-mechanic" className="btn btn-primary btn-sm">
          <Wrench size={15} /> Book New Service
        </Link>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem',
      }}>
        <button
          onClick={() => setTab('active')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: tab === 'active' ? '#041019' : 'var(--text-muted)',
            backgroundColor: tab === 'active' ? 'var(--primary)' : 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            transition: 'var(--transition)',
          }}
        >
          Active Repairs
        </button>
        <button
          onClick={() => setTab('history')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: tab === 'history' ? '#ffffff' : 'var(--text-muted)',
            backgroundColor: tab === 'history' ? 'var(--secondary)' : 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            transition: 'var(--transition)',
          }}
        >
          Completed & Past History
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<Clock size={32} />}
          title={tab === 'active' ? 'No active repairs in progress' : 'No service history yet'}
          description={
            tab === 'active'
              ? 'When you request a service from a mechanic, its live diagnostic & repair progress will appear here.'
              : 'Completed vehicle repairs and billing history will be logged here for lifetime record keeping.'
          }
          action={
            <Link to="/find-mechanic" className="btn btn-primary">
              Find a Mechanic
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {requests.map((req) => (
            <div
              key={req._id}
              className="card card-hover"
              style={{ padding: '1.5rem' }}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <StatusBadge status={req.status} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      REF #{req._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {req.serviceName}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Car size={15} color="var(--primary)" />
                      <strong>{req.vehicle?.brand} {req.vehicle?.model}</strong> ({req.vehicle?.registrationNumber})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Wrench size={15} color="var(--secondary)" />
                      {req.mechanic?.businessName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={15} color="var(--accent)" />
                      {req.preferredDate} at {req.preferredTime}
                    </span>
                  </div>
                </div>

                {/* Costs */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    {req.finalCost ? 'Final Bill' : 'Estimated Cost'}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    ${req.finalCost || req.estimatedCost || 0}
                  </div>
                </div>
              </div>

              {/* Problem description / Tech note */}
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>
                <strong>Problem Stated:</strong> {req.problemDescription}
                {req.technicianNotes && (
                  <div style={{ marginTop: '0.35rem', color: 'var(--primary)' }}>
                    <strong>Technician Update:</strong> {req.technicianNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Requested on {new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Cancel button if requested */}
                  {req.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleCancelRequest(req._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#f87171' }}
                    >
                      <XCircle size={14} /> Cancel Request
                    </button>
                  )}

                  {/* Review button if COMPLETED and not rated */}
                  {req.status === 'COMPLETED' && !req.ratingGiven && (
                    <button
                      onClick={() => {
                        setReviewRequest(req);
                        setIsReviewOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Star size={14} /> Rate & Review Mechanic
                    </button>
                  )}

                  {req.status === 'COMPLETED' && req.ratingGiven && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <CheckCircle2 size={15} /> Reviewed
                    </span>
                  )}

                  <Link
                    to={`/customer/services/${req._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Track Live Timeline <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          isOpen={isReviewOpen}
          onClose={() => {
            setIsReviewOpen(false);
            setReviewRequest(null);
          }}
          onReviewed={() => {
            fetchRequests();
          }}
        />
      )}
    </div>
  );
};
