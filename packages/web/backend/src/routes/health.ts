import pool from '../config/database';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/database', async (req: Request, res: Response) => {
  const timeout = setTimeout(() => {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database query timeout after 5 seconds',
      timestamp: new Date().toISOString()
    });
  }, 5000);

  try {
    // Test basic connection first
    const client = await pool.connect();
    
    try {
      const [devicesResult, usersResult, applicationsResult] = await Promise.all([
        client.query('SELECT COUNT(*) FROM devices'),
        client.query('SELECT COUNT(*) FROM users'),
        client.query('SELECT COUNT(*) FROM applications')
      ]);

      clearTimeout(timeout);
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connection: {
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT
        },
        counts: {
          devices: parseInt(devicesResult.rows[0].count),
          users: parseInt(usersResult.rows[0].count),
          applications: parseInt(applicationsResult.rows[0].count)
        },
        message: 'Successfully connected to database and queried tables'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    clearTimeout(timeout);
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',  
      error: error instanceof Error ? error.message : 'Unknown error',
      connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      },
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 