import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

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
});

export default app;