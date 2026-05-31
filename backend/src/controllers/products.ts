import { Response, NextFunction } from 'express';
import Product from '../models/product';
import NotFoundError from '../errors/not-found-error';
import { AuthRequest } from '../middlewares/auth';
import { ERROR_MESSAGES } from '../constants/messages';
import { moveFileFromTempToPublic } from '../services/file.service';
import { handleMongooseError } from '../utils/error-handler';

export const getProducts = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await Product.find();
    res.json({ items: products, total: products.length });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      next(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
      return;
    }
    res.json(product);
  } catch (error) {
    const mongooseError = handleMongooseError(error);
    if (mongooseError) {
      next(mongooseError);
      return;
    }
    next(error);
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productData = req.body;
    if (productData.image && productData.image.fileName) {
      const fileName = productData.image.fileName.split('/').pop();
      const publicPath = moveFileFromTempToPublic(fileName);
      productData.image.fileName = publicPath;
    }
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    const mongooseError = handleMongooseError(error);
    if (mongooseError) {
      next(mongooseError);
      return;
    }
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    if (updateData.image && updateData.image.fileName) {
      const fileName = updateData.image.fileName.split('/').pop();
      const publicPath = moveFileFromTempToPublic(fileName);
      updateData.image.fileName = publicPath;
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true },
    );
    if (!product) {
      next(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
      return;
    }
    res.json(product);
  } catch (error) {
    const mongooseError = handleMongooseError(error);
    if (mongooseError) {
      next(mongooseError);
      return;
    }
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      next(new NotFoundError(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
      return;
    }
    res.json(product);
  } catch (error) {
    const mongooseError = handleMongooseError(error);
    if (mongooseError) {
      next(mongooseError);
      return;
    }
    next(error);
  }
};
