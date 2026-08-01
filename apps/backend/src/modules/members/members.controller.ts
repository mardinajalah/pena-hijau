import { Request, Response, NextFunction } from 'express';
import { MembersService } from './members.service';
import { ResponseUtil } from '../../utils/response.util';

export class MembersController {
  private membersService: MembersService;

  constructor() {
    this.membersService = new MembersService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, division, status, page, limit } = req.query;
      const result = await this.membersService.getAllMembers({
        search: search as string,
        division: division as string,
        status: status as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return ResponseUtil.sendSuccess(
        res,
        200,
        'Berhasil mengambil daftar anggota relawan',
        result.data,
        { pagination: result.pagination, summary: result.summary },
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const member = await this.membersService.getMemberById(id);
      return ResponseUtil.sendSuccess(res, 200, 'Detail anggota berhasil ditemukan', member);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message, 'Not Found');
      }
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMember = await this.membersService.createMember(req.body);
      return ResponseUtil.sendSuccess(res, 201, 'Anggota relawan baru berhasil ditambahkan', newMember);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message, 'Bad Request');
      }
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.membersService.updateMember(id, req.body);
      return ResponseUtil.sendSuccess(res, 200, 'Data anggota relawan berhasil diperbarui', updated);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const updated = await this.membersService.toggleStatus(id, status);
      return ResponseUtil.sendSuccess(
        res,
        200,
        `Status anggota relawan berhasil diubah menjadi ${updated?.status}`,
        updated,
      );
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.membersService.deleteMember(id);
      return ResponseUtil.sendSuccess(res, 200, 'Data anggota relawan berhasil dihapus');
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };
}
