"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
/**
 * Middleware to check if the user is authenticated via JWT
 * Adds the user object to the request if authenticated
 */
const authenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization token provided' });
    }
    // Check if authorization header has the correct format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token format is invalid' });
    }
    const token = parts[1];
    // Verify token
    const decoded = (0, auth_1.verifyToken)(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    // Add user info to request
    req.user = decoded;
    next();
};
exports.authenticate = authenticate;
/**
 * Middleware to check if the user has an optional authentication
 * Adds the user object to the request if authenticated, but continues even if no token is present
 */
const optionalAuthenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(); // No token, but that's OK for optional auth
    }
    // Check if authorization header has the correct format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return next(); // Invalid format, but that's OK for optional auth
    }
    const token = parts[1];
    // Verify token
    const decoded = (0, auth_1.verifyToken)(token);
    if (decoded) {
        // Add user info to request
        req.user = decoded;
    }
    next();
};
exports.optionalAuthenticate = optionalAuthenticate;
