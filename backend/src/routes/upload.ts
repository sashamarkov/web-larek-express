import { Router } from 'express';
import upload from '../middlewares/file';
import uploadFile from '../controllers/upload';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, upload.single('file'), uploadFile);

export default router;
