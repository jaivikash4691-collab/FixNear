import React from 'react';
import { Car, Fuel, Calendar, Gauge, Edit2, Trash2, Shield } from 'lucide-react';

export const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Bike':
      case 'Scooter':
        return '🏍️';
      case 'SUV':
        return '🚙';
      default:
        return '🚗';
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
      }}
    >
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
            }}>
              {getVehicleIcon(vehicle.vehicleType)}
            </div>
            <div>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>
                {vehicle.vehicleType}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {vehicle.brand} {vehicle.model}
              </h3>
            </div>
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            padding: '3px 8px',
            borderRadius: '6px',
            letterSpacing: '0.05em',
            fontFamily: 'monospace',
          }}>
            {vehicle.registrationNumber}
          </span>
        </div>

        {/* Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-tertiary)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          fontSize: '0.825rem',
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Year</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{vehicle.year}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Fuel</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{vehicle.fuelType}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Mileage</div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}
            </div>
          </div>
        </div>

        {vehicle.notes && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginBottom: '1rem',
          }}>
            "{vehicle.notes}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.75rem',
      }}>
        <button
          onClick={() => onEdit(vehicle)}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
        >
          <Edit2 size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(vehicle._id)}
          className="btn btn-danger btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
};
