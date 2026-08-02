import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION);

// Memory storage for Serverless / Vercel (read-only filesystem)
const memoryStorage = multer.memoryStorage();

/**
 * Menghasilkan nama file dengan format: DD-MM-YYYY-namaoriginal.ext
 * Contoh: 02-08-2026-foto-sungai.jpg
 */
const generateDateFilename = (originalname: string): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const datePrefix = `${dd}-${mm}-${yyyy}`;

  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const baseName = path
    .basename(originalname, path.extname(originalname))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Tambahkan suffix unik singkat untuk menghindari tumpang tindih nama pada hari yang sama
  const shortSuffix = Date.now().toString().slice(-4);
  return `${datePrefix}-${baseName}-${shortSuffix}${ext}`;
};

// Disk storage for local development
const diskStorage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb) => {
    const category = (req.body.category || req.query.category || 'galleries').toString().toLowerCase();
    let subfolder = 'galleries';

    if (category.includes('article') || category.includes('pilar')) {
      subfolder = 'articles';
    } else if (category.includes('anggota') || category.includes('member') || category.includes('user')) {
      subfolder = 'anggota';
    } else if (category.includes('avatar')) {
      subfolder = 'avatars';
    }

    const uploadPath = path.join(__dirname, '../../public/uploads', subfolder);
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch {
      cb(null, '');
    }
  },

  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, generateDateFilename(file.originalname));
  },
});

const storage = isServerless ? memoryStorage : diskStorage;

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeType = allowedExtensions.test(file.mimetype);

  if (allowedExtensions.test(ext) || mimeType) {
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
