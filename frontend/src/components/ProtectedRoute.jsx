import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If logged in as customer but trying to access mechanic route
    if (user.role === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    // If logged in as mechanic but trying to access customer route
    if (user.role === 'MECHANIC') {
      return <Navigate to="/mechanic/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
