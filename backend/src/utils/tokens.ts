import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config';

export function generateAccessToken(userId: string | Types.ObjectId): string {
  const id = typeof userId === 'string' ? userId : userId.toString();
  const secret = String(config.jwtAccessSecret);
  return jwt.sign({ _id: id }, secret, {
    expiresIn: config.accessTokenExpiry,
  } as jwt.SignOptions);
}

export function generateRefreshToken(userId: string | Types.ObjectId): string {
  const id = typeof userId === 'string' ? userId : userId.toString();
  const secret = String(config.jwtRefreshSecret);
  return jwt.sign({ _id: id }, secret, {
    expiresIn: config.refreshTokenExpiry,
  } as jwt.SignOptions);
}

export function generateTokens(userId: string | Types.ObjectId): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}

export function verifyAccessToken(token: string): string | null {
  try {
    const secret = String(config.jwtAccessSecret);
    const decoded = jwt.verify(token, secret) as { _id: string };
    return decoded._id;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): string | null {
  try {
    const secret = String(config.jwtRefreshSecret);
    const decoded = jwt.verify(token, secret) as { _id: string };
    return decoded._id;
  } catch {
    return null;
  }
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge,
    path: '/',
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 0,
    path: '/',
  });
}
