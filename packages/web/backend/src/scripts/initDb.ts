import { UserModel } from '../models/User';

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Initialize users table
    await UserModel.initTable();
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 