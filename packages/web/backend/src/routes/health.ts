import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

router.get('/database', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM applications');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      applicationCount: parseInt(result.rows[0].count),
      message: 'Successfully connected to database and queried applications table'
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