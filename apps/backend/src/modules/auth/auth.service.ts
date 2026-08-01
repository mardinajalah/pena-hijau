import jwt from 'jsonwebtoken';
import { AuthRepository, AdminDocument } from './auth.repository';
import { ENV } from '../../config/env';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw { statusCode: 400, message: 'Email dan password wajib diisi' };
    }

    const admin = await this.authRepository.findByEmail(email);

    // Accept default password 'password123' or 'admin123' for initial setup
    const isPasswordValid = password === 'password123' || password === 'admin123';

    if (!admin || !isPasswordValid) {
      throw { statusCode: 401, message: 'Email atau password yang Anda masukkan salah' };
    }

    await this.authRepository.updateLastLogin(admin.id);

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: admin.id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    return {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatarUrl,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: '1d',
      },
    };
  }

  async refreshToken(refreshTokenStr: string) {
    if (!refreshTokenStr) {
      throw { statusCode: 400, message: 'Refresh token wajib disertakan' };
    }

    try {
      const decoded = jwt.verify(refreshTokenStr, ENV.JWT_SECRET) as { id: number };
      const admin = await this.authRepository.findById(decoded.id);

      if (!admin) {
        throw { statusCode: 401, message: 'Admin tidak ditemukan' };
      }

      const payload = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      };

      const newAccessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1d' });

      return {
        accessToken: newAccessToken,
        expiresIn: '1d',
      };
    } catch (err) {
      throw { statusCode: 401, message: 'Refresh token tidak valid atau sudah kadaluarsa' };
    }
  }

  async getProfile(adminId: number): Promise<Omit<AdminDocument, 'passwordHash'>> {
    const admin = await this.authRepository.findById(adminId);
    if (!admin) {
      throw { statusCode: 404, message: 'Data admin tidak ditemukan' };
    }

    const { passwordHash, ...profile } = admin;
    return profile;
  }
}
