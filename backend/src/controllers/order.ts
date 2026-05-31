import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import { IOrder, IOrderResult } from '../types';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total }: IOrder = req.body;

    if (!items || items.length === 0) {
      throw new BadRequestError('Корзина не может быть пустой');
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      throw new BadRequestError('Некоторые товары не найдены');
    }

    const invalidProduct = products.find((product) => product.price === null);
    if (invalidProduct) {
      throw new BadRequestError(`Товар "${invalidProduct.title}" не продается (он бесценен)`);
    }

    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError('Сумма заказа не совпадает с суммой товаров');
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
