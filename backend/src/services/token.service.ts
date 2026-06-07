import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';
import config from '../config';

class TokenService {
  static generateAccessToken(userId: string | Types.ObjectId): string {
    const id = typeof userId === 'string' ? userId : userId.toString();
    return jwt.sign({ _id: id }, config.jwtAccessSecret as string, {
      expiresIn: config.accessTokenExpiry,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(userId: string | Types.ObjectId): string {
    const id = typeof userId === 'string' ? userId : userId.toString();
    return jwt.sign({ _id: id }, config.jwtRefreshSecret as string, {
      expiresIn: config.refreshTokenExpiry,
    } as jwt.SignOptions);
  }

  static generateTokens(userId: string | Types.ObjectId): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  static verifyAccessToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret as string) as {
        _id: string;
      };
      return decoded._id;
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret as string) as {
        _id: string;
      };
      return decoded._id;
    } catch {
      return null;
    }
  }

  static setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  static clearRefreshTokenCookie(res: Response): void {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    });
  }
}

export default TokenService;
