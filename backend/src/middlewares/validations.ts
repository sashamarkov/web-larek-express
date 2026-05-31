/* eslint-disable import/no-extraneous-dependencies */
import { Joi, celebrate, Segments } from 'celebrate';

const productImageSchema = Joi.object({
  fileName: Joi.string().required(),
  originalName: Joi.string().required(),
});

const productBaseSchema = {
  title: Joi.string().min(2).max(30),
  image: productImageSchema,
  category: Joi.string(),
  description: Joi.string().optional().allow(''),
  price: Joi.number().allow(null),
};

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object({
    title: productBaseSchema.title.required(),
    image: productBaseSchema.image.required(),
    category: productBaseSchema.category.required(),
    description: productBaseSchema.description,
    price: productBaseSchema.price.default(null),
  }),
});

export const validateUpdateProduct = celebrate({
  [Segments.BODY]: Joi.object({
    title: productBaseSchema.title.optional(),
    image: productBaseSchema.image.optional(),
    category: productBaseSchema.category.optional(),
    description: productBaseSchema.description,
    price: productBaseSchema.price.optional(),
  }),
});

export const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string()).min(1).required(),
  }),
});
