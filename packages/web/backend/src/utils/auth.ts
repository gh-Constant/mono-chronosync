import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { IJwtPayload } from '../interfaces/auth';

/**
 * Generates a random salt
 * @returns Salt as a string
 */
export const generateSalt = (): string => {
  return bcrypt.genSaltSync(10);
};

/**
 * Hashes a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Verifies a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hashed password
 * @returns True if password matches, false otherwise
 */
export const verifyPassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

/**
 * Generates a JWT token
 * @param payload - Data to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: IJwtPayload): string => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d'; // Default: 30 days
  
  // @ts-ignore - Ignore TypeScript issue with the secret type
  return jwt.sign(payload, secretKey, { expiresIn });
};

/**
 * Verifies a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): IJwtPayload | null => {
  const secretKey = process.env.JWT_SECRET;
  
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  
  try {
    // @ts-ignore - Ignore TypeScript issue with the secret type
    return jwt.verify(token, secretKey) as IJwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Generates a random verification token
 * @returns Random token string
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Calculates token expiry time
 * @param hours - Number of hours until expiry
 * @returns Date object representing expiry time
 */
export const calculateTokenExpiry = (hours: number = 24): Date => {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}; 