# Database Setup & Initialization


**CRITICAL:** Database setup and initialization must be completed before any database operations in Epic 1.

## Database Initialization Requirements

**PostgreSQL Database Setup (Epic 1 - Must Complete Before Content Generation):**

1. **Database Provisioning:**
   - Provision PostgreSQL database instance on Railway (or alternative platform)
   - Configure database connection settings
   - Note database host, port, database name, username, and password
   - Store connection credentials securely for environment variable configuration

2. **Connection Configuration:**
   - Configure database connection in backend application
   - Set environment variables: `DATABASE_URL` or individual connection parameters
   - Implement connection pooling for efficient database access
   - Add connection retry logic for reliability

3. **Schema Deployment:**
   - Execute schema creation SQL (defined in Database Schema section)
   - Create all required tables: content, sessions, behavioral_events, like_engagement, learner_model_state, user_preferences, generation_status
   - Create all required indexes for query optimization
   - Create foreign key constraints for referential integrity
   - Verify schema deployment success

4. **Connection Testing:**
   - Implement database connection health check endpoint
   - Verify all tables are accessible
   - Test basic CRUD operations on each table
   - Verify foreign key constraints are working

**Migration Strategy:**
- Use SQL migration files for schema management
- Track migration versions in database
- Support rollback capabilities for development
- Document migration process for reproducibility

**Implementation Location:**
- Database setup story: Epic 1 (before any content generation that requires database)
- Connection configuration: `apps/api/src/config/database.ts`
- Migration scripts: `scripts/migrations/`
- Schema SQL: See Database Schema section below

**Dependencies:**
- Must complete before: Content generation that stores metadata, session management, behavioral tracking
- Required for: All database operations in Epic 1 and beyond

**Rationale:**
Database must be initialized and schema deployed before any backend services can store or retrieve data. This is a critical dependency for content metadata storage, session management, and behavioral tracking.

---

