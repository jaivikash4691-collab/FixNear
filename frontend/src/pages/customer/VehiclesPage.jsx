import React, { useState, useEffect } from 'react';
import { Plus, Car, X, Shield, Edit2, Trash2 } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { VehicleCard } from '../../components/VehicleCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

export const VehiclesPage = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [vehicleType, setVehicleType] = useState('Car');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [fuelType, setFuelType] = useState('Petrol');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await vehicleService.getMyVehicles();
      if (res.success && res.data?.vehicles) {
        setVehicles(res.data.vehicles);
      }
    } catch (error) {
      showToast('Error loading vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setVehicleType('Car');
    setBrand('');
    setModel('');
    setYear(new Date().getFullYear());
    setFuelType('Petrol');
    setRegistrationNumber('');
    setMileage('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (veh) => {
    setEditingVehicle(veh);
    setVehicleType(veh.vehicleType || 'Car');
    setBrand(veh.brand || '');
    setModel(veh.model || '');
    setYear(veh.year || new Date().getFullYear());
    setFuelType(veh.fuelType || 'Petrol');
    setRegistrationNumber(veh.registrationNumber || '');
    setMileage(veh.mileage !== undefined ? veh.mileage : '');
    setNotes(veh.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      return;
    }

    try {
      const res = await vehicleService.deleteVehicle(vehicleId);
      if (res.success) {
        showToast('Vehicle removed successfully', 'success');
        setVehicles(vehicles.filter((v) => v._id !== vehicleId));
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete vehicle', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand || !model || !year || !registrationNumber) {
      showToast('Please fill all required vehicle fields', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        vehicleType,
        brand,
        model,
        year: Number(year),
        fuelType,
        registrationNumber,
        mileage: mileage ? Number(mileage) : 0,
        notes,
      };

      if (editingVehicle) {
        const res = await vehicleService.updateVehicle(editingVehicle._id, payload);
        if (res.success) {
          showToast('Vehicle updated successfully', 'success');
          setIsModalOpen(false);
          fetchVehicles();
        }
      } else {
        const res = await vehicleService.createVehicle(payload);
        if (res.success) {
          showToast('Vehicle added to your garage!', 'success');
          setIsModalOpen(false);
          fetchVehicles();
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to save vehicle', 'error');
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
            My Garage ({vehicles.length})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add and manage your cars, motorcycles, and scooters for instant service requests.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Vehicle
        </button>
      </div>

      {/* Grid of Vehicles */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={<Car size={32} />}
          title="No vehicles in your garage"
          description="Add your vehicle details once, and easily select it whenever requesting repairs or maintenance."
          action={
            <button onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} /> Add Your First Vehicle
            </button>
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {vehicles.map((veh) => (
            <VehicleCard
              key={veh._id}
              vehicle={veh}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
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
                <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
                  Garage Management
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {editingVehicle ? 'Edit Vehicle Details' : 'Add Vehicle to Garage'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-dim)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Vehicle Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Vehicle Type *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {['Car', 'Bike', 'Scooter', 'SUV'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVehicleType(t)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        backgroundColor: vehicleType === t ? 'var(--primary)' : 'var(--bg-tertiary)',
                        color: vehicleType === t ? '#041019' : 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'var(--transition)',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand & Model */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Honda, Yamaha, Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Model *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City ZX, R15 V4"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Year & Fuel Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Manufacturing Year *
                  </label>
                  <input
                    type="number"
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Fuel Type
                  </label>
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Registration & Mileage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Registration / Plate Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KA-01-MJ-4521"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Current Mileage (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 14200"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Maintenance Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, modification details, tire sizes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  {submitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add to Garage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
