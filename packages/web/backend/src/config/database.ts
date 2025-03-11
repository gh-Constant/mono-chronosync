import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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
export const connectionConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

// Log connection details (without sensitive info)
console.log(`Connecting to database at ${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`);

// Create a new pool instance
const pool = new Pool(connectionConfig);

// Initialize database function
export const initializeDatabase = async () => {
  try {
    console.log('Reading database schema...');
    const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await pool.query(schema);
    console.log('Database schema initialized successfully!');
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Export the pool for use in other modules
export default pool;

// Helper function to execute queries
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
}; 