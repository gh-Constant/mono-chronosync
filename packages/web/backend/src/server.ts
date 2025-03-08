import express, { Application } from 'express';
import router from './routes';

export const createServer = (): Application => {
  const app = express();

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use('/api', router);

  return app;
}; 