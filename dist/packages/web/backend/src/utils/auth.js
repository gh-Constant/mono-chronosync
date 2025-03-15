"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTokenExpiry = exports.generateVerificationToken = exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = exports.generateSalt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a random salt
 * @returns Salt as a string
 */
const generateSalt = () => {
    return bcryptjs_1.default.genSaltSync(10);
};
exports.generateSalt = generateSalt;
/**
 * Hashes a password
 * @param password - Plain text password
 * @returns Hashed password
 */
const hashPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(10);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
/**
 * Verifies a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hashed password
 * @returns True if password matches, false otherwise
 */
const verifyPassword = (password, hashedPassword) => {
    return bcryptjs_1.default.compareSync(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
/**
 * Generates a JWT token
 * @param payload - Data to include in the token
 * @returns JWT token string
 */
const generateToken = (payload) => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '30d'; // Default: 30 days
    // @ts-ignore - Ignore TypeScript issue with the secret type
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn });
};
exports.generateToken = generateToken;
/**
 * Verifies a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    try {
        // @ts-ignore - Ignore TypeScript issue with the secret type
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Generates a random verification token
 * @returns Random token string
 */
const generateVerificationToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateVerificationToken = generateVerificationToken;
/**
 * Calculates token expiry time
 * @param hours - Number of hours until expiry
 * @returns Date object representing expiry time
 */
const calculateTokenExpiry = (hours = 24) => {
    const now = new Date();
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
};
exports.calculateTokenExpiry = calculateTokenExpiry;
