import express from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static upload directory (http://localhost:4000/uploads/...)
const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));

// Root Health Check Route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🚀 Backend Pena Hijau API Server berjalan aktif',
    version: '1.0.0',
    port: ENV.PORT,
    endpoints: {
      auth: '/api/v1/auth',
      members: '/api/v1/members',
      joinRequests: '/api/v1/join-requests',
      galleries: '/api/v1/galleries',
      articles: '/api/v1/articles',
      uploads: '/api/v1/uploads',
    },
  });
});

// Master API v1 Router
app.use('/api/v1', apiRouter);

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`🌐 Backend REST API Server running on http://localhost:${ENV.PORT}`);
  console.log(`📌 Base API Endpoint: http://localhost:${ENV.PORT}/api/v1`);
  console.log(`📁 Static Uploads Directory: http://localhost:${ENV.PORT}/uploads`);
});

export default app;