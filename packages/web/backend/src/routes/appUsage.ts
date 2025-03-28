import { Router } from 'express';
import * as appUsageController from '../controllers/appUsageController';
import { authenticate } from '../middlewares/authMiddleware';
import { RequestHandler } from 'express';

const router = Router();

// All app usage routes require authentication
router.use(authenticate);

// Routes for getting app usage statistics
router.get('/daily', appUsageController.getDailyAppUsage as RequestHandler);
router.get('/weekly', appUsageController.getWeeklyAppUsage as RequestHandler);
router.get('/monthly', appUsageController.getMonthlyAppUsage as RequestHandler);
router.get('/yearly', appUsageController.getYearlyAppUsage as RequestHandler);
router.get('/custom', appUsageController.getCustomRangeAppUsage as RequestHandler);

export default router; 