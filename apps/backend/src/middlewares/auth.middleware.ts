import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { ResponseUtil } from '../utils/response.util';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseUtil.sendError(
      res,
      401,
      'Access token tidak ditemukan atau tidak valid',
      'Unauthorized',
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (err) {
    return ResponseUtil.sendError(
      res,
      401,
      'Access token telah kadaluarsa atau tidak valid. Silakan login kembali.',
      'Unauthorized',
    );
  }
};
