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
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthCallback = exports.confirmPasswordReset = exports.requestPasswordReset = exports.getProfile = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error during registration' });
    }
};
exports.register = register;
/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const credentials = req.body;
        const result = await authService.loginUser(credentials);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error during login' });
    }
};
exports.login = login;
/**
 * Get current user profile
 * @route GET /api/auth/profile
 */
const getProfile = async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user || !authReq.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await authService.getUserById(authReq.user.id);
        return res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error fetching profile' });
    }
};
exports.getProfile = getProfile;
/**
 * Request password reset
 * @route POST /api/auth/password-reset/request
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.requestPasswordReset(email);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error during password reset request' });
    }
};
exports.requestPasswordReset = requestPasswordReset;
/**
 * Reset password with token
 * @route POST /api/auth/password-reset/confirm
 */
const confirmPasswordReset = async (req, res) => {
    try {
        const { token, password } = req.body;
        const result = await authService.resetPassword(token, password);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error during password reset' });
    }
};
exports.confirmPasswordReset = confirmPasswordReset;
/**
 * OAuth callback handler
 * @route GET /api/auth/:provider/callback
 */
const oauthCallback = (req, res) => {
    try {
        // Passport.js attaches the user object to the request
        const authData = req.user;
        if (!authData || !authData.token) {
            return res.redirect('/login?error=authentication-failed');
        }
        // Redirect to frontend with token
        // In production, you might want to use a more secure method
        return res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${authData.token}`);
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        return res.redirect('/login?error=server-error');
    }
};
exports.oauthCallback = oauthCallback;
