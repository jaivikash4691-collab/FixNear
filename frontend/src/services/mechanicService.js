import api from './api';

export const mechanicService = {
  getMechanics: (params = {}) => api.get('/mechanics', { params }),
  getFeaturedMechanics: () => api.get('/mechanics/featured'),
  getMechanicById: (id, params = {}) => api.get(`/mechanics/${id}`, { params }),
  getMyProfile: () => api.get('/mechanics/profile/me'),
  updateMyProfile: (data) => api.put('/mechanics/profile', data),
};
