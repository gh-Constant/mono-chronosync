import { formatISO, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { query } from '../config/database';
import chalk from 'chalk';

interface AppUsage {
  app_id: number;
  app_name: string;
  package_name: string;
  total_duration: number; // duration in seconds
  session_count: number;
}

interface PaginatedAppUsage {
  data: AppUsage[];
  total: number;
}

/**
 * Get app usage for a specific user for the last day
 */
export async function getDailyAppUsage(
  userId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedAppUsage> {
  console.log(chalk.blue('🔍 Getting daily app usage for user:'), chalk.yellow(userId));
  console.log(chalk.blue('📄 Pagination:'), chalk.cyan(`Page ${page}, Limit ${limit}`));
  
  const today = new Date();
  const startDate = startOfDay(today);
  const endDate = endOfDay(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}

/**
 * Get app usage for a specific user for the last week
 */
export async function getWeeklyAppUsage(
  userId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedAppUsage> {
  console.log(chalk.blue('🔍 Getting weekly app usage for user:'), chalk.yellow(userId));
  console.log(chalk.blue('📄 Pagination:'), chalk.cyan(`Page ${page}, Limit ${limit}`));
  
  const today = new Date();
  const startDate = startOfWeek(today);
  const endDate = endOfWeek(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}

/**
 * Get app usage for a specific user for the last month
 */
export async function getMonthlyAppUsage(
  userId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedAppUsage> {
  console.log(chalk.blue('🔍 Getting monthly app usage for user:'), chalk.yellow(userId));
  console.log(chalk.blue('📄 Pagination:'), chalk.cyan(`Page ${page}, Limit ${limit}`));
  
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate, page, limit);
}

/**
 * Get app usage for a specific user for a custom time range
 */
export async function getAppUsageForTimeRange(
  userId: number, 
  startDate: Date, 
  endDate: Date,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedAppUsage> {
  console.log(chalk.blue('🔍 Getting custom range app usage'));
  console.log(chalk.blue('👤 User ID:'), chalk.yellow(userId));
  console.log(chalk.blue('📅 Start Date:'), chalk.cyan(startDate));
  console.log(chalk.blue('📅 End Date:'), chalk.cyan(endDate));
  console.log(chalk.blue('📄 Pagination:'), chalk.cyan(`Page ${page}, Limit ${limit}`));

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
    console.log(chalk.blue('🔧 Executing count query...'));
    const countResult = await query(countSql, [
      userId,
      formatISO(startDate),
      formatISO(endDate),
    ]);
    
    const total = parseInt(countResult.rows[0]?.total || '0', 10);
    console.log(chalk.blue('📊 Total items:'), chalk.cyan(total));
    
    console.log(chalk.blue('🔧 Executing data query...'));
    const dataResult = await query(dataSql, [
      userId,
      formatISO(startDate),
      formatISO(endDate),
      limit,
      offset
    ]);
    
    console.log(chalk.green('✅ Query successful'));
    console.log(chalk.blue('📊 Results:'), chalk.cyan(`${dataResult.rows.length} rows returned`));
    
    return {
      data: dataResult.rows,
      total
    };
  } catch (error) {
    console.error(chalk.red('❌ Error fetching app usage data:'), error);
    throw error;
  }
}

/**
 * Get app usage data for the current year
 */
export async function getYearlyAppUsage(userId: number, page: number, limit: number) {
  const startOfYear = new Date();
  startOfYear.setMonth(0, 1); // January 1st
  startOfYear.setHours(0, 0, 0, 0);

  const endOfYear = new Date();
  endOfYear.setMonth(11, 31); // December 31st
  endOfYear.setHours(23, 59, 59, 999);

  return getAppUsageForTimeRange(userId, startOfYear, endOfYear, page, limit);
} 