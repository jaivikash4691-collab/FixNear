import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Car, 
  User, 
  Phone, 
  Clock, 
  Check, 
  Search, 
  Wrench, 
  CheckCircle2, 
  XCircle,
  FileText
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import { StatusBadge } from '../../components/StatusBadge';
import { StatusUpdateModal } from '../../components/StatusUpdateModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';

export const MechanicRequestsPage = () => {
  const { showToast } = useToast();
  const { socket } = useSocket();
  const [tab, setTab] = useState('all'); // 'pending' | 'active' | 'completed' | 'all'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestService.getMechanicRequests({ tab });
      if (res.success && res.data?.requests) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      showToast('Error loading requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  // Real-time listener for incoming requests
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = () => {
      fetchRequests();
    };

    socket.on('new_service_request', handleNewRequest);

    return () => {
      socket.off('new_service_request', handleNewRequest);
    };
  }, [socket]);

  // Quick Action Handler to jump directly to next stage
  const handleQuickAdvance = async (req, nextStatus) => {
    try {
      const res = await requestService.updateStatus(req._id, {
        status: nextStatus,
        note: `Transitioned to ${nextStatus}`,
        estimatedCost: req.estimatedCost,
        finalCost: req.finalCost,
        technicianNotes: req.technicianNotes,
      });

      if (res.success) {
        showToast(`Request updated to ${nextStatus}!`, 'success');
        fetchRequests();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Repair Requests Queue
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Accept new customer requests, manage diagnostic stages, and update repair progress in real-time.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {[
          { key: 'pending', label: '1. Pending Bookings' },
          { key: 'active', label: '2. In-Bay Active Repairs' },
          { key: 'completed', label: '3. Completed Jobs' },
          { key: 'all', label: 'All Requests' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: tab === t.key ? '#041019' : 'var(--text-muted)',
              backgroundColor: tab === t.key ? 'var(--primary)' : 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              transition: 'var(--transition)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<CalendarClock size={32} />}
          title="No requests in this category"
          description="Customer repair bookings matching this status will appear here."
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={15} color="var(--primary)" />
                      <strong>{req.customer?.name}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={15} color="var(--success)" />
                      {req.customer?.phone || 'No phone'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Car size={15} color="var(--secondary)" />
                      {req.vehicle?.brand} {req.vehicle?.model} ({req.vehicle?.registrationNumber})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={15} color="var(--accent)" />
                      Requested for: <strong>{req.preferredDate} at {req.preferredTime}</strong>
                    </span>
                  </div>
                </div>

                {/* Costs */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    {req.finalCost ? 'Final Bill' : 'Estimate'}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                    ${req.finalCost || req.estimatedCost || 0}
                  </div>
                </div>
              </div>

              {/* Problem description & notes */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                <div style={{ color: 'var(--text-main)', marginBottom: req.technicianNotes ? '0.4rem' : '0' }}>
                  <strong style={{ color: 'var(--text-dim)' }}>Customer Symptoms:</strong> "{req.problemDescription}"
                </div>
                {req.technicianNotes && (
                  <div style={{ color: 'var(--primary)' }}>
                    <strong>Work Log:</strong> {req.technicianNotes}
                  </div>
                )}
              </div>

              {/* Status Flow Action Buttons */}
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
                  Created {new Date(req.createdAt).toLocaleDateString()}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Quick Advance shortcuts based on current stage */}
                  {req.status === 'REQUESTED' && (
                    <>
                      <button
                        onClick={() => handleQuickAdvance(req, 'ACCEPTED')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Check size={14} /> Accept Booking
                      </button>
                      <button
                        onClick={() => handleQuickAdvance(req, 'REJECTED')}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#f87171' }}
                      >
                        <XCircle size={14} /> Decline
                      </button>
                    </>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleQuickAdvance(req, 'DIAGNOSING')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Search size={14} /> Start Diagnosis
                    </button>
                  )}

                  {req.status === 'DIAGNOSING' && (
                    <button
                      onClick={() => handleQuickAdvance(req, 'REPAIRING')}
                      className="btn btn-primary btn-sm"
                    >
                      <Wrench size={14} /> Begin Repair
                    </button>
                  )}

                  {req.status === 'REPAIRING' && (
                    <button
                      onClick={() => handleQuickAdvance(req, 'READY')}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={14} /> Mark Vehicle Ready
                    </button>
                  )}

                  {req.status === 'READY' && (
                    <button
                      onClick={() => handleQuickAdvance(req, 'COMPLETED')}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: 'var(--success)', color: '#ffffff' }}
                    >
                      <CheckCircle2 size={14} /> Complete & Settle
                    </button>
                  )}

                  {/* Open Detailed Status & Cost Modal */}
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsUpdateModalOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Edit Stage / Cost
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          request={selectedRequest}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRequest(null);
          }}
          onUpdated={() => {
            fetchRequests();
          }}
        />
      )}
    </div>
  );
};
