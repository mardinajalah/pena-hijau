import { Router } from 'express';
import { MembersController } from '../modules/members/members.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';

const router = Router();
const membersController = new MembersController();

router.get('/', membersController.getAll);
router.get('/:id', membersController.getById);
router.post('/', authenticateJwt, membersController.create);
router.put('/:id', authenticateJwt, membersController.update);
router.patch('/:id/status', authenticateJwt, membersController.toggleStatus);
router.delete('/:id', authenticateJwt, membersController.delete);

export default router;
