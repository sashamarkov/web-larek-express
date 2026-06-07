/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface IConfig {
  port: number;
  dbAddress: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  tempUploadDir: string;
  publicUploadDir: string;
  originAllow: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

const config: IConfig = {
  port: Number(process.env.PORT) || 3000,
  dbAddress: process.env.DB_ADDRESS || 'mongodb://root:example@mongo:27017/weblarek?authSource=admin',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'weblarek_access_7f3k9d2m1x8v4n6p2q5r',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'weblarek_refresh_9h4j2k7m1x5v3n8p6q9r',
  tempUploadDir: process.env.TEMP_UPLOAD_DIR || path.join(__dirname, '../temp'),
  publicUploadDir: process.env.PUBLIC_UPLOAD_DIR || path.join(__dirname, '../public/images'),
  originAllow: process.env.ORIGIN_ALLOW || 'http://localhost:5173',
  accessTokenExpiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
  refreshTokenExpiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
};

export default config;
