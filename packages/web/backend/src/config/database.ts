import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Log database connection attempt
console.log('=== PostgreSQL Database Connection Debug ===');
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

// Create pool based on environment
const pool = isProduction 
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: false })
  : new Pool(connectionConfig);

// Initialize database function
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('Testing database connection...');
    
    // Simple query to verify connection
    await client.query('SELECT NOW()');
    console.log('Database connection successful');
    
    // Check if we need to initialize the schema
    console.log('Checking if tables exist...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Tables do not exist, initializing schema from SQL file...');
      
      // If tables don't exist, run the initialization SQL script
      const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
      
      // Check if schema file exists
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found at: ${schemaPath}`);
      }
      
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
      console.log('Database schema initialized successfully!');
    } else {
      console.log('Database schema already exists');
    }
    
    console.log('PostgreSQL setup complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  } finally {
    client.release();
  }
};

// Helper function to execute queries
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Add error handler for connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Export pool for direct access if needed
export default pool; 