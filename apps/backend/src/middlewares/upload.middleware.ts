import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure upload directories exist
const createFolderIfNotExist = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb) => {
    // Determine category subfolder from req.body.category or req.query.category (default: 'galleries')
    const category = (req.body.category || req.query.category || 'galleries').toString().toLowerCase();
    let subfolder = 'galleries';

    if (category.includes('article') || category.includes('pilar')) {
      subfolder = 'articles';
    } else if (category.includes('avatar') || category.includes('user') || category.includes('member')) {
      subfolder = 'avatars';
    }

    const uploadPath = path.join(__dirname, '../../public/uploads', subfolder);
    createFolderIfNotExist(uploadPath);
    cb(null, uploadPath);
  },

  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.webp';
    const sanitizeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${sanitizeName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeType = allowedExtensions.test(file.mimetype);

  if (allowedExtensions.test(ext) && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Hanya diperbolehkan format WebP, JPG, PNG, GIF.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum 10MB per file
  },
});
