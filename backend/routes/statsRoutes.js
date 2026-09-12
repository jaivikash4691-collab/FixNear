import express from 'express';
import { getMechanicStats, getCustomerStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mechanics/overview', protect, authorize('MECHANIC'), getMechanicStats);
router.get('/customers/overview', protect, authorize('CUSTOMER'), getCustomerStats);

export default router;
