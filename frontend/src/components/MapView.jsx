import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';

// Custom CSS DivIcon for Mechanics (Sleek Cyan Neon Marker)
const createMechanicIcon = (name) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 0 14px rgba(6, 182, 212, 0.7);
      ">
        <div style="
          transform: rotate(45deg);
          color: #041019;
          font-weight: 800;
          font-size: 14px;
        ">🔧</div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

// Custom DivIcon for User's Current Location
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 22px;
        height: 22px;
        background-color: #10b981;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 16px #10b981;
        animation: pulseUser 2s infinite;
      "></div>
      <style>
        @keyframes pulseUser {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      </style>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// Component to dynamically re-center map when user coordinates or selected mechanic change
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const MapView = ({
  mechanics = [],
  userLocation = null,
  selectedMechanic = null,
  onMechanicSelect = null,
}) => {
  const defaultCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [12.9716, 77.5946];

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={defaultCenter} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserIcon()}
          >
            <Popup>
              <div style={{ padding: '0.25rem' }}>
                <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> You Are Here
                </strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Current Search Center
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Mechanic Markers */}
        {mechanics.map((mech) => {
          if (!mech.location?.coordinates || mech.location.coordinates.length < 2) return null;
          const [lng, lat] = mech.location.coordinates;

          return (
            <Marker
              key={mech._id}
              position={[lat, lng]}
              icon={createMechanicIcon(mech.businessName)}
              eventHandlers={{
                click: () => onMechanicSelect && onMechanicSelect(mech),
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px', padding: '0.35rem 0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {mech.businessName}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.35rem' }}>
                    <Star size={13} fill="#f59e0b" />
                    <span>{mech.averageRating || 4.8}</span>
                    <span style={{ color: 'var(--text-dim)' }}>({mech.reviewCount || 0} reviews)</span>
                  </div>

                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {mech.address || mech.city}
                    {mech.distanceKm !== null && mech.distanceKm !== undefined && (
                      <strong style={{ color: 'var(--primary)', marginLeft: '4px' }}>
                        • {mech.distanceKm} km away
                      </strong>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      From ${mech.startingPrice || 35}
                    </span>
                    <Link
                      to={`/mechanic/${mech._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                      }}
                    >
                      View Profile <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
