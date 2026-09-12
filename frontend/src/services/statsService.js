import api from './api';

export const statsService = {
  getMechanicStats: () => api.get('/stats/mechanics/overview'),
  getCustomerStats: () => api.get('/stats/customers/overview'),
};
