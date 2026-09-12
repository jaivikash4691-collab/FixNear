import express from 'express';
import {
  getMechanicServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mechanic/:mechanicId', getMechanicServices);
router.post('/', protect, authorize('MECHANIC'), createService);
router.put('/:id', protect, authorize('MECHANIC'), updateService);
router.delete('/:id', protect, authorize('MECHANIC'), deleteService);

export default router;
