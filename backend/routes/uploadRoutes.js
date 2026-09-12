import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return sendError(res, 'No image file uploaded', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(res, 'Image uploaded successfully', {
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

export default router;
