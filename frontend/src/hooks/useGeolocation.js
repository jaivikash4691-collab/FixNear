import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: 12.9716, // Default Bangalore / City Center
    longitude: 77.5946,
    accuracy: null,
    error: null,
    loading: true,
    isAllowed: false,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          isAllowed: true,
        });
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          error: error.message || 'Unable to retrieve your location',
          loading: false,
          isAllowed: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { ...location, refreshLocation: getLocation };
};
