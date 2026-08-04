import { Router } from 'express';
import { UploadsController } from '../modules/uploads/uploads.controller';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const uploadsController = new UploadsController();

// Single image upload route
router.post('/single', authenticateJwt, uploadMiddleware.single('image'), uploadsController.uploadSingle);

// Multiple images upload route (max 10 photos per upload)
router.post('/multiple', authenticateJwt, uploadMiddleware.array('images', 10), uploadsController.uploadMultiple);

// Cleanup/rollback route — hapus file yang terlanjur terupload ketika DB gagal
router.delete('/cleanup', authenticateJwt, uploadsController.deleteFiles);

export default router;
