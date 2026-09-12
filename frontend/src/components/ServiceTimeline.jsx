import React from 'react';
import { 
  Check, 
  Clock, 
  Search, 
  Wrench, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export const ServiceTimeline = ({ status, statusHistory = [] }) => {
  const stages = [
    { key: 'REQUESTED', label: '1. Request Submitted', icon: <Clock size={15} /> },
    { key: 'ACCEPTED', label: '2. Booking Confirmed', icon: <Check size={15} /> },
    { key: 'DIAGNOSING', label: '3. Inspection & Diagnosis', icon: <Search size={15} /> },
    { key: 'REPAIRING', label: '4. Repair in Progress', icon: <Wrench size={15} /> },
    { key: 'READY', label: '5. Ready for Pickup', icon: <CheckCircle2 size={15} /> },
    { key: 'COMPLETED', label: '6. Service Completed', icon: <CheckCircle2 size={15} /> },
  ];

  const isCancelled = status === 'CANCELLED';
  const isRejected = status === 'REJECTED';
  const currentIndex = stages.findIndex((s) => s.key === status);

  const getStageHistory = (stageKey) => {
    return statusHistory.find((h) => h.status === stageKey);
  };

  if (isCancelled || isRejected) {
    return (
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--danger-bg)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
      }}>
        <XCircle size={22} color="#ef4444" />
        <div>
          <h4 style={{ color: '#f87171', fontSize: '0.95rem', fontWeight: 700 }}>
            {isCancelled ? 'Booking Cancelled' : 'Request Declined by Workshop'}
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isCancelled
              ? 'This service request was cancelled by the vehicle owner.'
              : 'The workshop was unable to take this booking at the selected time slot.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {stages.map((stage, idx) => {
          const isDone = idx < currentIndex || (idx === currentIndex && status === 'COMPLETED');
          const isCurrent = idx === currentIndex && status !== 'COMPLETED';
          const historyItem = getStageHistory(stage.key);

          return (
            <div
              key={stage.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                position: 'relative',
                paddingBottom: idx === stages.length - 1 ? '0' : '1.5rem',
              }}
            >
              {/* Line connector */}
              {idx < stages.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '28px',
                    left: '15px',
                    width: '2px',
                    bottom: '0',
                    backgroundColor: isDone ? 'var(--primary)' : 'var(--border-subtle)',
                  }}
                />
              )}

              {/* Step indicator circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 2,
                  backgroundColor: isDone
                    ? 'var(--primary)'
                    : isCurrent
                    ? 'var(--primary-light)'
                    : 'var(--bg-tertiary)',
                  border: isCurrent
                    ? '2px solid var(--primary)'
                    : isDone
                    ? 'none'
                    : '1px solid var(--border-subtle)',
                  color: isDone ? '#ffffff' : isCurrent ? 'var(--primary)' : 'var(--text-dim)',
                }}
              >
                {isDone ? <Check size={16} strokeWidth={2.5} /> : stage.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontWeight: isCurrent || isDone ? 700 : 500,
                      fontSize: '0.9rem',
                      color: isCurrent ? 'var(--primary)' : isDone ? 'var(--text-main)' : 'var(--text-dim)',
                    }}
                  >
                    {stage.label}
                  </span>

                  {historyItem?.timestamp && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(historyItem.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Technician update note */}
                {historyItem?.note && (
                  <div
                    style={{
                      fontSize: '0.825rem',
                      color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)',
                      backgroundColor: isCurrent ? 'var(--primary-light)' : 'transparent',
                      padding: isCurrent ? '0.35rem 0.6rem' : '0.15rem 0',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {historyItem.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
