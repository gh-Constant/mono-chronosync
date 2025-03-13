import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../config/drizzle';

// Run migrations
const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations(); 