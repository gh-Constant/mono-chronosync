import dotenv from 'dotenv';
import { hashPassword, verifyToken } from '../utils/auth';
import { registerUser, loginUser } from '../services/authService';
import { RegisterRequestBody, LoginRequestBody } from '../interfaces/auth';

// Load environment variables
dotenv.config();

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
    const hashedPassword = hashPassword(password);
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    console.log('Notice how the hashed password includes the salt in its format:');
    console.log('$2b$ - bcrypt identifier');
    console.log('10$ - rounds/cost factor');
    console.log('The next 22 characters - the salt');
    console.log('The rest - the actual hash\n');
    
    // Test user registration
    console.log('📝 Testing user registration...');
    const registrationData: RegisterRequestBody = {
      name: 'Test User',
      email: testEmail,
      password: 'TestPassword123!'
    };
    
    const registrationResult = await registerUser(registrationData);
    console.log('✅ Registration successful!');
    console.log('👤 Created user:', {
      id: registrationResult.user.id,
      name: registrationResult.user.name,
      email: registrationResult.user.email
    });
    console.log('🔑 Registration token:', registrationResult.token, '\n');

    // Test user login
    console.log('🔐 Testing user login...');
    const loginData: LoginRequestBody = {
      email: testEmail,
      password: 'TestPassword123!'
    };

    const loginResult = await loginUser(loginData);
    console.log('✅ Login successful!');
    console.log('👤 Logged in user:', {
      id: loginResult.user.id,
      name: loginResult.user.name,
      email: loginResult.user.email
    });
    console.log('🔑 Login token:', loginResult.token, '\n');

    // Test JWT verification
    console.log('🔍 Testing JWT verification...');
    const decoded = verifyToken(loginResult.token);
    console.log('✅ Decoded payload:', decoded);
    
    if (!decoded) {
      throw new Error('Token verification failed');
    }
    
    // Check if decoded payload matches user data
    if (decoded.id !== loginResult.user.id || decoded.email !== loginResult.user.email) {
      throw new Error('Decoded payload does not match user data');
    }
    
    console.log('\n🎉 All tests passed! Your authentication system is working correctly.');
  } catch (error) {
    console.error('\n❌ Authentication test failed:', error);
    process.exit(1);
  }
};

// Run the test
runTest().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 