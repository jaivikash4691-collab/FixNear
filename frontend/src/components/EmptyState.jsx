import React from 'react';
import { AlertCircle, Wrench } from 'lucide-react';

export const EmptyState = ({
  icon = null,
  title = 'No items found',
  description = 'There are currently no records matching your request.',
  action = null,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed var(--border-subtle)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '1.25rem',
        }}
      >
        {icon || <Wrench size={28} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: action ? '1.5rem' : '0' }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
