import React, { useState, useEffect } from 'react';
import { Building2, Phone, MapPin, Clock, Zap, Save, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { mechanicService } from '../../services/mechanicService';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const MechanicProfilePage = () => {
  const { user, mechanicProfile, updateUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [emergencyService, setEmergencyService] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('20:00');
  const [vehicleTypes, setVehicleTypes] = useState(['Car', 'SUV']);
  const [specializations, setSpecializations] = useState(['Engine Diagnostics', 'Brake Systems']);
  const [newSpecInput, setNewSpecInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await mechanicService.getMyProfile();
        if (res.success && res.data?.profile) {
          const p = res.data.profile;
          setBusinessName(p.businessName || '');
          setDescription(p.description || '');
          setPhone(p.phone || '');
          setCity(p.city || '');
          setAddress(p.address || '');
          setExperienceYears(p.experienceYears || 5);
          setEmergencyService(Boolean(p.emergencyService));
          setIsAvailable(p.isAvailable !== undefined ? p.isAvailable : true);
          if (p.workingHours) {
            setOpenTime(p.workingHours.open || '08:00');
            setCloseTime(p.workingHours.close || '20:00');
          }
          if (p.vehicleTypesSupported) setVehicleTypes(p.vehicleTypesSupported);
          if (p.specializations) setSpecializations(p.specializations);
        }
      } catch (error) {
        showToast('Error loading profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleToggleVehicleType = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter((t) => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleAddSpec = (e) => {
    e.preventDefault();
    if (newSpecInput.trim() && !specializations.includes(newSpecInput.trim())) {
      setSpecializations([...specializations, newSpecInput.trim()]);
      setNewSpecInput('');
    }
  };

  const handleRemoveSpec = (spec) => {
    setSpecializations(specializations.filter((s) => s !== spec));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessName || !phone || !address || !city) {
      showToast('Please fill all required business fields', 'warning');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        businessName,
        description,
        phone,
        city,
        address,
        experienceYears: Number(experienceYears),
        emergencyService,
        isAvailable,
        workingHours: {
          open: openTime,
          close: closeTime,
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        vehicleTypesSupported: vehicleTypes,
        specializations,
      };

      const res = await mechanicService.updateMyProfile(payload);
      if (res.success && res.data?.profile) {
        updateUser(user, res.data.profile);
        showToast('Workshop profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonLoader type="card" count={2} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Workshop Business Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Configure your service center identity, customer contact information, and operating hours.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Business Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Workshop / Business Name *
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Workshop Description & Facilities
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight your diagnostic scanners, ASE certifications, customer lounge, and team experience..."
            />
          </div>

          {/* Phone & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Contact Phone *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                City / Metropolitan Region *
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Workshop Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Hours & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="grid-3">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Opening Time
              </label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Closing Time
              </label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Experience (Years)
              </label>
              <input
                type="number"
                min="1"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </div>

          {/* Emergency & Availability Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} color="#f59e0b" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  24/7 Roadside Rescue
                </span>
              </div>
              <input
                type="checkbox"
                checked={emergencyService}
                onChange={(e) => setEmergencyService(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Accepting Bookings
                </span>
              </div>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Vehicle Types Serviced
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Car', 'Bike', 'Scooter', 'SUV', 'Other'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleToggleVehicleType(t)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: vehicleTypes.includes(t) ? 'var(--secondary)' : 'var(--bg-tertiary)',
                    color: vehicleTypes.includes(t) ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Specialties & Certifications
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="e.g. Turbo Overhaul, Dual-Clutch Gearboxes"
                value={newSpecInput}
                onChange={(e) => setNewSpecInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="btn btn-outline"
                style={{ whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {specializations.map((spec) => (
                <span
                  key={spec}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(spec)}
                    style={{ color: '#f87171', fontWeight: 700, padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
