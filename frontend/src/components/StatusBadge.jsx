import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Wrench, 
  XCircle 
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const config = {
    REQUESTED: {
      label: 'Requested',
      className: 'status-requested',
      icon: <Clock size={size === 'sm' ? 12 : 14} />,
    },
    ACCEPTED: {
      label: 'Accepted',
      className: 'status-accepted',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    },
    DIAGNOSING: {
      label: 'Diagnosing',
      className: 'status-diagnosing',
      icon: <Search size={size === 'sm' ? 12 : 14} />,
    },
    REPAIRING: {
      label: 'Repairing',
      className: 'status-repairing',
      icon: <Wrench size={size === 'sm' ? 12 : 14} />,
    },
    READY: {
      label: 'Ready for Pickup',
      className: 'status-ready',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    },
    COMPLETED: {
      label: 'Completed',
      className: 'status-completed',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    },
    REJECTED: {
      label: 'Declined',
      className: 'status-rejected',
      icon: <XCircle size={size === 'sm' ? 12 : 14} />,
    },
    CANCELLED: {
      label: 'Cancelled',
      className: 'status-cancelled',
      icon: <XCircle size={size === 'sm' ? 12 : 14} />,
    },
  };

  const item = config[status] || {
    label: status || 'Unknown',
    className: 'badge-secondary',
    icon: <AlertCircle size={size === 'sm' ? 12 : 14} />,
  };

  return (
    <span
      className={`badge ${item.className}`}
      style={{
        padding: size === 'sm' ? '0.2rem 0.5rem' : '0.3rem 0.75rem',
        fontSize: size === 'sm' ? '0.7rem' : '0.78rem',
      }}
    >
      {item.icon}
      {item.label}
    </span>
  );
};
