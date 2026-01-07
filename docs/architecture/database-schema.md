# Database Schema


PostgreSQL database schema definitions for structured data storage. Content metadata, user preferences, behavioral tracking, and model state persistence.

## Schema Design

```sql
-- Content table: Stores generated Italian audio content metadata
CREATE TABLE content (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    text_content TEXT NOT NULL,
    audio_url VARCHAR(1000) NOT NULL,
    audio_format VARCHAR(10) DEFAULT 'mp3',
    audio_bitrate INTEGER,
    audio_size BIGINT,
    format VARCHAR(50) NOT NULL CHECK (format IN ('narrative', 'podcast', 'educational')),
    genre VARCHAR(100),
    sub_genre VARCHAR(100),
    topic VARCHAR(200),
    template_id VARCHAR(255) NOT NULL,
    template_version VARCHAR(50),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('lexical-heavy', 'discourse-heavy')),
    difficulty_score DECIMAL(3,2),
    estimated_comprehension_level VARCHAR(50),
    duration INTEGER NOT NULL,
    word_count INTEGER,
    model_parameters JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    generated_by VARCHAR(255),
    session_id VARCHAR(255) NOT NULL,
    episode_number INTEGER,
    series_id VARCHAR(255),
    continuity_context TEXT,
    related_content_ids TEXT[], -- Array of content IDs
    language VARCHAR(10) DEFAULT 'it',
    locale VARCHAR(10),
    quality_score DECIMAL(3,2),
    engagement_metrics JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for content table
CREATE INDEX idx_content_session_id ON content(session_id);
CREATE INDEX idx_content_format ON content(format);
CREATE INDEX idx_content_genre ON content(genre);
CREATE INDEX idx_content_difficulty ON content(difficulty);
CREATE INDEX idx_content_generated_at ON content(generated_at);
CREATE INDEX idx_content_series_id ON content(series_id) WHERE series_id IS NOT NULL;

-- Sessions table: Tracks user listening sessions
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    content_ids TEXT[] NOT NULL DEFAULT '{}',
    current_content_id VARCHAR(255),
    total_listening_time INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for sessions table
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity_at);

-- Behavioral events table: Tracks user listening behavior
CREATE TABLE behavioral_events (
    id VARCHAR(255) PRIMARY KEY,
    content_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    playback_position DECIMAL(10,2) NOT NULL,
    playback_position_percent DECIMAL(5,2),
    duration DECIMAL(10,2),
    session_id VARCHAR(255) NOT NULL,
    content_characteristics JSONB NOT NULL,
    device_info JSONB,
    network_type VARCHAR(50),
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for behavioral_events table
CREATE INDEX idx_behavioral_events_content_id ON behavioral_events(content_id);
CREATE INDEX idx_behavioral_events_session_id ON behavioral_events(session_id);
CREATE INDEX idx_behavioral_events_event_type ON behavioral_events(event_type);
CREATE INDEX idx_behavioral_events_timestamp ON behavioral_events(timestamp);
CREATE INDEX idx_behavioral_events_content_characteristics ON behavioral_events USING GIN(content_characteristics);

-- Like engagement table: Tracks user likes and engagement
CREATE TABLE like_engagement (
    content_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    liked BOOLEAN NOT NULL DEFAULT false,
    liked_at TIMESTAMP WITH TIME ZONE,
    unliked_at TIMESTAMP WITH TIME ZONE,
    reaction_type VARCHAR(50) CHECK (reaction_type IN ('like', 'love', 'favorite')),
    content_characteristics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (content_id, session_id)
);

-- Indexes for like_engagement table
CREATE INDEX idx_like_engagement_session_id ON like_engagement(session_id);
CREATE INDEX idx_like_engagement_liked ON like_engagement(liked) WHERE liked = true;
CREATE INDEX idx_like_engagement_content_characteristics ON like_engagement USING GIN(content_characteristics);

-- Learner model state table: Stores inferred learner comprehension and preferences
CREATE TABLE learner_model_state (
    session_id VARCHAR(255) PRIMARY KEY,
    preference_weights JSONB NOT NULL,
    comprehension_level DECIMAL(3,2) NOT NULL,
    content_type_preferences JSONB NOT NULL,
    difficulty_adjustment DECIMAL(5,2) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    data_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for learner_model_state table
CREATE INDEX idx_learner_model_state_last_updated ON learner_model_state(last_updated);

-- User preferences table: Stores user preferences (post-MVP with authentication)
-- Note: MVP uses localStorage, but schema ready for post-MVP migration
CREATE TABLE user_preferences (
    id VARCHAR(255) PRIMARY KEY, -- User ID (post-MVP)
    session_id VARCHAR(255), -- Session ID for MVP
    difficulty_preference VARCHAR(50) NOT NULL CHECK (difficulty_preference IN ('beginner', 'intermediate', 'advanced')),
    preferred_formats TEXT[] NOT NULL DEFAULT '{}',
    preferred_genres TEXT[] NOT NULL DEFAULT '{}',
    playback_speed DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    auto_play BOOLEAN NOT NULL DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for user_preferences table
CREATE INDEX idx_user_preferences_session_id ON user_preferences(session_id) WHERE session_id IS NOT NULL;

-- Content generation status table: Tracks async content generation pipeline status
CREATE TABLE generation_status (
    generation_id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('generating', 'processing', 'completed', 'failed')),
    content_id VARCHAR(255),
    webhook_url VARCHAR(1000),
    webhook_sent BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    estimated_completion_time INTEGER,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for generation_status table
CREATE INDEX idx_generation_status_session_id ON generation_status(session_id);
CREATE INDEX idx_generation_status_status ON generation_status(status);
CREATE INDEX idx_generation_status_started_at ON generation_status(started_at);

-- Foreign key constraints
ALTER TABLE behavioral_events ADD CONSTRAINT fk_behavioral_events_content 
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE;

ALTER TABLE behavioral_events ADD CONSTRAINT fk_behavioral_events_session 
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;

ALTER TABLE like_engagement ADD CONSTRAINT fk_like_engagement_content 
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE;

ALTER TABLE like_engagement ADD CONSTRAINT fk_like_engagement_session 
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;

ALTER TABLE learner_model_state ADD CONSTRAINT fk_learner_model_state_session 
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;

ALTER TABLE generation_status ADD CONSTRAINT fk_generation_status_session 
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;

ALTER TABLE generation_status ADD CONSTRAINT fk_generation_status_content 
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE SET NULL;
```

## Schema Design Decisions

**PostgreSQL Features Used:**
- **JSONB columns:** For flexible metadata (model_parameters, content_characteristics, preference_weights)
- **Array columns:** For related_content_ids, content_ids, preferred_formats
- **Check constraints:** For enum-like values (format, difficulty, event_type)
- **GIN indexes:** For JSONB column queries (content_characteristics)
- **Cascading deletes:** Sessions deleted → related data cleaned up automatically

**Indexing Strategy:**
- **Primary indexes:** On all primary keys
- **Foreign key indexes:** On all foreign key columns
- **Query optimization indexes:** On frequently queried columns (session_id, content_id, timestamp, event_type)
- **Composite indexes:** Where queries filter on multiple columns

**Data Retention:**
- **Content:** Permanent storage (generated content persists)
- **Sessions:** Can be archived after inactivity period (post-MVP)
- **Behavioral Events:** Aggregated for analytics, raw events can be archived (post-MVP)
- **Generation Status:** Can be cleaned up after completion (retention policy)

**MVP vs Post-MVP:**
- **MVP:** Sessions and preferences use session_id (no user authentication)
- **Post-MVP:** User preferences table ready for user_id migration
- **Post-MVP:** Additional indexes and constraints can be added as needed

---

