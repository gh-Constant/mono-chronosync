import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { validate, registerSchema, loginSchema, passwordResetRequestSchema, passwordResetConfirmSchema } from '../validators/authValidators';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Create an auth-specific rate limiter for sensitive routes (if not provided by app.locals)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // 10 attempts per hour
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later',
});

// Apply auth limiter to sensitive routes
const applyAuthLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Use app-wide limiter if available, otherwise use local one
  const limiter = req.app.locals.authLimiter || authLimiter;
  return limiter(req, res, next);
};

// Register a new user
router.post(
  '/register',
  applyAuthLimiter, // Apply rate limiting
  validate(registerSchema),
  authController.register
);

// Login user
router.post(
  '/login',
  applyAuthLimiter, // Apply rate limiting
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
  applyAuthLimiter, // Apply rate limiting
  validate(passwordResetRequestSchema),
  authController.requestPasswordReset
);

// Password reset confirmation
router.post(
  '/password-reset/confirm',
  applyAuthLimiter, // Apply rate limiting
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