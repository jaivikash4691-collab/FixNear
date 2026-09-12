import api from './api';

export const vehicleService = {
  getMyVehicles: () => api.get('/vehicles'),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  createVehicle: (data) => api.post('/vehicles', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
};
