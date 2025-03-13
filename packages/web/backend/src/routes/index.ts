import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Import and use other route modules here
// router.use('/users', require('./users').default);

export default router; 