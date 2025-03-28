import { Request, Response } from 'express';
import * as appUsageService from '../services/appUsageService';
import { AuthRequest } from '../interfaces/auth';
import { parseISO } from 'date-fns';

/**
 * Get app usage for the current day
 */
export async function getDailyAppUsage(req: AuthRequest, res: Response) {
  try {
    // Extract userId from the authenticated user in request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const appUsage = await appUsageService.getDailyAppUsage(userId);
    return res.status(200).json({ data: appUsage });
  } catch (error) {
    console.error('Error in getDailyAppUsage controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve daily app usage data' });
  }
}

/**
 * Get app usage for the current week
 */
export async function getWeeklyAppUsage(req: AuthRequest, res: Response) {
  try {
    // Extract userId from the authenticated user in request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const appUsage = await appUsageService.getWeeklyAppUsage(userId);
    return res.status(200).json({ data: appUsage });
  } catch (error) {
    console.error('Error in getWeeklyAppUsage controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve weekly app usage data' });
  }
}

/**
 * Get app usage for the current month
 */
export async function getMonthlyAppUsage(req: AuthRequest, res: Response) {
  try {
    // Extract userId from the authenticated user in request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const appUsage = await appUsageService.getMonthlyAppUsage(userId);
    return res.status(200).json({ data: appUsage });
  } catch (error) {
    console.error('Error in getMonthlyAppUsage controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve monthly app usage data' });
  }
}

/**
 * Get app usage for a custom time range
 */
export async function getCustomRangeAppUsage(req: AuthRequest, res: Response) {
  try {
    // Extract userId from the authenticated user in request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get start and end dates from query parameters
    const { startDate, endDate } = req.query;
    
    // Validate parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required' });
    }
    
    try {
      // Parse ISO strings to Date objects
      const parsedStartDate = parseISO(startDate as string);
      const parsedEndDate = parseISO(endDate as string);
      
      // Validate that dates are valid
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use ISO format (e.g., 2023-01-01T00:00:00Z)' });
      }
      
      // Validate that start date is before end date
      if (parsedStartDate > parsedEndDate) {
        return res.status(400).json({ error: 'startDate must be before endDate' });
      }

      const appUsage = await appUsageService.getAppUsageForTimeRange(userId, parsedStartDate, parsedEndDate);
      return res.status(200).json({ data: appUsage });
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid date format. Use ISO format (e.g., 2023-01-01T00:00:00Z)' });
    }
  } catch (error) {
    console.error('Error in getCustomRangeAppUsage controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve custom range app usage data' });
  }
} 