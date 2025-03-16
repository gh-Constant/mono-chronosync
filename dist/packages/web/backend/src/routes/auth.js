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
const router = (0, express_1.Router)();
// Register a new user
router.post('/register', (0, authValidators_1.validate)(authValidators_1.registerSchema), authController.register);
// Login user
router.post('/login', (0, authValidators_1.validate)(authValidators_1.loginSchema), authController.login);
// Get current user profile
router.get('/profile', authMiddleware_1.authenticate, authController.getProfile);
// Password reset request
router.post('/password-reset/request', (0, authValidators_1.validate)(authValidators_1.passwordResetRequestSchema), authController.requestPasswordReset);
// Password reset confirmation
router.post('/password-reset/confirm', (0, authValidators_1.validate)(authValidators_1.passwordResetConfirmSchema), authController.confirmPasswordReset);
// OAuth routes
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/login?error=google-auth-failed' }), authController.oauthCallback);
// GitHub OAuth
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport_1.default.authenticate('github', { session: false, failureRedirect: '/login?error=github-auth-failed' }), authController.oauthCallback);
// Apple OAuth routes removed
exports.default = router;
