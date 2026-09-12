import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, Search, XCircle, DollarSign, FileText } from 'lucide-react';
import { requestService } from '../services/requestService';
import { useToast } from '../context/ToastContext';

export const StatusUpdateModal = ({ request, isOpen, onClose, onUpdated }) => {
  const { showToast } = useToast();
  const [status, setStatus] = useState(request?.status || 'ACCEPTED');
  const [note, setNote] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(request?.estimatedCost || 0);
  const [finalCost, setFinalCost] = useState(request?.finalCost || request?.estimatedCost || 0);
  const [technicianNotes, setTechnicianNotes] = useState(request?.technicianNotes || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const statusOptions = [
    { value: 'ACCEPTED', label: '1. Accept Request (Bay Reserved)', icon: '🔧' },
    { value: 'DIAGNOSING', label: '2. Start Diagnosis & Inspection', icon: '🔍' },
    { value: 'REPAIRING', label: '3. Repair In Progress', icon: '🛠️' },
    { value: 'READY', label: '4. Vehicle Ready for Pickup', icon: '🚗' },
    { value: 'COMPLETED', label: '5. Completed & Settled', icon: '✅' },
    { value: 'REJECTED', label: 'Decline / Reject Request', icon: '❌' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await requestService.updateStatus(request._id, {
        status,
        note: note || `Status transitioned to ${status}`,
        estimatedCost,
        finalCost,
        technicianNotes,
      });

      if (res.success) {
        showToast(`Request status updated to ${status}!`, 'success');
        if (onUpdated) onUpdated(res.data.serviceRequest);
        onClose();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span className="badge badge-secondary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
              Mechanic Workflow
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Update Repair Stage #{request._id.slice(-6).toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-dim)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Target Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Select Next Stage *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Note for Customer */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Customer Status Update Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Brake lathe resurfacing done, installing new ceramic pads."
            />
          </div>

          {/* Pricing fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Estimated Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Final Total Bill ($)
              </label>
              <input
                type="number"
                min="0"
                value={finalCost}
                onChange={(e) => setFinalCost(e.target.value)}
              />
            </div>
          </div>

          {/* Technician Internal Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Technician Diagnosis & Work Log
            </label>
            <textarea
              rows={3}
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="Detailed technical notes regarding parts replaced, sensor readouts, rotor thickness, torque specs..."
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Updating...' : 'Publish Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
