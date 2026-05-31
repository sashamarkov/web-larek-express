import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';
import { ERROR_MESSAGES } from '../constants/messages';
import TokenService from '../services/token.service';

export interface AuthRequest extends Request {
  userId?: string;
}

export default function auth(req: AuthRequest, _res: Response, next: NextFunction): void {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    [, token] = authHeader.split(' ');
  } else if (req.cookies && typeof req.cookies === 'object' && 'accessToken' in req.cookies) {
    token = req.cookies.accessToken as string;
  }

  if (!token) {
    next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED_NEED_AUTH));
    return;
  }

  const userId = TokenService.verifyAccessToken(token);
  if (!userId) {
    next(new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN));
    return;
  }

  req.userId = userId;
  next();
}
