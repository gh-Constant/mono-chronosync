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

/**
 * Get app usage for a specific user for the last day
 */
export async function getDailyAppUsage(userId: number): Promise<AppUsage[]> {
  console.log(chalk.blue('🔍 Getting daily app usage for user:'), chalk.yellow(userId));
  const today = new Date();
  const startDate = startOfDay(today);
  const endDate = endOfDay(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate);
}

/**
 * Get app usage for a specific user for the last week
 */
export async function getWeeklyAppUsage(userId: number): Promise<AppUsage[]> {
  console.log(chalk.blue('🔍 Getting weekly app usage for user:'), chalk.yellow(userId));
  const today = new Date();
  const startDate = startOfWeek(today);
  const endDate = endOfWeek(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate);
}

/**
 * Get app usage for a specific user for the last month
 */
export async function getMonthlyAppUsage(userId: number): Promise<AppUsage[]> {
  console.log(chalk.blue('🔍 Getting monthly app usage for user:'), chalk.yellow(userId));
  const today = new Date();
  const startDate = startOfMonth(today);
  const endDate = endOfMonth(today);
  
  console.log(chalk.blue('📅 Time range:'), chalk.cyan(`${startDate} to ${endDate}`));
  return getAppUsageForTimeRange(userId, startDate, endDate);
}

/**
 * Get app usage for a specific user for a custom time range
 */
export async function getAppUsageForTimeRange(
  userId: number, 
  startDate: Date, 
  endDate: Date
): Promise<AppUsage[]> {
  console.log(chalk.blue('🔍 Getting custom range app usage'));
  console.log(chalk.blue('👤 User ID:'), chalk.yellow(userId));
  console.log(chalk.blue('📅 Start Date:'), chalk.cyan(startDate));
  console.log(chalk.blue('📅 End Date:'), chalk.cyan(endDate));

  const sql = `
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
  `;

  try {
    console.log(chalk.blue('🔧 Executing SQL query...'));
    const result = await query(sql, [
      userId,
      formatISO(startDate),
      formatISO(endDate),
    ]);
    
    console.log(chalk.green('✅ Query successful'));
    console.log(chalk.blue('📊 Results:'), chalk.cyan(`${result.rows.length} rows returned`));
    return result.rows;
  } catch (error) {
    console.error(chalk.red('❌ Error fetching app usage data:'), error);
    throw error;
  }
} 