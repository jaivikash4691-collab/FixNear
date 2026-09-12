import api from './api';

export const favoriteService = {
  toggleFavorite: (mechanicId) => api.post(`/favorites/${mechanicId}`),
  getMyFavorites: () => api.get('/favorites'),
  checkFavorite: (mechanicId) => api.get(`/favorites/check/${mechanicId}`),
};
