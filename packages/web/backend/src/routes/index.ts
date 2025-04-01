import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import appUsageRoutes from './appUsage';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/app-usage', appUsageRoutes);

// Import and use other route modules here
// router.use('/users', require('./users').default);

export default router; 