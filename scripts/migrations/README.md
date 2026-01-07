# Database Migrations

This directory contains SQL migration files for database schema management.

## Migration System

The migration system uses a simple SQL-based approach with version tracking in the database.

### Migration File Naming

Migration files follow this naming pattern:
```
{version}_{description}.sql
```

Example:
- `001_initial_schema.sql`
- `002_add_user_indexes.sql`

### Migration Tracking

Migrations are tracked in the `schema_migrations` table in the database:
- `version` - Migration version number (integer)
- `name` - Migration file name
- `applied_at` - Timestamp when migration was applied

### Running Migrations

Use the migration runner script:
```bash
# Run all pending migrations
pnpm --filter @adaptive-italian-audio/api run migrate

# Run migrations up to specific version
pnpm --filter @adaptive-italian-audio/api run migrate:up --version=001

# Rollback last migration (development only)
pnpm --filter @adaptive-italian-audio/api run migrate:down
```

### Creating a New Migration

1. Create a new SQL file in `scripts/migrations/` with the next version number
2. Write your SQL statements (CREATE TABLE, ALTER TABLE, etc.)
3. Test the migration on a development database
4. Commit the migration file to version control

### Migration Best Practices

- **Idempotency**: Migrations should be idempotent when possible (use IF NOT EXISTS, etc.)
- **Rollback**: Consider rollback scenarios (though rollback is not always possible)
- **Testing**: Always test migrations on a copy of production data before applying
- **Ordering**: Migrations are applied in version order (001, 002, 003, etc.)
