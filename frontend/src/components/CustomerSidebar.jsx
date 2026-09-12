import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Clock, 
  Heart, 
  Bell, 
  User, 
  Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const CustomerSidebar = () => {
  const { user } = useAuth();
  const { unreadNotifsCount } = useSocket();

  const links = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { to: '/customer/vehicles', label: 'My Vehicles', icon: <Car size={19} /> },
    { to: '/find-mechanic', label: 'Find Mechanics', icon: <Search size={19} /> },
    { to: '/customer/service-history', label: 'Service History', icon: <Clock size={19} /> },
    { to: '/customer/favorites', label: 'Saved Mechanics', icon: <Heart size={19} /> },
    { 
      to: '/customer/notifications', 
      label: 'Notifications', 
      icon: <Bell size={19} />, 
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null 
    },
    { to: '/customer/profile', label: 'Profile Settings', icon: <User size={19} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      minHeight: 'calc(100vh - 74px)',
    }}>
      {/* Customer User Profile Mini Card */}
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Vehicle Owner
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/customer/dashboard'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              border: isActive ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
              transition: 'var(--transition)',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {link.icon}
              {link.label}
            </div>
            {link.badge && (
              <span style={{
                backgroundColor: 'var(--danger)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
              }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
