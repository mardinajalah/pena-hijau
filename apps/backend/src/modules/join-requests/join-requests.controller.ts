import { Request, Response, NextFunction } from 'express';
import { JoinRequestsService } from './join-requests.service';
import { ResponseUtil } from '../../utils/response.util';

export class JoinRequestsController {
  private joinRequestsService: JoinRequestsService;

  constructor() {
    this.joinRequestsService = new JoinRequestsService();
  }

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.joinRequestsService.submitRequest(req.body);
      return ResponseUtil.sendSuccess(
        res,
        201,
        'Pendaftaran relawan berhasil dikirim! Tim kami akan meninjau pendaftaran Anda.',
        result,
      );
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query;
      const result = await this.joinRequestsService.getAllRequests(
        status as string,
        search as string,
      );

      return ResponseUtil.sendSuccess(
        res,
        200,
        'Berhasil mengambil daftar pendaftaran relawan',
        result.data,
        { summary: result.summary },
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const detail = await this.joinRequestsService.getRequestById(id);
      return ResponseUtil.sendSuccess(res, 200, 'Detail pendaftar berhasil ditemukan', detail);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status, adminNote } = req.body;

      if (!status || !['Diterima', 'Ditolak'].includes(status)) {
        return ResponseUtil.sendError(
          res,
          400,
          'Status verifikasi harus "Diterima" atau "Ditolak"',
        );
      }

      const result = await this.joinRequestsService.verifyRequest(id, status, adminNote);
      const message =
        status === 'Diterima'
          ? 'Pendaftaran berhasil DITERIMA. Pendaftar telah otomatis terdaftar sebagai anggota resmi Pena Hijau.'
          : 'Pendaftaran relawan telah DITOLAK.';

      return ResponseUtil.sendSuccess(res, 200, message, result);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };
}
