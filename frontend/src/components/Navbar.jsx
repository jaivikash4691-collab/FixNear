import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wrench, 
  MapPin, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Car, 
  Calendar, 
  Clock, 
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isMechanic, logout, demoLogin } = useAuth();
  const { unreadNotifsCount } = useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    if (role === 'CUSTOMER') {
      navigate('/customer/dashboard');
    } else {
      navigate('/mechanic/dashboard');
    }
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Wrench size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Fix<span style={{ color: '#38bdf8' }}>Near</span>
            </span>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: 500, lineHeight: 1 }}>
              Vehicle Service & Mechanic Finder
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link
            to="/find-mechanic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: location.pathname.startsWith('/find-mechanic') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            <MapPin size={16} color="var(--primary)" />
            Find Mechanics
          </Link>
          <a
            href="/#how-it-works"
            style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}
          >
            How It Works
          </a>
          <a
            href="/#services"
            style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}
          >
            Services & Repairs
          </a>
        </nav>

        {/* Right Section / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
              {/* Notifications Icon */}
              <Link
                to={isCustomer ? '/customer/notifications' : '/mechanic/notifications'}
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--danger)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-secondary)',
                  }}>
                    {unreadNotifsCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isMechanic ? 'rgba(59, 130, 246, 0.25)' : 'rgba(2, 132, 199, 0.25)',
                    color: isMechanic ? '#60a5fa' : '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', display: 'none' }} className="user-text-preview">
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {isMechanic ? 'Workshop' : 'Customer'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '240px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.5rem',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </div>
                    </div>

                    <div style={{ padding: '0.35rem 0' }}>
                      <Link
                        to={isCustomer ? '/customer/dashboard' : '/mechanic/dashboard'}
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        Dashboard
                      </Link>

                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/vehicles"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.875rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            My Vehicles
                          </Link>
                          <Link
                            to="/customer/service-history"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.875rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            Service History & Repairs
                          </Link>
                        </>
                      )}

                      {isMechanic && (
                        <>
                          <Link
                            to="/mechanic/requests"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.875rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            Service Requests Queue
                          </Link>
                          <Link
                            to="/mechanic/services"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.875rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            Service Menu & Rates
                          </Link>
                        </>
                      )}

                      <Link
                        to={isCustomer ? '/customer/profile' : '/mechanic/profile'}
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          color: '#f87171',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              color: 'var(--text-main)',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 640px) {
          .user-text-preview { display: block !important; }
        }
      `}</style>
    </header>
  );
};
