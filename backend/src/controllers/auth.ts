import { Response, NextFunction } from 'express';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';
import {
  generateTokens,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/tokens';
import { AuthRequest } from '../middlewares/auth';
import { ERROR_MESSAGES } from '../constants/messages';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS));
      return;
    }
    const user = await User.create({ email, password, name });
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.tokens.push({ token: refreshToken });
    await user.save();
    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({
      success: true,
      user: { email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new BadRequestError(ERROR_MESSAGES.VALIDATION_ERROR));
      return;
    }
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +tokens');
    if (!user) {
      next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
      return;
    }
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      next(new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS));
      return;
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    user.tokens.push({ token: refreshToken });
    await user.save();
    setRefreshTokenCookie(res, refreshToken);
    res.json({
      success: true,
      user: { email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      next(new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_NOT_PROVIDED));
      return;
    }
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      next(new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID));
      return;
    }
    const user = await User.findById(userId).select('+tokens');
    if (!user) {
      next(new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND));
      return;
    }
    const tokenExists = user.tokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      next(new UnauthorizedError(ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND));
      return;
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
    user.tokens.push({ token: newRefreshToken });
    await user.save();
    setRefreshTokenCookie(res, newRefreshToken);
    res.json({
      success: true,
      user: { email: user.email, name: user.name },
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      clearRefreshTokenCookie(res);
      res.json({ success: true });
      return;
    }
    const userId = verifyRefreshToken(refreshToken);
    if (userId) {
      const user = await User.findById(userId).select('+tokens');
      if (user) {
        user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
        await user.save();
      }
    }
    clearRefreshTokenCookie(res);
    res.json({ success: true });
  } catch (error) {
    clearRefreshTokenCookie(res);
    res.json({ success: true });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.userId) {
      next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED_NEED_AUTH));
      return;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      return;
    }
    res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};
