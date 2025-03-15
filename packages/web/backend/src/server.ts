import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDrizzle } from './config/drizzle';

export const createServer = async (): Promise<Application> => {
  const app = express();
  
  // Initialize database with Drizzle
  try {
    await initializeDrizzle();
    console.log('Drizzle ORM initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Drizzle ORM:', error);
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

  // Mount all routes under /api
  app.use('/api', routes);

  return app;
}; 