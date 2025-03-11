import express, { Application } from 'express';
import routes from './routes';

export const createServer = (): Application => {
  const app = express();
  
  // Basic middleware
  app.use(express.json());

  // Mount all routes under /api
  app.use('/api', routes);

  return app;
}; 