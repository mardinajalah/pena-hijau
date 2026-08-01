import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Server Error Handler:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server';
  const errorName = err.name || 'Internal Server Error';

  return ResponseUtil.sendError(res, statusCode, message, errorName);
};
