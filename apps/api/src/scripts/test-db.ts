import { testConnection } from '../config/database.js';
import { runAllTests } from '../utils/db-test-utils.js';

async function main() {
  console.log('Database Connection and Schema Testing\n');
  console.log('='.repeat(50));

  // Test connection
  console.log('\n1. Testing database connection...');
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('✗ Database connection failed');
    process.exit(1);
  }
  console.log('✓ Database connection successful');

  // Run all tests
  console.log('\n2. Running schema validation tests...');
  try {
    const results = await runAllTests();

    // Tables
    console.log('\n3. Verifying tables...');
    if (results.tables.exists) {
      console.log(`✓ All ${results.tables.existing.length} required tables exist`);
    } else {
      console.error(`✗ Missing tables: ${results.tables.missing.join(', ')}`);
    }

    // Indexes
    console.log('\n4. Verifying indexes...');
    if (results.indexes.exists) {
      console.log(`✓ All ${results.indexes.existing.length} required indexes exist`);
    } else {
      console.error(`✗ Missing indexes: ${results.indexes.missing.join(', ')}`);
    }

    // Foreign keys
    console.log('\n5. Verifying foreign keys...');
    if (results.foreignKeys.exists) {
      console.log(`✓ All ${results.foreignKeys.existing.length} required foreign keys exist`);
    } else {
      console.error(`✗ Missing foreign keys: ${results.foreignKeys.missing.join(', ')}`);
    }

    // CRUD operations
    console.log('\n6. Testing CRUD operations...');
    if (results.crud.success) {
      console.log('✓ All CRUD operations successful');
      Object.entries(results.crud.results).forEach(([table, ops]) => {
        console.log(`  - ${table}: insert=${ops.insert}, select=${ops.select}, delete=${ops.delete}`);
      });
    } else {
      console.error('✗ Some CRUD operations failed');
      Object.entries(results.crud.results).forEach(([table, ops]) => {
        if (!ops.insert || !ops.select || !ops.delete) {
          console.error(`  - ${table}: insert=${ops.insert}, select=${ops.select}, delete=${ops.delete}`);
        }
      });
    }

    // Foreign key constraints
    console.log('\n7. Testing foreign key constraints...');
    if (results.constraints.success) {
      console.log('✓ Foreign key constraints working correctly');
      console.log(`  - Cascading delete: ${results.constraints.cascadingDelete}`);
      console.log(`  - Constraint violation: ${results.constraints.constraintViolation}`);
    } else {
      console.error('✗ Foreign key constraint tests failed');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    const allPassed =
      results.tables.exists &&
      results.indexes.exists &&
      results.foreignKeys.exists &&
      results.crud.success &&
      results.constraints.success;

    if (allPassed) {
      console.log('\n✓ All tests passed!');
      process.exit(0);
    } else {
      console.error('\n✗ Some tests failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n✗ Test execution failed:', error);
    process.exit(1);
  }
}

main();
