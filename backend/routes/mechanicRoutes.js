import express from 'express';
import {
  getMechanics,
  getFeaturedMechanics,
  getMechanicById,
  getMyMechanicProfile,
  updateMyMechanicProfile,
} from '../controllers/mechanicController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMechanics);
router.get('/featured', getFeaturedMechanics);
router.get('/profile/me', protect, authorize('MECHANIC'), getMyMechanicProfile);
router.put('/profile', protect, authorize('MECHANIC'), updateMyMechanicProfile);
router.get('/:id', getMechanicById);

export default router;
