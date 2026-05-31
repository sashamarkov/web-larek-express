import config from '../config';

const requiredEnvVars = [
  'jwtAccessSecret',
  'jwtRefreshSecret',
  'dbAddress',
  'port',
];

const validateEnv = (): void => {
  const missingVars: string[] = [];

  requiredEnvVars.forEach((key) => {
    const value = config[key as keyof typeof config];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
};

export default validateEnv;
