/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import winston from 'winston';
import router from './routes';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middlewares/logger';
import config from './config';
import { ERROR_MESSAGES } from './constants/messages';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

interface IError extends Error {
  statusCode?: number;
  code?: number;
}

const app = express();

app.use(requestLogger);

app.use(cors({
  origin: config.originAllow,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use((_req, _res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND));
});

app.use(errors());
app.use(errorLogger);

app.use((
  err: IError,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? ERROR_MESSAGES.SERVER_ERROR
    : err.message;

  res.status(statusCode).json({ message });
});

const startServer = async () => {
  try {
    await mongoose.connect(config.dbAddress);
    logger.info('Connected to MongoDB');

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
  }
};

startServer();
