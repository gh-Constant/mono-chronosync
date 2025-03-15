import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces/auth';
import * as authService from '../services/authService';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const result = await authService.registerUser(userData);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const credentials = req.body;
    const result = await authService.loginUser(credentials);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await authService.getUserById(req.user.id);
    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error fetching profile' });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/password-reset/request
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error during password reset request' });
  }
};

/**
 * Reset password with token
 * @route POST /api/auth/password-reset/confirm
 */
export const confirmPasswordReset = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error during password reset' });
  }
};

/**
 * OAuth callback handler
 * @route GET /api/auth/:provider/callback
 */
export const oauthCallback = (req: Request, res: Response) => {
  try {
    // Passport.js attaches the user object to the request
    const authData = req.user as { user: any; token: string };
    
    if (!authData || !authData.token) {
      return res.redirect('/login?error=authentication-failed');
    }
    
    // Redirect to frontend with token
    // In production, you might want to use a more secure method
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${authData.token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect('/login?error=server-error');
  }
}; 