import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  MONGODB_URI: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const validateEnv = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      MONGODB_URI: process.env.MONGODB_URI,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'));
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
    }
    throw error;
  }
};

const env = validateEnv();

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  mongodbUri: env.MONGODB_URI,
  corsOrigin: env.CORS_ORIGIN,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const; 