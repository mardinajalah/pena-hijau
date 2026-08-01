import { Router } from 'express';
import authRoutes from './auth.route';
import membersRoutes from './members.route';
import joinRequestsRoutes from './join-requests.route';
import galleriesRoutes from './galleries.route';
import articlesRoutes from './articles.route';
import uploadsRoutes from './uploads.route';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/members', membersRoutes);
apiRouter.use('/join-requests', joinRequestsRoutes);
apiRouter.use('/galleries', galleriesRoutes);
apiRouter.use('/articles', articlesRoutes);
apiRouter.use('/uploads', uploadsRoutes);

export default apiRouter;
