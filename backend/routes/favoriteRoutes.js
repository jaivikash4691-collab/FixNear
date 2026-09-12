import express from 'express';
import {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
} from '../controllers/favoriteController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('CUSTOMER'), getMyFavorites);
router.post('/:mechanicId', protect, authorize('CUSTOMER'), toggleFavorite);
router.get('/check/:mechanicId', protect, authorize('CUSTOMER'), checkFavorite);

export default router;
