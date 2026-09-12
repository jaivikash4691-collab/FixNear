import express from 'express';
import {
  createServiceRequest,
  getCustomerRequests,
  getMechanicRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
} from '../controllers/serviceRequestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('CUSTOMER'), createServiceRequest);
router.get('/customer', protect, authorize('CUSTOMER'), getCustomerRequests);
router.get('/mechanic', protect, authorize('MECHANIC'), getMechanicRequests);
router.get('/:id', protect, getRequestById);
router.patch('/:id/status', protect, authorize('MECHANIC'), updateRequestStatus);
router.patch('/:id/cancel', protect, authorize('CUSTOMER'), cancelRequest);

export default router;
