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
  ssl: false
};

// Log full connection config (excluding sensitive data)
console.log('Connection Config:', {
  ...connectionConfig,
  password: '***HIDDEN***'
});

// Create a new pool instance
const pool = new Pool(connectionConfig);

// Initialize database function
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Check if tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'applications'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Initializing database schema...');
      const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
      console.log('Database schema initialized successfully!');
    } else {
      console.log('Database schema already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Add error handler for connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', async (client) => {
  console.log('Connected to database, checking initialization...');
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

export default pool;