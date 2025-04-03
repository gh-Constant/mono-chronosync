"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authController = __importStar(require("../controllers/authController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authValidators_1 = require("../validators/authValidators");
const express_rate_limit_1 = require("express-rate-limit");
const router = (0, express_1.Router)();
// Create an auth-specific rate limiter for sensitive routes (if not provided by app.locals)
const authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // 10 attempts per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later',
});
// Apply auth limiter to sensitive routes
const applyAuthLimiter = (req, res, next) => {
    // Use app-wide limiter if available, otherwise use local one
    const limiter = req.app.locals.authLimiter || authLimiter;
    return limiter(req, res, next);
};
// Register a new user
router.post('/register', applyAuthLimiter, // Apply rate limiting
(0, authValidators_1.validate)(authValidators_1.registerSchema), authController.register);
// Add debug endpoint that accepts all methods for testing
router.all('/debug', (req, res) => {
    res.status(200).json({
        message: 'Debug endpoint reached successfully',
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        timestamp: new Date().toISOString()
    });
});
// Login user
router.post('/login', applyAuthLimiter, // Apply rate limiting
(0, authValidators_1.validate)(authValidators_1.loginSchema), authController.login);
// Get current user profile
router.get('/profile', authMiddleware_1.authenticate, authController.getProfile);
// Password reset request
router.post('/password-reset/request', applyAuthLimiter, // Apply rate limiting
(0, authValidators_1.validate)(authValidators_1.passwordResetRequestSchema), authController.requestPasswordReset);
// Password reset confirmation
router.post('/password-reset/confirm', applyAuthLimiter, // Apply rate limiting
(0, authValidators_1.validate)(authValidators_1.passwordResetConfirmSchema), authController.confirmPasswordReset);
// OAuth routes
// Google OAuth
router.get('/google', (req, res, next) => {
    // Store redirect_uri in query params for the callback
    const redirectUri = req.query.redirect_uri;
    const authOptions = {
        scope: ['profile', 'email'],
        state: redirectUri ? Buffer.from(redirectUri).toString('base64') : undefined
    };
    passport_1.default.authenticate('google', authOptions)(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
    // Restore redirect_uri from state if present
    if (req.query.state) {
        try {
            const redirectUri = Buffer.from(req.query.state, 'base64').toString();
            req.query.redirect_uri = redirectUri;
        }
        catch (err) {
            console.error('Failed to decode state parameter:', err);
        }
    }
    passport_1.default.authenticate('google', { session: false, failureRedirect: '/login?error=google-auth-failed' })(req, res, next);
}, authController.oauthCallback);
// GitHub OAuth
router.get('/github', (req, res, next) => {
    // Store redirect_uri in query params for the callback
    const redirectUri = req.query.redirect_uri;
    const authOptions = {
        scope: ['user:email'],
        state: redirectUri ? Buffer.from(redirectUri).toString('base64') : undefined
    };
    passport_1.default.authenticate('github', authOptions)(req, res, next);
});
router.get('/github/callback', (req, res, next) => {
    // Restore redirect_uri from state if present
    if (req.query.state) {
        try {
            const redirectUri = Buffer.from(req.query.state, 'base64').toString();
            req.query.redirect_uri = redirectUri;
        }
        catch (err) {
            console.error('Failed to decode state parameter:', err);
        }
    }
    passport_1.default.authenticate('github', { session: false, failureRedirect: '/login?error=github-auth-failed' })(req, res, next);
}, authController.oauthCallback);
// Apple OAuth routes removed
exports.default = router;
