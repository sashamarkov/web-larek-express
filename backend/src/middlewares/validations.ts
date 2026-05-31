/* eslint-disable import/no-extraneous-dependencies */
import { Joi, celebrate, Segments } from 'celebrate';

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().allow(null).default(null),
  }),
});

export const validateUpdateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).optional(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).optional(),
    category: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().allow(null).optional(),
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
