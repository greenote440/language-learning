import { Pool, PoolConfig } from 'pg';
import 'dotenv/config';

/**
 * Database connection configuration
 * Supports both DATABASE_URL and individual connection parameters
 */
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  max?: number; // Maximum number of clients in the pool
  idleTimeoutMillis?: number; // Close idle clients after this many milliseconds
  connectionTimeoutMillis?: number; // Return an error after this many milliseconds if a connection cannot be established
}

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): DatabaseConfig {
  // Prefer DATABASE_URL if provided
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      database: url.pathname.slice(1), // Remove leading '/'
      user: url.username,
      password: url.password,
      ssl: url.searchParams.get('sslmode') === 'require' || process.env.DB_SSL === 'true',
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
    };
  }

  // Fall back to individual parameters
  const config: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'adaptive_italian_audio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
  };

  // Handle SSL configuration
  if (process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production') {
    config.ssl = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };
  }

  return config;
}

/**
 * Create PostgreSQL connection pool
 */
function createPool(): Pool {
  const config = getDatabaseConfig();
  const poolConfig: PoolConfig = {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    max: config.max,
    idleTimeoutMillis: config.idleTimeoutMillis,
    connectionTimeoutMillis: config.connectionTimeoutMillis,
  };

  // Add SSL configuration if provided
  if (config.ssl !== undefined) {
    poolConfig.ssl = config.ssl;
  }

  return new Pool(poolConfig);
}

// Create and export the connection pool
export const pool = createPool();

/**
 * Connection retry configuration
 */
const RETRY_CONFIG = {
  maxAttempts: parseInt(process.env.DB_RETRY_MAX_ATTEMPTS || '5', 10),
  initialDelay: parseInt(process.env.DB_RETRY_INITIAL_DELAY || '1000', 10), // milliseconds
  maxDelay: parseInt(process.env.DB_RETRY_MAX_DELAY || '30000', 10), // milliseconds
  backoffMultiplier: parseFloat(process.env.DB_RETRY_BACKOFF_MULTIPLIER || '2'),
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number): number {
  const delay = RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
}

/**
 * Test database connection with retry logic
 */
export async function testConnection(): Promise<boolean> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      if (attempt > 0) {
        console.log(`Database connection successful after ${attempt + 1} attempt(s)`);
      }
      return true;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isLastAttempt = attempt === RETRY_CONFIG.maxAttempts - 1;

      if (isLastAttempt) {
        console.error(`Database connection failed after ${RETRY_CONFIG.maxAttempts} attempts:`, lastError);
        return false;
      }

      const delay = calculateBackoffDelay(attempt);
      console.warn(
        `Database connection attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
        lastError.message
      );
      await sleep(delay);
    }
  }

  return false;
}

/**
 * Execute query with retry logic
 */
export async function queryWithRetry(
  text: string,
  params?: unknown[]
): Promise<{ rows: unknown[]; rowCount: number }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      const result = await pool.query(text, params);
      return { rows: result.rows, rowCount: result.rowCount || 0 };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isLastAttempt = attempt === RETRY_CONFIG.maxAttempts - 1;

      // Don't retry on certain errors (e.g., syntax errors, constraint violations)
      if (
        lastError.message.includes('syntax error') ||
        lastError.message.includes('violates') ||
        lastError.message.includes('duplicate key')
      ) {
        throw lastError;
      }

      if (isLastAttempt) {
        console.error(`Query failed after ${RETRY_CONFIG.maxAttempts} attempts:`, lastError);
        throw lastError;
      }

      const delay = calculateBackoffDelay(attempt);
      console.warn(`Query attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, lastError.message);
      await sleep(delay);
    }
  }

  throw lastError || new Error('Query execution failed');
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
