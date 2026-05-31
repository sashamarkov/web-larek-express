import { Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import { AuthRequest } from '../middlewares/auth';
import config from '../config';

const DUPLICATE_KEY_ERROR = 'E11000';

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
      next(new NotFoundError('Товар не найден'));
      return;
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      next(new BadRequestError('Невалидный ID товара'));
      return;
    }
    next(error);
  }
};

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
    if (error instanceof Error && error.message.includes(DUPLICATE_KEY_ERROR)) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError(error.message));
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
    if (!product) {
      next(new NotFoundError('Товар не найден'));
      return;
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }
    if (error instanceof Error && error.name === 'CastError') {
      next(new BadRequestError('Невалидный ID товара'));
      return;
    }
    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError(error.message));
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
      next(new NotFoundError('Товар не найден'));
      return;
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      next(new BadRequestError('Невалидный ID товара'));
      return;
    }
    next(error);
  }
};
