import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mechanicProfile, setMechanicProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fixnear_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from storage & verify on boot
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fixnear_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data.user);
            if (res.data.mechanicProfile) {
              setMechanicProfile(res.data.mechanicProfile);
            }
          }
        } catch (error) {
          console.error('Session expired or invalid:', error.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await authService.login({ email, password, role });
      if (res.success && res.data) {
        const { token: newToken, user: newUser, mechanicProfile: newProfile } = res.data;
        localStorage.setItem('fixnear_token', newToken);
        setToken(newToken);
        setUser(newUser);
        setMechanicProfile(newProfile || null);
        showToast(`Welcome back, ${newUser.name}!`, 'success');
        return { success: true, user: newUser };
      }
      return { success: false, message: res.message };
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      return { success: false, message: error.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await authService.register(formData);
      if (res.success && res.data) {
        const { token: newToken, user: newUser, mechanicProfile: newProfile } = res.data;
        localStorage.setItem('fixnear_token', newToken);
        setToken(newToken);
        setUser(newUser);
        setMechanicProfile(newProfile || null);
        showToast('Registration successful! Welcome to FixNear.', 'success');
        return { success: true, user: newUser };
      }
      return { success: false, message: res.message };
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      return { success: false, message: error.message };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('fixnear_token');
    setToken(null);
    setUser(null);
    setMechanicProfile(null);
    if (notify) {
      showToast('Logged out successfully', 'info');
    }
  };

  const updateUser = (updatedUser, updatedProfile = null) => {
    setUser(updatedUser);
    if (updatedProfile) {
      setMechanicProfile(updatedProfile);
    }
  };

  // Demo Login Helper for quick 1-click testing
  const demoLogin = async (role = 'CUSTOMER') => {
    if (role === 'CUSTOMER') {
      return await login('customer@fixnear.com', 'password123', 'CUSTOMER');
    } else {
      return await login('mechanic@fixnear.com', 'password123', 'MECHANIC');
    }
  };

  const value = {
    user,
    mechanicProfile,
    token,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isMechanic: user?.role === 'MECHANIC',
    login,
    register,
    logout,
    updateUser,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
