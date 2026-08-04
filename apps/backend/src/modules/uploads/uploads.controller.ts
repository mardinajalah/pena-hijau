import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
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
  deleteFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paths } = req.body as { paths: string[] };

      if (!paths || !Array.isArray(paths) || paths.length === 0) {
        return ResponseUtil.sendError(res, 400, 'Tidak ada path file yang diberikan.');
      }

      // Tidak ada file fisik di mode serverless (memory storage)
      const isServerless = Boolean(
        process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION,
      );
      if (isServerless) {
        return ResponseUtil.sendSuccess(res, 200, 'Mode serverless: tidak ada file fisik yang dihapus.', { deleted: [] });
      }

      const deleted: string[] = [];
      const failed: string[] = [];

      for (const filePath of paths) {
        // Hanya proses path yang berasal dari /uploads/ (keamanan)
        if (typeof filePath !== 'string' || !filePath.includes('/uploads/')) {
          continue;
        }

        // Ekstrak path relatif dari URL penuh jika ada
        const relPath = filePath.includes('/uploads/')
          ? filePath.substring(filePath.indexOf('/uploads/'))
          : null;

        if (!relPath) continue;

        const absolutePath = path.join(__dirname, '../../public', relPath);

        try {
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            deleted.push(relPath);
          }
        } catch {
          failed.push(relPath);
        }
      }

      return ResponseUtil.sendSuccess(res, 200, `${deleted.length} file berhasil dihapus.`, { deleted, failed });
    } catch (error) {
      next(error);
    }
  };
}
