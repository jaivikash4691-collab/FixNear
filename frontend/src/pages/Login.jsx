import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const { login, demoLogin, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'MECHANIC'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const dest = user.role === 'CUSTOMER' ? '/customer/dashboard' : '/mechanic/dashboard';
    navigate(dest, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password, role);
      if (res.success && res.user) {
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(res.user.role === 'CUSTOMER' ? '/customer/dashboard' : '/mechanic/dashboard', { replace: true });
        }
      }
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setRole(demoRole);
    const res = await demoLogin(demoRole);
    if (res.success && res.user) {
      navigate(res.user.role === 'CUSTOMER' ? '/customer/dashboard' : '/mechanic/dashboard', { replace: true });
    }
  };

  return (
    <div className="container" style={{
      padding: '3rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <Wrench size={24} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome to FixNear</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to access your garage or manage your service requests
          </p>
        </div>

        {/* 1-Click Instant Demo Box */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Instant Evaluation Demo Switcher
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemo('CUSTOMER')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <User size={13} /> Customer (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('MECHANIC')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Wrench size={13} /> Mechanic (Apex)
            </button>
          </div>
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
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: role === 'CUSTOMER' ? '#041019' : 'var(--text-muted)',
                backgroundColor: role === 'CUSTOMER' ? 'var(--primary)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('MECHANIC')}
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: role === 'MECHANIC' ? '#ffffff' : 'var(--text-muted)',
                backgroundColor: role === 'MECHANIC' ? 'var(--secondary)' : 'transparent',
                transition: 'var(--transition)',
              }}
            >
              Mechanic
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder={role === 'CUSTOMER' ? 'customer@fixnear.com' : 'mechanic@fixnear.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`btn ${role === 'CUSTOMER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {submitting ? 'Authenticating...' : `Sign in as ${role === 'CUSTOMER' ? 'Vehicle Owner' : 'Mechanic'}`}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link to Register */}
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
