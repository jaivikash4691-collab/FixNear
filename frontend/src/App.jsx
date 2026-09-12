import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { MechanicLayout } from './layouts/MechanicLayout';

// Guard
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { FindMechanic } from './pages/FindMechanic';
import { MechanicDetails } from './pages/MechanicDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { VehiclesPage } from './pages/customer/VehiclesPage';
import { CustomerHistoryPage } from './pages/customer/CustomerHistoryPage';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage';
import { FavoritesPage } from './pages/customer/FavoritesPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';

// Mechanic Pages
import { MechanicDashboard } from './pages/mechanic/MechanicDashboard';
import { MechanicRequestsPage } from './pages/mechanic/MechanicRequestsPage';
import { MechanicServicesPage } from './pages/mechanic/MechanicServicesPage';
import { MechanicCustomersPage } from './pages/mechanic/MechanicCustomersPage';
import { MechanicNotificationsPage } from './pages/mechanic/MechanicNotificationsPage';
import { MechanicProfilePage } from './pages/mechanic/MechanicProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/find-mechanic" element={<FindMechanic />} />
                <Route path="/mechanic/:id" element={<MechanicDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Customer Routes with CustomerLayout */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="service-history" element={<CustomerHistoryPage />} />
                <Route path="services/:id" element={<ServiceDetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="notifications" element={<CustomerNotificationsPage />} />
                <Route path="profile" element={<CustomerProfilePage />} />
                <Route index element={<Navigate to="/customer/dashboard" replace />} />
              </Route>

              {/* Protected Mechanic Routes with MechanicLayout */}
              <Route
                path="/mechanic"
                element={
                  <ProtectedRoute requiredRole="MECHANIC">
                    <MechanicLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<MechanicDashboard />} />
                <Route path="requests" element={<MechanicRequestsPage />} />
                <Route path="services" element={<MechanicServicesPage />} />
                <Route path="customers" element={<MechanicCustomersPage />} />
                <Route path="notifications" element={<MechanicNotificationsPage />} />
                <Route path="profile" element={<MechanicProfilePage />} />
                <Route index element={<Navigate to="/mechanic/dashboard" replace />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
