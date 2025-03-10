import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Log database connection attempt
console.log('Initializing database connection...');
console.log(`Environment: ${process.env.NODE_ENV}`);

// Database configuration
const isProduction = process.env.NODE_ENV === 'production';

// Connection configuration
const connectionConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'chronosync',
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

// Log connection details (without sensitive info)
console.log(`Connecting to database at ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`);

// Create a new pool instance
const pool = new Pool(connectionConfig);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Successfully connected to the database');
  client?.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query:', err.message);
      return;
    }
    console.log('Database time:', result.rows[0].now);
  });
});

// Export the pool for use in other modules
export default pool;

// Helper function to execute queries
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
}; 