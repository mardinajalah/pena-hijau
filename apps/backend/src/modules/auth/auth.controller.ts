import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ResponseUtil } from '../../utils/response.util';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return ResponseUtil.sendSuccess(res, 200, 'Login berhasil', result);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message, 'Authentication Error');
      }
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      return ResponseUtil.sendSuccess(res, 200, 'Token berhasil diperbarui', result);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message, 'Token Error');
      }
      next(error);
    }
  };

  logout = async (_req: Request, res: Response) => {
    return ResponseUtil.sendSuccess(res, 200, 'Logout berhasil. Token telah dicabut.');
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 1;
      const profile = await this.authService.getProfile(userId);
      return ResponseUtil.sendSuccess(res, 200, 'Data profil admin berhasil diambil', profile);
    } catch (error) {
      next(error);
    }
  };
}
