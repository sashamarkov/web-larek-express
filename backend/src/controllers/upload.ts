import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { ERROR_MESSAGES } from '../constants/messages';

export default async function uploadFile(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: ERROR_MESSAGES.FILE_NOT_UPLOADED });
      return;
    }
    res.json({
      fileName: `/images/${req.file.filename}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
}
