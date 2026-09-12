import api from './api';

export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getMechanicReviews: (mechanicId) => api.get(`/reviews/mechanic/${mechanicId}`),
};
