import { Router } from 'express';
import { ArticlesController } from '../modules/articles/articles.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const articlesController = new ArticlesController();

router.get('/', articlesController.getAll);
router.get('/:id', articlesController.getById);
router.post('/', authenticateJwt, articlesController.create);
router.put('/:id', authenticateJwt, articlesController.update);
router.patch('/:id/publish', authenticateJwt, articlesController.togglePublishStatus);
router.delete('/:id', authenticateJwt, articlesController.delete);

export default router;
