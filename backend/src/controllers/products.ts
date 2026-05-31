import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/product';
import { AuthRequest } from '../middlewares/auth';
import config from '../config';
import { ERROR_MESSAGES } from '../constants/messages';
import { handleMongooseError, handleNotFoundError } from '../utils/error-handler';

const moveFileFromTempToPublic = (fileName: string): void => {
  const tempPath = path.join(config.tempUploadDir as string, fileName);
  const publicPath = path.join(config.publicUploadDir as string, fileName);
  const publicDir = config.publicUploadDir as string;
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (fs.existsSync(tempPath)) {
    fs.copyFileSync(tempPath, publicPath);
    fs.unlinkSync(tempPath);
  }
};

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
    handleNotFoundError(product, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
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
      const fileName = path.basename(productData.image.fileName);
      moveFileFromTempToPublic(fileName);
      productData.image.fileName = `/images/${fileName}`;
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
      const fileName = path.basename(updateData.image.fileName);
      moveFileFromTempToPublic(fileName);
      updateData.image.fileName = `/images/${fileName}`;
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true },
    );
    handleNotFoundError(product, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
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
    handleNotFoundError(product, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
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
