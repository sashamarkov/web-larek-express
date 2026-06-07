// eslint-disable-next-line import/no-extraneous-dependencies
import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Слишком много запросов с этого IP, попробуйте позже',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
