import express, { Application } from 'express';
import routes from './routes';
import { initializeDatabase } from './config/database';

export const createServer = async (): Promise<Application> => {
  const app = express();
  
  // Initialize database
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
  
  // Basic middleware
  app.use(express.json());

  // Mount all routes under /api
  app.use('/api', routes);

  return app;
}; 