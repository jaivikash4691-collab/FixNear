import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  CalendarClock, 
  Users, 
  Bell, 
  Building2, 
  Award 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const MechanicSidebar = () => {
  const { user, mechanicProfile } = useAuth();
  const { unreadNotifsCount } = useSocket();

  const links = [
    { to: '/mechanic/dashboard', label: 'Workshop Overview', icon: <LayoutDashboard size={19} /> },
    { to: '/mechanic/requests', label: 'Service Requests', icon: <CalendarClock size={19} /> },
    { to: '/mechanic/services', label: 'Service Menu & Rates', icon: <Wrench size={19} /> },
    { to: '/mechanic/customers', label: 'Customer History', icon: <Users size={19} /> },
    { 
      to: '/mechanic/notifications', 
      label: 'Notifications', 
      icon: <Bell size={19} />, 
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null 
    },
    { to: '/mechanic/profile', label: 'Business Profile', icon: <Building2 size={19} /> },
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
      {/* Workshop Profile Mini Card */}
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
          borderRadius: '10px',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
        }}>
          <Wrench size={22} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {mechanicProfile?.businessName || user?.name || 'Mechanic Center'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span className="badge badge-secondary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              VERIFIED WORKSHOP
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/mechanic/dashboard'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isActive ? 'var(--secondary)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--secondary-light)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
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
