"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyAppUsage = getDailyAppUsage;
exports.getWeeklyAppUsage = getWeeklyAppUsage;
exports.getMonthlyAppUsage = getMonthlyAppUsage;
exports.getAppUsageForTimeRange = getAppUsageForTimeRange;
exports.getYearlyAppUsage = getYearlyAppUsage;
const date_fns_1 = require("date-fns");
const database_1 = require("../config/database");
const chalk_1 = __importDefault(require("chalk"));
/**
 * Get app usage for a specific user for the last day
 */
async function getDailyAppUsage(userId, page = 1, limit = 10) {
    console.log(chalk_1.default.blue('🔍 Getting daily app usage for user:'), chalk_1.default.yellow(userId));
    console.log(chalk_1.default.blue('📄 Pagination:'), chalk_1.default.cyan(`Page ${page}, Limit ${limit}`));
    const today = new Date();
    const startDate = (0, date_fns_1.startOfDay)(today);
    const endDate = (0, date_fns_1.endOfDay)(today);
    console.log(chalk_1.default.blue('📅 Time range:'), chalk_1.default.cyan(`${startDate} to ${endDate}`));
    return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}
/**
 * Get app usage for a specific user for the last week
 */
async function getWeeklyAppUsage(userId, page = 1, limit = 10) {
    console.log(chalk_1.default.blue('🔍 Getting weekly app usage for user:'), chalk_1.default.yellow(userId));
    console.log(chalk_1.default.blue('📄 Pagination:'), chalk_1.default.cyan(`Page ${page}, Limit ${limit}`));
    const today = new Date();
    const startDate = (0, date_fns_1.startOfWeek)(today);
    const endDate = (0, date_fns_1.endOfWeek)(today);
    console.log(chalk_1.default.blue('📅 Time range:'), chalk_1.default.cyan(`${startDate} to ${endDate}`));
    return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}
/**
 * Get app usage for a specific user for the last month
 */
async function getMonthlyAppUsage(userId, page = 1, limit = 10) {
    console.log(chalk_1.default.blue('🔍 Getting monthly app usage for user:'), chalk_1.default.yellow(userId));
    console.log(chalk_1.default.blue('📄 Pagination:'), chalk_1.default.cyan(`Page ${page}, Limit ${limit}`));
    const today = new Date();
    const startDate = (0, date_fns_1.startOfMonth)(today);
    const endDate = (0, date_fns_1.endOfMonth)(today);
    console.log(chalk_1.default.blue('📅 Time range:'), chalk_1.default.cyan(`${startDate} to ${endDate}`));
    return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}
/**
 * Get app usage for a specific user for a custom time range
 */
async function getAppUsageForTimeRange(userId, startDate, endDate, page = 1, limit = 10) {
    console.log(chalk_1.default.blue('🔍 Getting custom range app usage'));
    console.log(chalk_1.default.blue('👤 User ID:'), chalk_1.default.yellow(userId));
    console.log(chalk_1.default.blue('📅 Start Date:'), chalk_1.default.cyan(startDate));
    console.log(chalk_1.default.blue('📅 End Date:'), chalk_1.default.cyan(endDate));
    console.log(chalk_1.default.blue('📄 Pagination:'), chalk_1.default.cyan(`Page ${page}, Limit ${limit}`));
    const offset = (page - 1) * limit;
    // First, get the total count
    const countSql = `
    SELECT 
      COUNT(*) AS total
    FROM (
      SELECT 
        a.app_id
      FROM 
        app_usage_sessions aus
      JOIN 
        applications a ON aus.app_id = a.app_id
      WHERE 
        aus.user_id = $1 AND
        aus.start_time >= $2 AND
        (aus.end_time IS NULL OR aus.end_time <= $3)
      GROUP BY 
        a.app_id
    ) AS app_count
  `;
    // Then, get the paginated data
    const dataSql = `
    SELECT 
      a.app_id,
      a.app_name,
      a.package_name,
      SUM(
        EXTRACT(EPOCH FROM (
          CASE 
            WHEN aus.end_time IS NULL THEN CURRENT_TIMESTAMP
            ELSE aus.end_time
          END - aus.start_time
        ))
      )::integer AS total_duration,
      COUNT(aus.session_id) AS session_count
    FROM 
      app_usage_sessions aus
    JOIN 
      applications a ON aus.app_id = a.app_id
    WHERE 
      aus.user_id = $1 AND
      aus.start_time >= $2 AND
      (aus.end_time IS NULL OR aus.end_time <= $3)
    GROUP BY 
      a.app_id, a.app_name, a.package_name
    ORDER BY 
      total_duration DESC
    LIMIT $4 OFFSET $5
  `;
    try {
        console.log(chalk_1.default.blue('🔧 Executing count query...'));
        const countResult = await (0, database_1.query)(countSql, [
            userId,
            (0, date_fns_1.formatISO)(startDate),
            (0, date_fns_1.formatISO)(endDate),
        ]);
        const total = parseInt(countResult.rows[0]?.total || '0', 10);
        console.log(chalk_1.default.blue('📊 Total items:'), chalk_1.default.cyan(total));
        console.log(chalk_1.default.blue('🔧 Executing data query...'));
        const dataResult = await (0, database_1.query)(dataSql, [
            userId,
            (0, date_fns_1.formatISO)(startDate),
            (0, date_fns_1.formatISO)(endDate),
            limit,
            offset
        ]);
        console.log(chalk_1.default.green('✅ Query successful'));
        console.log(chalk_1.default.blue('📊 Results:'), chalk_1.default.cyan(`${dataResult.rows.length} rows returned`));
        return {
            data: dataResult.rows,
            total
        };
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Error fetching app usage data:'), error);
        throw error;
    }
}
/**
 * Get app usage data for the current year
 */
async function getYearlyAppUsage(userId, page, limit) {
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1); // January 1st
    startOfYear.setHours(0, 0, 0, 0);
    const endOfYear = new Date();
    endOfYear.setMonth(11, 31); // December 31st
    endOfYear.setHours(23, 59, 59, 999);
    return getAppUsageForTimeRange(userId, startOfYear, endOfYear, page, limit);
}
