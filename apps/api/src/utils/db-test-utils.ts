import { pool } from '../config/database.js';

/**
 * Test utilities for database connection and schema validation
 */

/**
 * Verify all required tables exist
 */
export async function verifyTablesExist(): Promise<{
  exists: boolean;
  missing: string[];
  existing: string[];
}> {
  const requiredTables = [
    'content',
    'sessions',
    'behavioral_events',
    'like_engagement',
    'learner_model_state',
    'user_preferences',
    'generation_status',
    'schema_migrations',
  ];

  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    const existingTables = result.rows.map((row) => row.table_name);
    const missing = requiredTables.filter((table) => !existingTables.includes(table));
    const existing = requiredTables.filter((table) => existingTables.includes(table));

    return {
      exists: missing.length === 0,
      missing,
      existing,
    };
  } catch (error) {
    console.error('Error verifying tables:', error);
    throw error;
  }
}

/**
 * Verify all required indexes exist
 */
export async function verifyIndexesExist(): Promise<{
  exists: boolean;
  missing: string[];
  existing: string[];
}> {
  const requiredIndexes = [
    'idx_content_session_id',
    'idx_content_format',
    'idx_content_genre',
    'idx_content_difficulty',
    'idx_content_generated_at',
    'idx_sessions_started_at',
    'idx_sessions_last_activity',
    'idx_behavioral_events_content_id',
    'idx_behavioral_events_session_id',
    'idx_behavioral_events_event_type',
    'idx_behavioral_events_timestamp',
    'idx_like_engagement_session_id',
    'idx_like_engagement_liked',
    'idx_learner_model_state_last_updated',
    'idx_user_preferences_session_id',
    'idx_generation_status_session_id',
    'idx_generation_status_status',
    'idx_generation_status_started_at',
  ];

  try {
    const result = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);

    const existingIndexes = result.rows.map((row) => row.indexname);
    const missing = requiredIndexes.filter((index) => !existingIndexes.includes(index));
    const existing = requiredIndexes.filter((index) => existingIndexes.includes(index));

    return {
      exists: missing.length === 0,
      missing,
      existing,
    };
  } catch (error) {
    console.error('Error verifying indexes:', error);
    throw error;
  }
}

/**
 * Verify foreign key constraints exist
 */
export async function verifyForeignKeysExist(): Promise<{
  exists: boolean;
  missing: string[];
  existing: string[];
}> {
  const requiredForeignKeys = [
    'fk_behavioral_events_content',
    'fk_behavioral_events_session',
    'fk_like_engagement_content',
    'fk_like_engagement_session',
    'fk_learner_model_state_session',
    'fk_generation_status_session',
    'fk_generation_status_content',
  ];

  try {
    const result = await pool.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE contype = 'f' 
      AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `);

    const existingForeignKeys = result.rows.map((row) => row.conname);
    const missing = requiredForeignKeys.filter((fk) => !existingForeignKeys.includes(fk));
    const existing = requiredForeignKeys.filter((fk) => existingForeignKeys.includes(fk));

    return {
      exists: missing.length === 0,
      missing,
      existing,
    };
  } catch (error) {
    console.error('Error verifying foreign keys:', error);
    throw error;
  }
}

/**
 * Test basic CRUD operations on each table
 */
export async function testCRUDOperations(): Promise<{
  success: boolean;
  results: Record<string, { insert: boolean; select: boolean; delete: boolean }>;
}> {
  const results: Record<string, { insert: boolean; select: boolean; delete: boolean }> = {};
  const testSessionId = `test_session_${Date.now()}`;
  const testContentId = `test_content_${Date.now()}`;

  try {
    // Test sessions table
    try {
      await pool.query(
        'INSERT INTO sessions (id, content_ids) VALUES ($1, $2)',
        [testSessionId, []]
      );
      results.sessions = { insert: true, select: false, delete: false };

      const selectResult = await pool.query('SELECT * FROM sessions WHERE id = $1', [testSessionId]);
      results.sessions.select = selectResult.rows.length > 0;

      await pool.query('DELETE FROM sessions WHERE id = $1', [testSessionId]);
      results.sessions.delete = true;
    } catch (error) {
      results.sessions = { insert: false, select: false, delete: false };
    }

    // Test content table (requires session)
    try {
      await pool.query(
        'INSERT INTO sessions (id, content_ids) VALUES ($1, $2)',
        [testSessionId, []]
      );

      await pool.query(
        `INSERT INTO content (id, title, text_content, audio_url, format, difficulty, duration, model_parameters, session_id, template_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          testContentId,
          'Test Content',
          'Test text content',
          'https://example.com/audio.mp3',
          'narrative',
          'lexical-heavy',
          100,
          JSON.stringify({ test: true }),
          testSessionId,
          'test_template',
        ]
      );
      results.content = { insert: true, select: false, delete: false };

      const selectResult = await pool.query('SELECT * FROM content WHERE id = $1', [testContentId]);
      results.content.select = selectResult.rows.length > 0;

      await pool.query('DELETE FROM content WHERE id = $1', [testContentId]);
      await pool.query('DELETE FROM sessions WHERE id = $1', [testSessionId]);
      results.content.delete = true;
    } catch (error) {
      results.content = { insert: false, select: false, delete: false };
      // Cleanup
      try {
        await pool.query('DELETE FROM sessions WHERE id = $1', [testSessionId]);
      } catch {
        // Ignore cleanup errors
      }
    }

    const success = Object.values(results).every(
      (result) => result.insert && result.select && result.delete
    );

    return { success, results };
  } catch (error) {
    console.error('Error testing CRUD operations:', error);
    throw error;
  }
}

/**
 * Test foreign key constraints
 */
export async function testForeignKeyConstraints(): Promise<{
  success: boolean;
  cascadingDelete: boolean;
  constraintViolation: boolean;
}> {
  const testSessionId = `test_session_fk_${Date.now()}`;
  const testContentId = `test_content_fk_${Date.now()}`;

  try {
    // Create test data
    await pool.query('INSERT INTO sessions (id, content_ids) VALUES ($1, $2)', [testSessionId, []]);
    await pool.query(
      `INSERT INTO content (id, title, text_content, audio_url, format, difficulty, duration, model_parameters, session_id, template_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        testContentId,
        'Test Content',
        'Test text',
        'https://example.com/audio.mp3',
        'narrative',
        'lexical-heavy',
        100,
        JSON.stringify({}),
        testSessionId,
        'test_template',
      ]
    );

    // Test cascading delete
    await pool.query('DELETE FROM sessions WHERE id = $1', [testSessionId]);
    const contentCheck = await pool.query('SELECT * FROM content WHERE id = $1', [testContentId]);
    const cascadingDelete = contentCheck.rows.length === 0;

    // Test constraint violation (try to insert behavioral_event with invalid content_id)
    let constraintViolation = false;
    try {
      await pool.query(
        `INSERT INTO behavioral_events (id, content_id, event_type, playback_position, session_id, content_characteristics)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['test_event', 'invalid_content_id', 'play', 0, testSessionId, JSON.stringify({})]
      );
    } catch (error) {
      // Expected to fail due to foreign key constraint
      constraintViolation = true;
    }

    return {
      success: cascadingDelete && constraintViolation,
      cascadingDelete,
      constraintViolation,
    };
  } catch (error) {
    console.error('Error testing foreign key constraints:', error);
    throw error;
  }
}

/**
 * Run all database tests
 */
export async function runAllTests(): Promise<{
  tables: ReturnType<typeof verifyTablesExist> extends Promise<infer T> ? T : never;
  indexes: ReturnType<typeof verifyIndexesExist> extends Promise<infer T> ? T : never;
  foreignKeys: ReturnType<typeof verifyForeignKeysExist> extends Promise<infer T> ? T : never;
  crud: Awaited<ReturnType<typeof testCRUDOperations>>;
  constraints: Awaited<ReturnType<typeof testForeignKeyConstraints>>;
}> {
  const tables = await verifyTablesExist();
  const indexes = await verifyIndexesExist();
  const foreignKeys = await verifyForeignKeysExist();
  const crud = await testCRUDOperations();
  const constraints = await testForeignKeyConstraints();

  return {
    tables,
    indexes,
    foreignKeys,
    crud,
    constraints,
  };
}
