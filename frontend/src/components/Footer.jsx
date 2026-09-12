import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, MapPin, Phone, Mail, Award, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Wrench size={20} color="#041019" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Fix<span style={{ color: 'var(--primary)' }}>Near</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              The modern vehicle service and breakdown platform connecting drivers with verified mechanics, real-time tracking, and upfront pricing.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              100% Verified Local Garages
            </div>
          </div>

          {/* Col 2: Customer Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              For Vehicle Owners
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/find-mechanic" style={{ color: 'var(--text-muted)' }}>
                  Find Nearby Mechanics
                </Link>
              </li>
              <li>
                <Link to="/customer/vehicles" style={{ color: 'var(--text-muted)' }}>
                  Manage My Garage
                </Link>
              </li>
              <li>
                <Link to="/customer/service-history" style={{ color: 'var(--text-muted)' }}>
                  Live Repair Tracking
                </Link>
              </li>
              <li>
                <Link to="/customer/favorites" style={{ color: 'var(--text-muted)' }}>
                  Saved Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Mechanic Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              For Service Centers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/register" style={{ color: 'var(--text-muted)' }}>
                  Register Your Garage
                </Link>
              </li>
              <li>
                <Link to="/mechanic/dashboard" style={{ color: 'var(--text-muted)' }}>
                  Mechanic Dashboard
                </Link>
              </li>
              <li>
                <Link to="/mechanic/services" style={{ color: 'var(--text-muted)' }}>
                  Service Menu Management
                </Link>
              </li>
              <li>
                <Link to="/mechanic/requests" style={{ color: 'var(--text-muted)' }}>
                  Incoming Requests Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Automotive Services */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Popular Services
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Periodic Servicing', 'Brake Systems', 'Engine Diagnostics', 'AC Recharge', 'Battery Replacement', 'Tyre & Alignment', 'Roadside Assist'].map((svc) => (
                <Link
                  key={svc}
                  to={`/find-mechanic?service=${encodeURIComponent(svc)}`}
                  style={{
                    fontSize: '0.775rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {svc}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-dim)',
        }}>
          <div>
            © {new Date().getFullYear()} FixNear Automotive Technologies Inc. Built with React, Vite & MongoDB.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
