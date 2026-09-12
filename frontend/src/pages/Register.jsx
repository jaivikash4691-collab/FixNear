import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, User, Lock, Mail, Phone, MapPin, Building2, Car, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const { register, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'MECHANIC'
  const [submitting, setSubmitting] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [address, setAddress] = useState('');

  // Mechanic Specific fields
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [emergencyService, setEmergencyService] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState(['Car', 'SUV']);

  if (isAuthenticated && user) {
    const dest = user.role === 'CUSTOMER' ? '/customer/dashboard' : '/mechanic/dashboard';
    navigate(dest, { replace: true });
    return null;
  }

  const handleVehicleTypeToggle = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter((t) => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (role === 'MECHANIC' && !businessName) {
      showToast('Please enter your workshop / business name', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        city,
        address,
        ...(role === 'MECHANIC' && {
          businessName,
          description,
          experienceYears,
          emergencyService,
          vehicleTypesSupported: vehicleTypes,
        }),
      };

      const res = await register(payload);
      if (res.success && res.user) {
        navigate(res.user.role === 'CUSTOMER' ? '/customer/dashboard' : '/mechanic/dashboard', { replace: true });
      }
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{
      padding: '3rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
    }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
            marginBottom: '0.75rem',
          }}>
            <Wrench size={24} color="#041019" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Join FixNear as a vehicle owner or list your auto workshop
          </p>
        </div>

        {/* Main Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Role Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: role === 'CUSTOMER' ? '#041019' : 'var(--text-muted)',
                backgroundColor: role === 'CUSTOMER' ? 'var(--primary)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              Customer / Driver
            </button>
            <button
              type="button"
              onClick={() => setRole('MECHANIC')}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: role === 'MECHANIC' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: role === 'MECHANIC' ? 'var(--secondary)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              Mechanic / Service Center
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Email & Password Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Phone & City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  City / Area
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Address
              </label>
              <input
                type="text"
                placeholder="Street address or area location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* MECHANIC SPECIFIC FIELDS */}
            {role === 'MECHANIC' && (
              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  🔧 Workshop Profile Setup
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Business / Garage Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Apex AutoCare & Performance"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Workshop Description & Specialties
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your equipment, diagnostic scanners, certifications, and specialties..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
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

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '1.4rem',
                  }}>
                    <input
                      type="checkbox"
                      id="emergency"
                      checked={emergencyService}
                      onChange={(e) => setEmergencyService(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <label htmlFor="emergency" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                      24/7 Emergency Service
                    </label>
                  </div>
                </div>

                {/* Supported Vehicles */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Supported Vehicle Types
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Car', 'Bike', 'Scooter', 'SUV', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleVehicleTypeToggle(t)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
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
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`btn ${role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            >
              {submitting ? 'Creating Account...' : `Register as ${role === 'CUSTOMER' ? 'Vehicle Owner' : 'Mechanic'}`}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link to Login */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
