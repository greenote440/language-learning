import { runMigrations, getMigrationStatus } from '../utils/migrations.js';
import { testConnection } from '../config/database.js';

async function main() {
  console.log('Database Migration Runner\n');

  // Test database connection first
  console.log('Testing database connection...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.error('✗ Database connection failed. Please check your database configuration.');
    process.exit(1);
  }
  
  console.log('✓ Database connection successful\n');

  // Show migration status
  const status = await getMigrationStatus();
  console.log(`Applied migrations: ${status.applied.length}`);
  console.log(`Pending migrations: ${status.pending.length}\n`);

  if (status.pending.length > 0) {
    console.log('Pending migrations:');
    status.pending.forEach((migration) => {
      console.log(`  - ${migration.version}: ${migration.filename}`);
    });
    console.log('');
  }

  // Run migrations
  try {
    await runMigrations();
    console.log('\n✓ Migration process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration process failed');
    console.error(error);
    process.exit(1);
  }
}

main();
