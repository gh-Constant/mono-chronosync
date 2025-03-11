import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Log database connection attempt
console.log('=== Database Connection Debug ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('SSL Enabled:', process.env.NODE_ENV === 'production');

// Database configuration
const isProduction = process.env.NODE_ENV === 'production';

// Connection configuration
const connectionConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  // For Docker internal connections, we need to disable SSL
  ssl: false
};

// Log full connection config (excluding sensitive data)
console.log('Connection Config:', {
  ...connectionConfig,
  password: '***HIDDEN***'
});

// Create a new pool instance
export const pool = new Pool(connectionConfig);

// Add error handler for connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Successfully connected to database');
});

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