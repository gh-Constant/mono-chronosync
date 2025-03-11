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
  try {
    const [devicesResult, usersResult, applicationsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM devices'),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM applications')
    ]);

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      counts: {
        devices: parseInt(devicesResult.rows[0].count),
        users: parseInt(usersResult.rows[0].count),
        applications: parseInt(applicationsResult.rows[0].count)
      },
      message: 'Successfully connected to database and queried tables'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',  
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 