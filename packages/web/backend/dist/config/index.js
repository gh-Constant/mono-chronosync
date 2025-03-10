"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    JWT_SECRET: zod_1.z.string().optional(),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    MONGODB_URI: zod_1.z.string().optional(),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
});
const validateEnv = () => {
    try {
        return envSchema.parse({
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            JWT_SECRET: process.env.JWT_SECRET,
            JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
            MONGODB_URI: process.env.MONGODB_URI,
            CORS_ORIGIN: process.env.CORS_ORIGIN,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const missingVars = error.errors.map(err => err.path.join('.'));
            throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
        }
        throw error;
    }
};
const env = validateEnv();
exports.config = {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    mongodbUri: env.MONGODB_URI,
    corsOrigin: env.CORS_ORIGIN,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
};
