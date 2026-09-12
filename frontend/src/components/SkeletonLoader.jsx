import React from 'react';

export const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ height: '22px', width: '60%' }} />
              <div className="skeleton" style={{ height: '22px', width: '25%' }} />
            </div>
            <div className="skeleton" style={{ height: '16px', width: '40%' }} />
            <div className="skeleton" style={{ height: '40px', width: '100%' }} />
            <div className="skeleton" style={{ height: '30px', width: '70%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div className="skeleton" style={{ height: '28px', width: '30%' }} />
              <div className="skeleton" style={{ height: '28px', width: '30%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '54px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="skeleton" style={{ height: '200px', width: '100%' }} />
    </div>
  );
};
