"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.passwordResetConfirmSchema = exports.passwordResetRequestSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Registration input validation schema
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});
// Login input validation schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z.string().min(1, { message: 'Password is required' }),
});
// Password reset request validation schema
exports.passwordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
});
// Password reset confirmation validation schema
exports.passwordResetConfirmSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, { message: 'Token is required' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});
// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            return res.status(500).json({ message: 'Internal server error during validation' });
        }
    };
};
exports.validate = validate;
