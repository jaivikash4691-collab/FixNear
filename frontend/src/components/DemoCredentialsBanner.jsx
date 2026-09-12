import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoCredentialsBanner = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async (role) => {
    const res = await demoLogin(role);
    if (res.success) {
      if (role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else {
        navigate('/mechanic/dashboard');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
            Quick Demo Accounts
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Explore pre-seeded customer vehicles or active mechanic workshop requests:
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={() => handleDemoClick('CUSTOMER')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <User size={14} color="var(--primary)" />
            Customer Demo (Alex)
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('MECHANIC')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <Wrench size={14} color="var(--secondary)" />
            Mechanic Demo (Apex AutoCare)
          </button>
        </div>
      </div>
    </div>
  );
};
