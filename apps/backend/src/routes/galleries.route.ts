import { Router } from 'express';
import { GalleriesController } from '../modules/galleries/galleries.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const galleriesController = new GalleriesController();

router.get('/', galleriesController.getAll);
router.get('/:id', galleriesController.getById);
router.post('/', authenticateJwt, galleriesController.create);
router.put('/:id', authenticateJwt, galleriesController.update);
router.post('/:id/photos', authenticateJwt, galleriesController.addPhoto);
router.delete('/:id/photos/:photoId', authenticateJwt, galleriesController.deletePhoto);
router.delete('/:id', authenticateJwt, galleriesController.delete);

export default router;
