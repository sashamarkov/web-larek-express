import fs from 'fs';
import path from 'path';
import config from '../config';

export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const moveFileFromTempToPublic = (fileName: string): string => {
  const tempPath = path.join(config.tempUploadDir as string, fileName);
  const publicPath = path.join(config.publicUploadDir as string, fileName);
  const publicDir = config.publicUploadDir as string;

  ensureDirectoryExists(publicDir);

  if (fs.existsSync(tempPath)) {
    fs.copyFileSync(tempPath, publicPath);
    fs.unlinkSync(tempPath);
  }

  return `/images/${fileName}`;
};

export const deleteFileFromPublic = (fileName: string): void => {
  const filePath = path.join(config.publicUploadDir as string, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
};
