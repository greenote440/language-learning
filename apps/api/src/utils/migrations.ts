import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get migration files directory path
 */
function getMigrationsDir(): string {
  // Path from apps/api/src/utils to scripts/migrations
  return join(__dirname, '../../../scripts/migrations');
}

/**
 * Parse migration version from filename
 * Format: {version}_{description}.sql
 */
function parseMigrationVersion(filename: string): number | null {
  const match = filename.match(/^(\d+)_/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Get all migration files sorted by version
 */
async function getMigrationFiles(): Promise<Array<{ version: number; filename: string }>> {
  const migrationsDir = getMigrationsDir();
  const files = await readdir(migrationsDir);
  
  const migrations = files
    .filter((file) => file.endsWith('.sql') && file !== 'README.md')
    .map((file) => ({
      version: parseMigrationVersion(file),
      filename: file,
    }))
    .filter((migration) => migration.version !== null) as Array<{ version: number; filename: string }>;

  return migrations.sort((a, b) => a.version - b.version);
}

/**
 * Get applied migrations from database
 */
async function getAppliedMigrations(): Promise<Set<number>> {
  try {
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    const result = await pool.query('SELECT version FROM schema_migrations ORDER BY version');
    return new Set(result.rows.map((row) => row.version));
  } catch (error) {
    console.error('Error getting applied migrations:', error);
    throw error;
  }
}

/**
 * Read migration file content
 */
async function readMigrationFile(filename: string): Promise<string> {
  const migrationsDir = getMigrationsDir();
  const filePath = join(migrationsDir, filename);
  return readFile(filePath, 'utf-8');
}

/**
 * Apply a single migration
 */
async function applyMigration(version: number, filename: string): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Read and execute migration SQL
    const sql = await readMigrationFile(filename);
    await client.query(sql);
    
    // Record migration in tracking table
    await client.query(
      'INSERT INTO schema_migrations (version, name) VALUES ($1, $2) ON CONFLICT (version) DO NOTHING',
      [version, filename]
    );
    
    await client.query('COMMIT');
    console.log(`✓ Applied migration ${version}: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`✗ Failed to apply migration ${version}: ${filename}`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  console.log('Starting database migrations...');
  
  try {
    const migrationFiles = await getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations();
    
    const pendingMigrations = migrationFiles.filter(
      (migration) => !appliedMigrations.has(migration.version)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations.');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migration(s)`);
    
    for (const migration of pendingMigrations) {
      await applyMigration(migration.version, migration.filename);
    }
    
    console.log('All migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<{
  applied: number[];
  pending: Array<{ version: number; filename: string }>;
}> {
  const migrationFiles = await getMigrationFiles();
  const appliedMigrations = await getAppliedMigrations();
  
  const applied = Array.from(appliedMigrations).sort((a, b) => a - b);
  const pending = migrationFiles.filter(
    (migration) => !appliedMigrations.has(migration.version)
  );
  
  return { applied, pending };
}
