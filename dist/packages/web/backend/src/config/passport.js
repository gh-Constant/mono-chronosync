"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const database_1 = require("./database");
const auth_1 = require("../utils/auth");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Configure Passport strategies
const configurePassport = () => {
    // Log OAuth configuration for debugging
    console.log('OAuth Configuration:');
    console.log('Google callback URL:', `${process.env.API_URL}/auth/google/callback`);
    // Google OAuth Strategy
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists with this provider account
            const existingAccountResult = await (0, database_1.query)('SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_account_id = $2 LIMIT 1', ['google', profile.id]);
            let userId;
            if (existingAccountResult.rows.length > 0) {
                // User exists, get user ID
                userId = existingAccountResult.rows[0].user_id;
            }
            else {
                // Check if user exists with this email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
                const existingUserResult = await (0, database_1.query)('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
                if (existingUserResult.rows.length > 0) {
                    // User exists with this email, link the account
                    userId = existingUserResult.rows[0].id;
                    // Create OAuth account link
                    await (0, database_1.query)(`INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`, [userId, 'google', profile.id, accessToken, refreshToken]);
                }
                else {
                    // Create new user
                    const name = profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : 'Google User');
                    const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
                    const newUserResult = await (0, database_1.query)(`INSERT INTO users 
                (name, email, image, email_verified) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id`, [name, email, image, new Date()]);
                    userId = newUserResult.rows[0].id;
                    // Create OAuth account link
                    await (0, database_1.query)(`INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`, [userId, 'google', profile.id, accessToken, refreshToken]);
                }
            }
            // Get user data
            const userResult = await (0, database_1.query)('SELECT id, name, email, image, email_verified, created_at FROM users WHERE id = $1', [userId]);
            const user = userResult.rows[0];
            // Generate JWT token
            const token = (0, auth_1.generateToken)({
                id: user.id,
                email: user.email,
                name: user.name
            });
            return done(null, { user, token });
        }
        catch (error) {
            return done(error);
        }
    }));
    // GitHub OAuth Strategy
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: `${process.env.API_URL}/auth/github/callback`,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists with this provider account
            const existingAccountResult = await (0, database_1.query)('SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_account_id = $2 LIMIT 1', ['github', profile.id]);
            let userId;
            if (existingAccountResult.rows.length > 0) {
                // User exists, get user ID
                userId = existingAccountResult.rows[0].user_id;
            }
            else {
                // Get primary email from GitHub
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
                // Check if user exists with this email
                const existingUserResult = await (0, database_1.query)('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
                if (existingUserResult.rows.length > 0) {
                    // User exists with this email, link the account
                    userId = existingUserResult.rows[0].id;
                    // Create OAuth account link
                    await (0, database_1.query)(`INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`, [userId, 'github', profile.id, accessToken, refreshToken]);
                }
                else {
                    // Create new user
                    const name = profile.displayName || profile.username || 'GitHub User';
                    const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
                    const newUserResult = await (0, database_1.query)(`INSERT INTO users 
                (name, email, image, email_verified) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id`, [name, email, image, new Date()]);
                    userId = newUserResult.rows[0].id;
                    // Create OAuth account link
                    await (0, database_1.query)(`INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`, [userId, 'github', profile.id, accessToken, refreshToken]);
                }
            }
            // Get user data
            const userResult = await (0, database_1.query)('SELECT id, name, email, image, email_verified, created_at FROM users WHERE id = $1', [userId]);
            const user = userResult.rows[0];
            // Generate JWT token
            const token = (0, auth_1.generateToken)({
                id: user.id,
                email: user.email,
                name: user.name
            });
            return done(null, { user, token });
        }
        catch (error) {
            return done(error);
        }
    }));
    // Serialize and deserialize user
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((user, done) => {
        done(null, user);
    });
};
exports.configurePassport = configurePassport;
exports.default = exports.configurePassport;
