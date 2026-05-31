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

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new ConflictError('Пользователь с таким email уже существует'));
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
      next(new BadRequestError(error.message));
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
      next(new UnauthorizedError('Неверный email или пароль'));
      return;
    }
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      next(new UnauthorizedError('Неверный email или пароль'));
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
      next(new UnauthorizedError('Refresh token не предоставлен'));
      return;
    }
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      next(new UnauthorizedError('Невалидный refresh token'));
      return;
    }
    const user = await User.findById(userId).select('+tokens');
    if (!user) {
      next(new UnauthorizedError('Пользователь не найден'));
      return;
    }
    const tokenExists = user.tokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      next(new UnauthorizedError('Refresh token не найден'));
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
      next(new UnauthorizedError('Необходима авторизация'));
      return;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
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
