import express from 'express';
import {
  getMyVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('CUSTOMER'), getMyVehicles);
router.post('/', protect, authorize('CUSTOMER'), createVehicle);
router.get('/:id', protect, authorize('CUSTOMER'), getVehicleById);
router.put('/:id', protect, authorize('CUSTOMER'), updateVehicle);
router.delete('/:id', protect, authorize('CUSTOMER'), deleteVehicle);

export default router;
