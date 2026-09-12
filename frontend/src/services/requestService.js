import api from './api';

export const requestService = {
  createRequest: (data) => api.post('/service-requests', data),
  getCustomerRequests: (params = {}) => api.get('/service-requests/customer', { params }),
  getMechanicRequests: (params = {}) => api.get('/service-requests/mechanic', { params }),
  getRequestById: (id) => api.get(`/service-requests/${id}`),
  updateStatus: (id, data) => api.patch(`/service-requests/${id}/status`, data),
  cancelRequest: (id, data = {}) => api.patch(`/service-requests/${id}/cancel`, data),
};
