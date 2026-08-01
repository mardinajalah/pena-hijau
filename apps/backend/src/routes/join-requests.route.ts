import { Router } from 'express';
import { JoinRequestsController } from '../modules/join-requests/join-requests.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const joinRequestsController = new JoinRequestsController();

// Public route to submit join form
router.post('/', joinRequestsController.submit);

// Protected admin routes
router.get('/', authenticateJwt, joinRequestsController.getAll);
router.get('/:id', authenticateJwt, joinRequestsController.getById);
router.patch('/:id/verify', authenticateJwt, joinRequestsController.verify);

export default router;
