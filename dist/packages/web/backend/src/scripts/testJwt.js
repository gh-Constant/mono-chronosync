"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../utils/auth");
const authService_1 = require("../services/authService");
// Load environment variables
dotenv_1.default.config();
// Test JWT and Account functions
const runTest = async () => {
    try {
        console.log('⚙️ Starting authentication system tests...\n');
        // Generate a unique email using timestamp
        const timestamp = new Date().getTime();
        const testEmail = `test.${timestamp}@example.com`;
        // Test password hashing
        console.log('🔒 Testing password hashing...');
        const password = 'TestPassword123!';
        const hashedPassword = (0, auth_1.hashPassword)(password);
        console.log('Original password:', password);
        console.log('Hashed password:', hashedPassword);
        console.log('Notice how the hashed password includes the salt in its format:');
        console.log('$2b$ - bcrypt identifier');
        console.log('10$ - rounds/cost factor');
        console.log('The next 22 characters - the salt');
        console.log('The rest - the actual hash\n');
        // Test user registration
        console.log('📝 Testing user registration...');
        const registrationData = {
            name: 'Test User',
            email: testEmail,
            password: 'TestPassword123!'
        };
        const registrationResult = await (0, authService_1.registerUser)(registrationData);
        console.log('✅ Registration successful!');
        console.log('👤 Created user:', {
            id: registrationResult.user.id,
            name: registrationResult.user.name,
            email: registrationResult.user.email
        });
        console.log('🔑 Registration token:', registrationResult.token, '\n');
        // Test user login
        console.log('🔐 Testing user login...');
        const loginData = {
            email: testEmail,
            password: 'TestPassword123!'
        };
        const loginResult = await (0, authService_1.loginUser)(loginData);
        console.log('✅ Login successful!');
        console.log('👤 Logged in user:', {
            id: loginResult.user.id,
            name: loginResult.user.name,
            email: loginResult.user.email
        });
        console.log('🔑 Login token:', loginResult.token, '\n');
        // Test JWT verification
        console.log('🔍 Testing JWT verification...');
        const decoded = (0, auth_1.verifyToken)(loginResult.token);
        console.log('✅ Decoded payload:', decoded);
        if (!decoded) {
            throw new Error('Token verification failed');
        }
        // Check if decoded payload matches user data
        if (decoded.id !== loginResult.user.id || decoded.email !== loginResult.user.email) {
            throw new Error('Decoded payload does not match user data');
        }
        console.log('\n🎉 All tests passed! Your authentication system is working correctly.');
    }
    catch (error) {
        console.error('\n❌ Authentication test failed:', error);
        process.exit(1);
    }
};
// Run the test
runTest().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});
