import * as fs from 'fs';
import * as path from 'path';
import pool from '../config/database';

async function initializeDatabase() {
  try {
    console.log('Reading database schema...');
    const schemaPath = path.join(__dirname, '..', 'models', 'database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Connecting to database...');
    const client = await pool.connect();

    try {
      console.log('Executing schema...');
      await client.query(schema);
      console.log('Database schema initialized successfully!');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check if we're running in production
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running database initialization in ${isProduction ? 'production' : 'development'} mode`);

initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}); 