import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthRequest } from '../interfaces/auth';

/**
 * Middleware to check if the user is authenticated via JWT
 * Adds the user object to the request if authenticated
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Add user info to request
  req.user = decoded;
  next();
};

/**
 * Middleware to check if the user has an optional authentication
 * Adds the user object to the request if authenticated, but continues even if no token is present
 */
export const optionalAuthenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  const decoded = verifyToken(token);
  if (decoded) {
    // Add user info to request
    req.user = decoded;
  }
  
  next();
}; 