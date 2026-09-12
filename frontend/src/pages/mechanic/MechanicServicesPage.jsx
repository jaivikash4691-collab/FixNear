import React, { useState, useEffect } from 'react';
import { Plus, Wrench, Clock, DollarSign, Edit2, Trash2, X, Car, Check } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { mechanicService } from '../../services/mechanicService';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const MechanicServicesPage = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General Service');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [vehicleTypes, setVehicleTypes] = useState(['Car', 'SUV']);
  const [isAvailable, setIsAvailable] = useState(true);

  const categories = [
    'General Service',
    'Engine Repair',
    'Brake Service',
    'Battery Service',
    'Tyre Service',
    'Oil Change',
    'AC Service',
    'Electrical Repair',
    'Car Wash',
    'Emergency Repair',
    'Other',
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await mechanicService.getMyProfile();
      if (res.success && res.data?.services) {
        setServices(res.data.services);
      }
    } catch (error) {
      showToast('Failed to load workshop services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('General Service');
    setDescription('');
    setPrice('');
    setEstimatedDuration('1-2 hours');
    setVehicleTypes(['Car', 'SUV']);
    setIsAvailable(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setName(svc.name || '');
    setCategory(svc.category || 'General Service');
    setDescription(svc.description || '');
    setPrice(svc.price || '');
    setEstimatedDuration(svc.estimatedDuration || '1-2 hours');
    setVehicleTypes(svc.vehicleTypes || ['Car', 'SUV']);
    setIsAvailable(svc.isAvailable !== undefined ? svc.isAvailable : true);
    setIsModalOpen(true);
  };

  const handleToggleVehicleType = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter((t) => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to remove this service offering?')) {
      return;
    }

    try {
      const res = await serviceService.deleteService(serviceId);
      if (res.success) {
        showToast('Service deleted successfully', 'success');
        setServices(services.filter((s) => s._id !== serviceId));
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete service', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || price === '') {
      showToast('Please provide service name and starting price', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        category,
        description,
        price: Number(price),
        estimatedDuration,
        vehicleTypes,
        isAvailable,
      };

      if (editingService) {
        const res = await serviceService.updateService(editingService._id, payload);
        if (res.success) {
          showToast('Service offering updated!', 'success');
          setIsModalOpen(false);
          fetchServices();
        }
      } else {
        const res = await serviceService.createService(payload);
        if (res.success) {
          showToast('New service added to workshop menu!', 'success');
          setIsModalOpen(false);
          fetchServices();
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to save service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Service Menu & Rate Card ({services.length})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure your workshop's service offerings, pricing, estimated turnaround times, and supported vehicles.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={<Wrench size={32} />}
          title="No services added yet"
          description="Add your first service offering so local vehicle owners can discover your capabilities and book appointments."
          action={
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} /> Add Service Item
            </button>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {services.map((svc) => (
            <div
              key={svc._id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {svc.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {svc.estimatedDuration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {svc.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {svc.description || 'Professional maintenance and repair service.'}
                </p>

                {/* Vehicle compatibility */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {(svc.vehicleTypes || []).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.725rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-dim)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>STARTING PRICE</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>${svc.price}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(svc._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span className="badge badge-secondary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                  Catalog Management
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {editingService ? 'Edit Service Offering' : 'Add New Service Offering'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-dim)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Service Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Service Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Periodic Full Maintenance, Ceramic Brake Pad Replacement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Category & Starting Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Starting Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 85"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Estimated Duration */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Estimated Turnaround Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45 mins, 2-3 hours, 1 day"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                />
              </div>

              {/* Vehicle Compatibility */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Supported Vehicle Types
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Car', 'Bike', 'Scooter', 'SUV', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleVehicleType(t)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: vehicleTypes.includes(t) ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: vehicleTypes.includes(t) ? '#041019' : 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Description & Included Inspection Points
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed breakdown of what is included (e.g., fluid top-up, 50-point safety check, OEM filter change)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
