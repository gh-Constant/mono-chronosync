import { Request } from 'express';
import { User } from '../models/schema';
import { IJwtPayload, IRegisterCredentials, ILoginCredentials } from '@chronosync/common';

// Extend Express Request to include user property
export interface AuthRequest extends Request {
  user?: IJwtPayload;
}

export type { IJwtPayload };
export type { IRegisterCredentials as RegisterRequestBody };
export type { ILoginCredentials as LoginRequestBody };

// Auth response with JWT token
export interface AuthResponse {
  user: Omit<User, 'hashedPassword' | 'salt'>;
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