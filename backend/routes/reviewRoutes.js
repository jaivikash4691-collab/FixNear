import express from 'express';
import { createReview, getMechanicReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('CUSTOMER'), createReview);
router.get('/mechanic/:mechanicId', getMechanicReviews);

export default router;
