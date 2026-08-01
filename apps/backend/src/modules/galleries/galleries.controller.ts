import { Request, Response, NextFunction } from 'express';
import { GalleriesService } from './galleries.service';
import { ResponseUtil } from '../../utils/response.util';

export class GalleriesController {
  private galleriesService: GalleriesService;

  constructor() {
    this.galleriesService = new GalleriesService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, search, page, limit } = req.query;
      const result = await this.galleriesService.getAllGalleries({
        category: category as string,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      return ResponseUtil.sendSuccess(
        res,
        200,
        'Berhasil mengambil daftar event galeri',
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
      const gallery = await this.galleriesService.getGalleryById(id);
      return ResponseUtil.sendSuccess(res, 200, 'Detail event galeri berhasil ditemukan', gallery);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newGallery = await this.galleriesService.createGallery(req.body);
      return ResponseUtil.sendSuccess(res, 201, 'Event galeri baru berhasil dibuat', newGallery);
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
      const updated = await this.galleriesService.updateGallery(id, req.body);
      return ResponseUtil.sendSuccess(res, 200, 'Event galeri berhasil diperbarui', updated);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  addPhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { photoUrl, caption } = req.body;
      const url = photoUrl || '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp';
      const updated = await this.galleriesService.addPhotoToGallery(id, url, caption);
      return ResponseUtil.sendSuccess(res, 200, 'Foto berhasil ditambahkan ke event galeri', updated);
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };

  deletePhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const photoId = Number(req.params.photoId);
      const updated = await this.galleriesService.deletePhotoFromGallery(id, photoId);
      return ResponseUtil.sendSuccess(res, 200, 'Foto dokumentasi berhasil dihapus', updated);
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
      await this.galleriesService.deleteGallery(id);
      return ResponseUtil.sendSuccess(res, 200, 'Event galeri beserta seluruh foto berhasil dihapus');
    } catch (error: any) {
      if (error.statusCode) {
        return ResponseUtil.sendError(res, error.statusCode, error.message);
      }
      next(error);
    }
  };
}
