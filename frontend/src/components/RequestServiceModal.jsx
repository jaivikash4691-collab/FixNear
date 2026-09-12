import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Car, Wrench, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { requestService } from '../services/requestService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RequestServiceModal = ({ mechanic, preselectedService = null, isOpen, onClose, onSuccess }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [vehicleId, setVehicleId] = useState('');
  const [serviceId, setServiceId] = useState(preselectedService?._id || '');
  const [serviceName, setServiceName] = useState(preselectedService?.name || 'General Vehicle Inspection');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [estimatedCost, setEstimatedCost] = useState(preselectedService?.price || 0);

  // Load customer's vehicles
  useEffect(() => {
    if (isOpen && isAuthenticated && isCustomer) {
      const fetchVehicles = async () => {
        try {
          setLoadingVehicles(true);
          const res = await vehicleService.getMyVehicles();
          if (res.success && res.data?.vehicles) {
            setVehicles(res.data.vehicles);
            if (res.data.vehicles.length > 0) {
              setVehicleId(res.data.vehicles[0]._id);
            }
          }
        } catch (error) {
          showToast('Failed to load your vehicles', 'error');
        } finally {
          setLoadingVehicles(false);
        }
      };

      fetchVehicles();
    }
  }, [isOpen, isAuthenticated, isCustomer]);

  useEffect(() => {
    if (preselectedService) {
      setServiceId(preselectedService._id);
      setServiceName(preselectedService.name);
      setEstimatedCost(preselectedService.price || 0);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to book a service', 'warning');
      navigate('/login');
      return;
    }

    if (!isCustomer) {
      showToast('Only customer accounts can request service', 'info');
      return;
    }

    if (!vehicleId) {
      showToast('Please select or add a vehicle first', 'warning');
      return;
    }

    if (!problemDescription.trim()) {
      showToast('Please describe the problem or required service', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        mechanicId: mechanic._id,
        vehicleId,
        serviceId: serviceId || null,
        serviceName,
        problemDescription,
        preferredDate,
        preferredTime,
        estimatedCost,
      };

      const res = await requestService.createRequest(payload);
      if (res.success) {
        showToast('Service request submitted successfully! Mechanic has been notified.', 'success');
        if (onSuccess) onSuccess(res.data.serviceRequest);
        onClose();
        navigate('/customer/service-history');
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit service request', 'error');
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
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
              Service Booking
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Request Service from {mechanic?.businessName}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-dim)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Vehicle Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Select Vehicle from Your Garage *
            </label>
            {loadingVehicles ? (
              <div className="skeleton" style={{ height: '42px', width: '100%' }} />
            ) : vehicles.length === 0 ? (
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.85rem',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>No vehicles registered in your garage yet.</span>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate('/customer/vehicles'); }}
                  style={{ fontWeight: 700, textDecoration: 'underline', color: 'var(--primary)' }}
                >
                  + Add Vehicle
                </button>
              </div>
            ) : (
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.brand} {v.model} ({v.year} • {v.fuelType}) — [{v.registrationNumber}]
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Service Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Service Requested
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. Brake Pad Replacement, AC Recharge, Periodic Service"
              required
            />
          </div>

          {/* Problem Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Problem Description / Specific Symptoms *
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe what's wrong (e.g., loud squeal when braking, AC not cooling, engine light on, oil leak...)"
              required
            />
          </div>

          {/* Preferred Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Preferred Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Preferred Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                <option value="08:30 AM">08:30 AM - Morning Slot</option>
                <option value="10:00 AM">10:00 AM - Mid Morning</option>
                <option value="12:00 PM">12:00 PM - Noon Slot</option>
                <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                <option value="05:00 PM">05:00 PM - Evening Slot</option>
              </select>
            </div>
          </div>

          {/* Pricing Notice */}
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Starting Cost:</span>
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
              ${estimatedCost || 35}
            </span>
          </div>

          {/* Submit Actions */}
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
              disabled={submitting || vehicles.length === 0}
              className="btn btn-primary"
            >
              {submitting ? 'Sending Request...' : 'Confirm & Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
