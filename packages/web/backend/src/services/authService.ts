import { query } from '../config/database';
import { hashPassword, verifyPassword, generateToken, generateVerificationToken, calculateTokenExpiry } from '../utils/auth';
import { RegisterRequestBody, LoginRequestBody, IJwtPayload } from '../interfaces/auth';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Register a new user
 * @param userData User registration data
 * @returns User object and JWT token
 */
export const registerUser = async (userData: RegisterRequestBody) => {
  // Check if user already exists
  const existingUser = await query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [userData.email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = hashPassword(userData.password);
  
  // Generate verification token
  const verificationToken = generateVerificationToken();
  const tokenExpiry = calculateTokenExpiry(24); // 24 hours

  // Create new user
  const newUserResult = await query(
    `INSERT INTO users (name, email, hashed_password, verification_token, verification_token_expires) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, image, created_at`,
    [userData.name, userData.email, hashedPassword, verificationToken, tokenExpiry]
  );

  const newUser = newUserResult.rows[0];

  // Generate JWT token
  const payload: IJwtPayload = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
  
  const token = generateToken(payload);

  // TODO: Send verification email (implement in a separate service)

  return {
    user: newUser,
    token,
  };
};

/**
 * Login a user
 * @param credentials Login credentials
 * @returns User object and JWT token
 */
export const loginUser = async (credentials: { email: string; password: string }) => {
  console.log('Attempting login for email:', credentials.email);

  // Find user by email with explicit field selection
  const userResult = await query(
    `SELECT id, name, email, hashed_password, image, created_at 
     FROM users 
     WHERE email = $1 
     LIMIT 1`,
    [credentials.email]
  );

  console.log('Database query result:', {
    hasUser: !!userResult.rows[0],
    rowCount: userResult.rowCount
  });

  const user = userResult.rows[0];
  if (!user) {
    console.log('Login failed: User not found');
    throw new Error('Invalid email or password');
  }

  // Verify password
  if (!user.hashed_password) {
    console.log('Login failed: User has no password (OAuth account)');
    throw new Error('This account cannot login with password');
  }

  // Ensure hashedPassword is a string
  const storedHash = String(user.hashed_password);
  const isPasswordValid = verifyPassword(credentials.password, storedHash);

  console.log('Password verification result:', {
    isValid: isPasswordValid,
    userId: user.id
  });

  if (!isPasswordValid) {
    console.log('Login failed: Invalid password');
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  const token = generateToken(payload);

  console.log('Login successful:', {
    userId: user.id,
    tokenGenerated: !!token,
    tokenLength: token.length
  });

  // Return user info without sensitive data
  const { hashed_password: _, ...userWithoutSensitiveData } = user;
  return {
    user: userWithoutSensitiveData,
    token,
  };
};

/**
 * Get user by ID
 * @param userId User ID
 * @returns User object without sensitive data
 */
export const getUserById = async (userId: number) => {
  const userResult = await query(
    `SELECT id, name, email, image, email_verified, created_at 
     FROM users 
     WHERE id = $1 
     LIMIT 1`,
    [userId]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Request password reset
 * @param email User email
 * @returns Success message
 */
export const requestPasswordReset = async (email: string) => {
  // Find user by email
  const userResult = await query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );

  const user = userResult.rows[0];

  if (!user) {
    // Don't reveal that email doesn't exist
    return { message: 'If your email is registered, you will receive a password reset link' };
  }

  // Generate verification token
  const verificationToken = generateVerificationToken();
  const tokenExpiry = calculateTokenExpiry(1); // 1 hour

  // Update user with reset token
  await query(
    `UPDATE users 
     SET verification_token = $1, verification_token_expires = $2 
     WHERE id = $3`,
    [verificationToken, tokenExpiry, user.id]
  );

  // TODO: Send password reset email (implement in a separate service)

  return { message: 'If your email is registered, you will receive a password reset link' };
};

/**
 * Reset password with token
 * @param token Verification token
 * @param newPassword New password
 * @returns Success message
 */
export const resetPassword = async (token: string, newPassword: string) => {
  // Find user by verification token
  const userResult = await query(
    'SELECT * FROM users WHERE verification_token = $1 LIMIT 1',
    [token]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Check if token is expired
  if (!user.verification_token_expires || new Date() > user.verification_token_expires) {
    throw new Error('Token has expired');
  }

  // Generate new salt and hash password
  const hashedPassword = hashPassword(newPassword);

  // Update user password and clear token
  await query(
    `UPDATE users 
     SET hashed_password = $1, verification_token = NULL, verification_token_expires = NULL 
     WHERE id = $2`,
    [hashedPassword, user.id]
  );

  return { message: 'Password has been reset successfully' };
}; 