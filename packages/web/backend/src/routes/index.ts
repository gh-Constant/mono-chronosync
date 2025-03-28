import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import appUsageRoutes from './appUsage';
import rgpdRoutes from './rgpd';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/app-usage', appUsageRoutes);
router.use('/rgpd', rgpdRoutes);

// Import and use other route modules here
// router.use('/users', require('./users').default);

export default router; 