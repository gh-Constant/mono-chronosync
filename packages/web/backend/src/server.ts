import express, { Application } from 'express';
import cors from 'cors';
import passport from 'passport';
import routes from './routes';
import { initializeDatabase } from './config/database';
import { configurePassport } from './config/passport';

export const createServer = async (): Promise<Application> => {
  const app = express();
  
  // Initialize database 
  try {
    await initializeDatabase();
    console.log('PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL database:', error);
    process.exit(1);
  }
  
  // CORS middleware with more robust configuration
  app.use(cors({
    origin: [
      'http://localhost:4173',
      'http://localhost:5173',
      'https://chronosync.constantsuchet.fr',
      'https://api.chronosync.constantsuchet.fr'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }));
  
  // Add preflight handling for OPTIONS requests
  app.options('*', cors());
  
  // Basic middleware
  app.use(express.json());

  // Initialize and configure Passport
  app.use(passport.initialize());
  configurePassport();

  // Mount all routes under /api
  app.use('/api', routes);

  return app;
}; 