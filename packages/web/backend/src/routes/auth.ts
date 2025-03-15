import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { validate, registerSchema, loginSchema, passwordResetRequestSchema, passwordResetConfirmSchema } from '../validators/authValidators';

const router = Router();

// Register a new user
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// Login user
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// Get current user profile
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

// Password reset request
router.post(
  '/password-reset/request',
  validate(passwordResetRequestSchema),
  authController.requestPasswordReset
);

// Password reset confirmation
router.post(
  '/password-reset/confirm',
  validate(passwordResetConfirmSchema),
  authController.confirmPasswordReset
);

// OAuth routes
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google-auth-failed' }),
  authController.oauthCallback
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login?error=github-auth-failed' }),
  authController.oauthCallback
);

// Apple OAuth
router.get('/apple', passport.authenticate('apple', { scope: ['name', 'email'] }));
router.get(
  '/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/login?error=apple-auth-failed' }),
  authController.oauthCallback
);

export default router; 