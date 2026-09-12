import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MechanicSidebar } from '../components/MechanicSidebar';

export const MechanicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
          <MechanicSidebar />
        </div>
        <main style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto', backgroundColor: 'var(--bg-primary)' }}>
          <div className="container-wide">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
};
