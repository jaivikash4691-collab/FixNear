import api from './api';

export const serviceService = {
  getMechanicServices: (mechanicId) => api.get(`/services/mechanic/${mechanicId}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  deleteService: (id) => api.delete(`/services/${id}`),
};
