import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import { ERROR_MESSAGES } from '../constants/messages';

interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

interface IOrderResult {
  id: string;
  total: number;
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total }: IOrder = req.body;

    if (!items || items.length === 0) {
      throw new BadRequestError(ERROR_MESSAGES.CART_EMPTY);
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCTS_NOT_FOUND);
    }

    const invalidProduct = products.find((product) => product.price === null);
    if (invalidProduct) {
      throw new BadRequestError(ERROR_MESSAGES.PRODUCT_NOT_SOLD(invalidProduct.title));
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError(ERROR_MESSAGES.TOTAL_MISMATCH);
    }

    const result: IOrderResult = {
      id: randomUUID(),
      total,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default createOrder;
