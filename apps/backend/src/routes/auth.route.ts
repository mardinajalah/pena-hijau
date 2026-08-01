import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateJwt, authController.logout);
router.get('/me', authenticateJwt, authController.me);

export default router;
