import { Router } from 'express';
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

// Login
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// Get current user profile (requires authentication)
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

// Request password reset
router.post(
  '/password-reset/request',
  validate(passwordResetRequestSchema),
  authController.requestPasswordReset
);

// Reset password with token
router.post(
  '/password-reset/confirm',
  validate(passwordResetConfirmSchema),
  authController.confirmPasswordReset
);

export default router; 