import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { users } from '../models/schema';
import { hashPassword, verifyPassword, generateToken, generateVerificationToken, calculateTokenExpiry } from '../utils/auth';
import { RegisterRequestBody, LoginRequestBody, JwtPayload } from '../interfaces/auth';

/**
 * Register a new user
 * @param userData User registration data
 * @returns User object and JWT token
 */
export const registerUser = async (userData: RegisterRequestBody) => {
  // Check if user already exists
  const existingUser = await db.select()
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = hashPassword(userData.password);
  
  // Generate verification token
  const verificationToken = generateVerificationToken();
  const tokenExpiry = calculateTokenExpiry(24); // 24 hours

  // Create new user
  const [newUser] = await db.insert(users)
    .values({
      name: userData.name,
      email: userData.email,
      hashedPassword: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpires: tokenExpiry,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      createdAt: users.createdAt,
    });

  // Generate JWT token
  const payload: JwtPayload = {
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
export const loginUser = async (credentials: LoginRequestBody) => {
  // Find user by email with explicit field selection
  const [user] = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    hashedPassword: users.hashedPassword,
    image: users.image,
    createdAt: users.createdAt,
  })
  .from(users)
  .where(eq(users.email, credentials.email))
  .limit(1);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  if (!user.hashedPassword) {
    throw new Error('This account cannot login with password');
  }

  // Ensure hashedPassword is a string
  const storedHash = String(user.hashedPassword);

  const isPasswordValid = verifyPassword(
    credentials.password,
    storedHash
  );

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
  
  const token = generateToken(payload);

  // Return user info without sensitive data
  const { hashedPassword: _, ...userWithoutSensitiveData } = user;

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
  const [user] = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    image: users.image,
    emailVerified: users.emailVerified,
    createdAt: users.createdAt,
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);

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
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // Don't reveal that email doesn't exist
    return { message: 'If your email is registered, you will receive a password reset link' };
  }

  // Generate verification token
  const verificationToken = generateVerificationToken();
  const tokenExpiry = calculateTokenExpiry(1); // 1 hour

  // Update user with reset token
  await db.update(users)
    .set({
      verificationToken,
      verificationTokenExpires: tokenExpiry,
    })
    .where(eq(users.id, user.id));

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
  const [user] = await db.select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Check if token is expired
  if (!user.verificationTokenExpires || new Date() > user.verificationTokenExpires) {
    throw new Error('Token has expired');
  }

  // Generate new salt and hash password
  const hashedPassword = hashPassword(newPassword);

  // Update user password and clear token
  await db.update(users)
    .set({
      hashedPassword,
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    })
    .where(eq(users.id, user.id));

  return { message: 'Password has been reset successfully' };
}; 