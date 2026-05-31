import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import { ERROR_MESSAGES } from '../constants/messages';

const DUPLICATE_KEY_ERROR = 'E11000';

export const handleMongooseError = (error: unknown): Error | null => {
  if (error instanceof Error && error.message.includes(DUPLICATE_KEY_ERROR)) {
    return new ConflictError(ERROR_MESSAGES.DUPLICATE_TITLE);
  }
  if (error instanceof MongooseError.ValidationError) {
    return new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR);
  }
  if (error instanceof Error && error.name === 'CastError') {
    return new BadRequestError(ERROR_MESSAGES.INVALID_PRODUCT_ID);
  }
  return null;
};

export const handleNotFoundError = (document: unknown, message: string): void => {
  if (!document) {
    throw new NotFoundError(message);
  }
};
