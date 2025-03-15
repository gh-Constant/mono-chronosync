import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query } from './database';
import { generateToken } from '../utils/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Passport strategies
export const configurePassport = () => {
  // Log OAuth configuration for debugging
  console.log('OAuth Configuration:');
  console.log('Google callback URL:', `${process.env.API_URL}/auth/google/callback`);
  
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this provider account
          const existingAccountResult = await query(
            'SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_account_id = $2 LIMIT 1',
            ['google', profile.id]
          );

          let userId;

          if (existingAccountResult.rows.length > 0) {
            // User exists, get user ID
            userId = existingAccountResult.rows[0].user_id;
          } else {
            // Check if user exists with this email
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            const existingUserResult = await query(
              'SELECT * FROM users WHERE email = $1 LIMIT 1',
              [email]
            );

            if (existingUserResult.rows.length > 0) {
              // User exists with this email, link the account
              userId = existingUserResult.rows[0].id;
              
              // Create OAuth account link
              await query(
                `INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'google', profile.id, accessToken, refreshToken]
              );
            } else {
              // Create new user
              const name = profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : 'Google User');
              const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
              
              const newUserResult = await query(
                `INSERT INTO users 
                (name, email, image, email_verified) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id`,
                [name, email, image, new Date()]
              );
              
              userId = newUserResult.rows[0].id;
              
              // Create OAuth account link
              await query(
                `INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'google', profile.id, accessToken, refreshToken]
              );
            }
          }

          // Get user data
          const userResult = await query(
            'SELECT id, name, email, image, email_verified, created_at FROM users WHERE id = $1',
            [userId]
          );
          
          const user = userResult.rows[0];
          
          // Generate JWT token
          const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name
          });

          return done(null, { user, token });
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: `${process.env.API_URL}/auth/github/callback`,
        scope: ['user:email']
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Check if user exists with this provider account
          const existingAccountResult = await query(
            'SELECT * FROM oauth_accounts WHERE provider = $1 AND provider_account_id = $2 LIMIT 1',
            ['github', profile.id]
          );

          let userId;

          if (existingAccountResult.rows.length > 0) {
            // User exists, get user ID
            userId = existingAccountResult.rows[0].user_id;
          } else {
            // Get primary email from GitHub
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            
            // Check if user exists with this email
            const existingUserResult = await query(
              'SELECT * FROM users WHERE email = $1 LIMIT 1',
              [email]
            );

            if (existingUserResult.rows.length > 0) {
              // User exists with this email, link the account
              userId = existingUserResult.rows[0].id;
              
              // Create OAuth account link
              await query(
                `INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'github', profile.id, accessToken, refreshToken]
              );
            } else {
              // Create new user
              const name = profile.displayName || profile.username || 'GitHub User';
              const image = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
              
              const newUserResult = await query(
                `INSERT INTO users 
                (name, email, image, email_verified) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id`,
                [name, email, image, new Date()]
              );
              
              userId = newUserResult.rows[0].id;
              
              // Create OAuth account link
              await query(
                `INSERT INTO oauth_accounts 
                (user_id, provider, provider_account_id, access_token, refresh_token) 
                VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'github', profile.id, accessToken, refreshToken]
              );
            }
          }

          // Get user data
          const userResult = await query(
            'SELECT id, name, email, image, email_verified, created_at FROM users WHERE id = $1',
            [userId]
          );
          
          const user = userResult.rows[0];
          
          // Generate JWT token
          const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name
          });

          return done(null, { user, token });
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });
};

export default configurePassport; 