import { Request } from 'express';
import { IJwtPayload, IRegisterCredentials, ILoginCredentials } from '@chronosync/common';

// Extend Express Request to include user property
export interface AuthRequest extends Request {
  user?: IJwtPayload;
}

// Define User interface with snake_case property names to match database schema
export interface User {
  id: number;
  name: string;
  email: string;
  hashed_password?: string;
  image?: string;
  email_verified?: Date;
  verification_token?: string;
  verification_token_expires?: Date;
  created_at: Date;
  updated_at?: Date;
}

export type { IJwtPayload };
export type { IRegisterCredentials as RegisterRequestBody };
export type { ILoginCredentials as LoginRequestBody };

// Auth response with JWT token
export interface AuthResponse {
  user: Omit<User, 'hashed_password' | 'verification_token' | 'verification_token_expires'>;
  token: string;
}

// Password reset request
export interface PasswordResetRequestBody {
  email: string;
}

// Password reset confirmation
export interface PasswordResetConfirmBody {
  token: string;
  password: string;
} 