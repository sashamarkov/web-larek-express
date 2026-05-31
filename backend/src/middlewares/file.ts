import multer from 'multer';
import { Request } from 'express';
import config from '../config';
import { ERROR_MESSAGES } from '../constants/messages';
import { generateUniqueFilename, ensureDirectoryExists } from '../services/file.service';

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
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
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
