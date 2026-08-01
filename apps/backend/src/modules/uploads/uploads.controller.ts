import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ResponseUtil } from '../../utils/response.util';

export class UploadsController {
  uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return ResponseUtil.sendError(res, 400, 'Tidak ada file gambar yang diunggah.');
      }

      let fileUrl = '';
      if (req.file.buffer) {
        // Memory storage mode (Vercel Serverless read-only filesystem)
        fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else {
        // Disk storage mode (Local development)
        const subfolder = req.file.destination ? path.basename(req.file.destination) : 'avatars';
        fileUrl = `/uploads/${subfolder}/${req.file.filename}`;
      }

      const host = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/v1\/?$/, '');
      const fullUrl = fileUrl.startsWith('data:') ? fileUrl : `${host}${fileUrl}`;

      return ResponseUtil.sendSuccess(res, 201, 'Gambar berhasil diunggah', {
        filename: req.file.filename || req.file.originalname,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        url: fileUrl,
        fullUrl,
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

      const host = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/v1\/?$/, '');

      const uploadedFiles = files.map((file) => {
        let fileUrl = '';
        if (file.buffer) {
          fileUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        } else {
          const subfolder = file.destination ? path.basename(file.destination) : 'galleries';
          fileUrl = `/uploads/${subfolder}/${file.filename}`;
        }
        const fullUrl = fileUrl.startsWith('data:') ? fileUrl : `${host}${fileUrl}`;

        return {
          filename: file.filename || file.originalname,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          url: fileUrl,
          fullUrl,
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
