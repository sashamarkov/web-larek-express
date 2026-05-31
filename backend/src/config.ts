/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbAddress: process.env.DB_ADDRESS || 'mongodb://root:example@mongo:27017/weblarek?authSource=admin',
};

export default config;
