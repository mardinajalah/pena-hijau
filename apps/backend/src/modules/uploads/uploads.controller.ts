import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ResponseUtil } from '../../utils/response.util';

export class UploadsController {
  uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return ResponseUtil.sendError(res, 400, 'Tidak ada file gambar yang diunggah.');
      }

      // Determine relative path for public URL
      const subfolder = path.basename(req.file.destination);
      const fileUrl = `/uploads/${subfolder}/${req.file.filename}`;

      return ResponseUtil.sendSuccess(res, 201, 'Gambar berhasil diunggah ke server lokal', {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: fileUrl,
        fullUrl: `http://localhost:4000${fileUrl}`,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadMultiple = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return ResponseUtil.sendError(res, 400, 'Tidak ada file gambar yang diunggah.');
      }

      const uploadedFiles = files.map((file) => {
        const subfolder = path.basename(file.destination);
        const fileUrl = `/uploads/${subfolder}/${file.filename}`;
        return {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          url: fileUrl,
          fullUrl: `http://localhost:4000${fileUrl}`,
        };
      });

      return ResponseUtil.sendSuccess(res, 201, `${files.length} gambar berhasil diunggah`, {
        count: files.length,
        files: uploadedFiles,
        urls: uploadedFiles.map((f) => f.url),
      });
    } catch (error) {
      next(error);
    }
  };
}
