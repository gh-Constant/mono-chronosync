"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyAppUsage = getDailyAppUsage;
exports.getWeeklyAppUsage = getWeeklyAppUsage;
exports.getMonthlyAppUsage = getMonthlyAppUsage;
exports.getYearlyAppUsage = getYearlyAppUsage;
exports.getCustomRangeAppUsage = getCustomRangeAppUsage;
const appUsageService = __importStar(require("../services/appUsageService"));
const date_fns_1 = require("date-fns");
/**
 * Get app usage for the current day
 */
async function getDailyAppUsage(req, res) {
    try {
        // Extract userId from the authenticated user in request
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100'
            });
        }
        const { data, total } = await appUsageService.getDailyAppUsage(userId, page, limit);
        return res.status(200).json({ data, total, page, limit });
    }
    catch (error) {
        console.error('Error in getDailyAppUsage controller:', error);
        return res.status(500).json({ error: 'Failed to retrieve daily app usage data' });
    }
}
/**
 * Get app usage for the current week
 */
async function getWeeklyAppUsage(req, res) {
    try {
        // Extract userId from the authenticated user in request
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100'
            });
        }
        const { data, total } = await appUsageService.getWeeklyAppUsage(userId, page, limit);
        return res.status(200).json({ data, total, page, limit });
    }
    catch (error) {
        console.error('Error in getWeeklyAppUsage controller:', error);
        return res.status(500).json({ error: 'Failed to retrieve weekly app usage data' });
    }
}
/**
 * Get app usage for the current month
 */
async function getMonthlyAppUsage(req, res) {
    try {
        // Extract userId from the authenticated user in request
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100'
            });
        }
        const { data, total } = await appUsageService.getMonthlyAppUsage(userId, page, limit);
        return res.status(200).json({ data, total, page, limit });
    }
    catch (error) {
        console.error('Error in getMonthlyAppUsage controller:', error);
        return res.status(500).json({ error: 'Failed to retrieve monthly app usage data' });
    }
}
/**
 * Get app usage for the current year
 */
async function getYearlyAppUsage(req, res) {
    try {
        // Extract userId from the authenticated user in request
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100'
            });
        }
        const { data, total } = await appUsageService.getYearlyAppUsage(Number(userId), page, limit);
        return res.status(200).json({ data, total, page, limit });
    }
    catch (error) {
        console.error('Error in getYearlyAppUsage controller:', error);
        return res.status(500).json({ error: 'Failed to retrieve yearly app usage data' });
    }
}
/**
 * Get app usage for a custom time range
 */
async function getCustomRangeAppUsage(req, res) {
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
        // Extract pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100'
            });
        }
        try {
            // Parse ISO strings to Date objects
            const parsedStartDate = (0, date_fns_1.parseISO)(startDate);
            const parsedEndDate = (0, date_fns_1.parseISO)(endDate);
            // Validate that dates are valid
            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format. Use ISO format (e.g., 2023-01-01T00:00:00Z)' });
            }
            // Validate that start date is before end date
            if (parsedStartDate > parsedEndDate) {
                return res.status(400).json({ error: 'startDate must be before endDate' });
            }
            const { data, total } = await appUsageService.getAppUsageForTimeRange(userId, parsedStartDate, parsedEndDate, page, limit);
            return res.status(200).json({ data, total, page, limit });
        }
        catch (parseError) {
            return res.status(400).json({ error: 'Invalid date format. Use ISO format (e.g., 2023-01-01T00:00:00Z)' });
        }
    }
    catch (error) {
        console.error('Error in getCustomRangeAppUsage controller:', error);
        return res.status(500).json({ error: 'Failed to retrieve custom range app usage data' });
    }
}
