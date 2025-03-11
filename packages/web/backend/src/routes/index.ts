import { Router } from 'express';
import healthRoutes from './health';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);

// Import and use other route modules here
// router.use('/auth', require('./auth').default);
// router.use('/users', require('./users').default);

export default router; 