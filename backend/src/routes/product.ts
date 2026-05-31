import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validations';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', authMiddleware, validateCreateProduct, createProduct);
router.patch('/:productId', authMiddleware, validateUpdateProduct, updateProduct);
router.delete('/:productId', authMiddleware, deleteProduct);

export default router;
