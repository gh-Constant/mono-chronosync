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
    origin: function(origin, callback) {
      const allowedOrigins = [
        'http://localhost:4173',
        'http://localhost:5173',
        'https://chronosync.constantsuchet.fr'
      ];
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Origin ${origin} not allowed by CORS`);
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 hours
  }));
  
  // Ensure OPTIONS requests are handled properly
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