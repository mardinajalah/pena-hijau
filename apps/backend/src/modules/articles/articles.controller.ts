import { Request, Response, NextFunction } from 'express';
import { ArticlesService } from './articles.service';
import { ResponseUtil } from '../../utils/response.util';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class ArticlesController {
  private articlesService: ArticlesService;

  constructor() {
    this.articlesService = new ArticlesService();
  }

  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { category, status, search, page, limit } = req.query;
      const isPublic = !req.user; // If no JWT token, treat as public request

      const result = await this.articlesService.getAllArticles({
        category: category as string,
        status: status as string,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        isPublic,
      });

      return ResponseUtil.sendSuccess(
        res,
        200,
        'Berhasil mengambil daftar artikel',
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
      const article = await this.articlesService.getArticleById(id);
      return ResponseUtil.sendSuccess(res, 200, 'Detail artikel berhasil ditemukan', article);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newArticle = await this.articlesService.createArticle(req.body);
      return ResponseUtil.sendSuccess(
        res,
        201,
        `Artikel baru berhasil disimpan sebagai ${newArticle.status}`,
        newArticle,
      );
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await this.articlesService.updateArticle(id, req.body);
      return ResponseUtil.sendSuccess(res, 200, 'Artikel berhasil diperbarui', updated);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  togglePublishStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const updated = await this.articlesService.togglePublishStatus(id, status);
      return ResponseUtil.sendSuccess(
        res,
        200,
        `Status publikasi artikel diubah menjadi ${updated?.status}`,
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
      await this.articlesService.deleteArticle(id);
      return ResponseUtil.sendSuccess(res, 200, 'Artikel berhasil dihapus');
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };
}
