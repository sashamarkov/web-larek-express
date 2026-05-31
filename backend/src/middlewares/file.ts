import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import config from '../config';
import { ERROR_MESSAGES } from '../constants/messages';

const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: MulterFile,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const uploadDir = config.tempUploadDir as string;
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: MulterFile,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (
  _req: Request,
  file: MulterFile,
  cb: multer.FileFilterCallback,
): void => {
  const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
