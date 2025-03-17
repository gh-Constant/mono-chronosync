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
router.get('/google', (req, res, next) => {
  // Store redirect_uri in query params for the callback
  const redirectUri = req.query.redirect_uri as string;
  const authOptions = { 
    scope: ['profile', 'email'],
    state: redirectUri ? Buffer.from(redirectUri).toString('base64') : undefined
  };
  passport.authenticate('google', authOptions)(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    // Restore redirect_uri from state if present
    if (req.query.state) {
      try {
        const redirectUri = Buffer.from(req.query.state as string, 'base64').toString();
        req.query.redirect_uri = redirectUri;
      } catch (err) {
        console.error('Failed to decode state parameter:', err);
      }
    }
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=google-auth-failed' })(req, res, next);
  },
  authController.oauthCallback
);

// GitHub OAuth
router.get('/github', (req, res, next) => {
  // Store redirect_uri in query params for the callback
  const redirectUri = req.query.redirect_uri as string;
  const authOptions = { 
    scope: ['user:email'],
    state: redirectUri ? Buffer.from(redirectUri).toString('base64') : undefined
  };
  passport.authenticate('github', authOptions)(req, res, next);
});

router.get(
  '/github/callback',
  (req, res, next) => {
    // Restore redirect_uri from state if present
    if (req.query.state) {
      try {
        const redirectUri = Buffer.from(req.query.state as string, 'base64').toString();
        req.query.redirect_uri = redirectUri;
      } catch (err) {
        console.error('Failed to decode state parameter:', err);
      }
    }
    passport.authenticate('github', { session: false, failureRedirect: '/login?error=github-auth-failed' })(req, res, next);
  },
  authController.oauthCallback
);

// Apple OAuth routes removed

export default router; 