import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Import and use other route modules here
// router.use('/auth', require('./auth').default);
// router.use('/users', require('./users').default);

export default router; 