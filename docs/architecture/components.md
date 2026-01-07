# Components


Major logical components/services across the fullstack with clear boundaries and interfaces.

## Frontend Application (apps/web)

**Responsibility:** React-based Progressive Web App providing lean-back audio consumption experience with continuous scrolling feed, audio playback controls, and model-driven content generation integration.

**Key Interfaces:**
- React Context API for state management (SessionContext, AudioPlayerContext, ContentContext)
- REST API client service layer for backend communication
- Service Worker API for PWA offline capabilities
- HTML5 Audio API for playback control
- localStorage API for preferences and session data

**Dependencies:**
- Backend API (Express server)
- CDN (CloudFlare) for audio file delivery
- Shared package (types and utilities)

**Technology Stack:**
- React 18.x with TypeScript
- Tailwind CSS for styling
- Vite for bundling and dev server
- Workbox for service worker management
- React Context API for state

**Key Sub-Components:**
- **AudioPlayer:** HTML5 audio wrapper with custom controls (play, pause, skip forward/backward 15s)
- **ScrollingFeed:** Continuous scrolling interface with bidirectional navigation
- **ContentCard:** Individual content item display with metadata
- **LikeButton:** Instagram-style like interaction
- **OnboardingFlow:** Simple preference setup (2-3 screens)
- **SettingsPanel:** Minimal settings interface (hidden menu)

## Backend API Server (apps/api)

**Responsibility:** Express-based REST API server coordinating all backend services, handling HTTP requests, routing, and response formatting.

**Key Interfaces:**
- REST API endpoints (defined in API Specification)
- Service layer interfaces for all backend services
- Database repository interfaces
- External API client interfaces (OpenAI, Google Cloud TTS)

**Dependencies:**
- Model Service package
- PostgreSQL database
- Redis cache
- External APIs (OpenAI, Google Cloud TTS)
- AWS S3 for audio storage

**Technology Stack:**
- Node.js with Express 4.x
- TypeScript
- Express middleware for CORS, body parsing, error handling

**Key Sub-Components:**
- **Route Handlers:** Express route handlers for each API endpoint
- **Middleware:** Authentication (post-MVP), error handling, request validation
- **Service Orchestrator:** Coordinates service calls and manages async operations

## Model Service (packages/model-service)

**Responsibility:** Centralized service implementing foundation language acquisition model principles. Provides model-driven APIs for content generation parameters, adaptation decisions, signal interpretation, and learner state representation.

**Key Interfaces:**
- `getGenerationParameters(userPreferences, adaptationSignals): ModelParameters`
- `getAdaptationRecommendations(behavioralEvents, likeData, learnerState): AdaptationSignals`
- `interpretBehavioralSignals(events): ComprehensionInference`
- `updateLearnerState(events, likes, currentState): LearnerModelState`
- `getContentDifficulty(content, userState): DifficultyLevel`

**Dependencies:**
- PostgreSQL (for learner state persistence)
- None (pure computation, no external APIs)

**Technology Stack:**
- TypeScript/JavaScript
- Computationally efficient algorithms (no ML models requiring GPU)
- Probabilistic models for learner state tracking

**Key Sub-Components:**
- **Generation Parameter Calculator:** Determines model parameters for content generation
- **Adaptation Engine:** Calculates adaptation recommendations based on behavioral signals
- **Signal Interpreter:** Processes behavioral events according to model framework
- **Learner State Manager:** Maintains and updates probabilistic learner model
- **Difficulty Classifier:** Classifies content as lexical-heavy vs. discourse-heavy

## Content Generation Service

**Responsibility:** Orchestrates model-driven Italian text generation via OpenAI API, integrates with Model Service for generation parameters, and manages content format/template selection.

**Key Interfaces:**
- `generateContent(sessionId, userPreferences, adaptationSignals, continuityContext): Promise<Content>`
- `selectTemplate(format, genre, difficulty): TemplateConfig`
- `buildPrompt(template, modelParameters, context): string`

**Dependencies:**
- Model Service (for generation parameters)
- OpenAI API (for text generation)
- Content Storage Service (for saving generated content)

**Technology Stack:**
- Node.js with TypeScript
- OpenAI SDK
- Template engine for prompt construction

**Key Sub-Components:**
- **Prompt Builder:** Constructs model-driven prompts according to model principles
- **Template Selector:** Chooses appropriate template based on format/genre preferences
- **Content Validator:** Validates generated content quality and model criteria
- **Rate Limit Manager:** Handles OpenAI API rate limits and quota management

## Text-to-Speech Service

**Responsibility:** Converts generated Italian text into high-quality audio using Google Cloud TTS API (with Azure fallback), manages audio format configuration, and coordinates with Audio Processing Service.

**Key Interfaces:**
- `synthesizeSpeech(text, language, voice): Promise<AudioFile>`
- `getAvailableVoices(language): Voice[]`

**Dependencies:**
- Google Cloud TTS API (primary)
- Azure Cognitive Services TTS (fallback)
- Audio Processing Service (for file handling)

**Technology Stack:**
- Node.js with TypeScript
- Google Cloud TTS SDK
- Azure TTS SDK (fallback)

**Key Sub-Components:**
- **Voice Selector:** Chooses appropriate Italian voice for natural speech
- **Format Configurator:** Sets audio format, bitrate, and quality parameters
- **Fallback Handler:** Manages fallback to Azure TTS on Google Cloud failure

## Audio Processing Service

**Responsibility:** Handles audio file processing, storage coordination, and CDN integration. Manages audio file upload to S3 and CDN distribution. Also handles content metadata storage (no separate Content Storage Service needed for MVP).

**Key Interfaces:**
- `processAudio(audioData, metadata): Promise<AudioFile>`
- `uploadToStorage(audioFile, contentId): Promise<string>`
- `getAudioUrl(contentId): Promise<string>`
- `storeContentMetadata(content): Promise<void>`

**Dependencies:**
- TTS Service (for audio generation)
- AWS S3 (for storage)
- CDN (CloudFlare) for delivery
- PostgreSQL (for content metadata)

**Technology Stack:**
- Node.js with TypeScript
- AWS SDK (S3)
- Audio processing utilities

**Key Sub-Components:**
- **File Manager:** Handles audio file metadata and organization
- **Storage Coordinator:** Manages S3 upload and CDN integration
- **URL Generator:** Creates CDN URLs for audio file delivery
- **Metadata Manager:** Stores content metadata in PostgreSQL

**Design Decision:** Content storage handled by Audio Processing Service (no separate Content Storage Service). Keeps architecture simple for MVP, clear responsibility for all audio-related storage operations.

## Content Generation Pipeline

**Responsibility:** Orchestrates complete model-driven content generation flow: Model Service → Content Generation → TTS → Audio Processing → Storage → Session Storage. Manages async processing, status tracking, and webhook notifications.

**Key Interfaces:**
- `executePipeline(sessionId, userPreferences, adaptationSignals, webhookUrl?): Promise<Content>`
- `getPipelineStatus(generationId): PipelineStatus`
- `notifyWebhook(webhookUrl, payload): Promise<void>`

**Dependencies:**
- Model Service
- Content Generation Service
- TTS Service
- Audio Processing Service
- Session Storage Service
- PostgreSQL (for status tracking)

**Technology Stack:**
- Node.js with TypeScript
- Promise-based async processing (queue-based can be added later if needed)
- Webhook notification system (integrated, no separate service needed for MVP)

**Key Sub-Components:**
- **Pipeline Orchestrator:** Coordinates service calls in sequence
- **Status Tracker:** Monitors pipeline progress and stores status
- **Webhook Notifier:** Sends completion notifications to webhook URLs (integrated component, not separate service)
- **Error Handler:** Manages errors at each pipeline stage

**Design Decision:** Webhook notification kept as integrated component within Pipeline (not separate service). Simplifies MVP architecture, can be extracted to separate service later if webhook complexity grows.

## User Service

**Responsibility:** Manages user preferences and session management. Handles localStorage-based preferences for MVP (designed for future database migration).

**Key Interfaces:**
- `getPreferences(sessionId): Promise<UserPreferences>`
- `updatePreferences(sessionId, preferences): Promise<UserPreferences>`
- `getDefaultPreferences(): UserPreferences`

**Dependencies:**
- localStorage (MVP) or PostgreSQL (post-MVP)
- Model Service (for baseline preference establishment)

**Technology Stack:**
- Node.js with TypeScript
- localStorage API (MVP)
- PostgreSQL (post-MVP)

**Key Sub-Components:**
- **Preference Manager:** Handles preference CRUD operations
- **Default Provider:** Provides model-specified default preferences
- **Migration Handler:** Supports future localStorage → database migration

## Learner Model Service

**Responsibility:** Tracks behavioral signals, maintains user comprehension model according to foundation model principles, and determines content difficulty selection using model predictions.

**Key Interfaces:**
- `processBehavioralEvents(events): Promise<void>`
- `updateLearnerState(sessionId, events, likes): Promise<LearnerModelState>`
- `getLearnerState(sessionId): Promise<LearnerModelState>`
- `getContentRecommendations(learnerState): ContentRecommendations`

**Dependencies:**
- Model Service (for model-driven inference)
- Analytics Service (for behavioral data)
- PostgreSQL (for state persistence)

**Technology Stack:**
- Node.js with TypeScript
- Probabilistic model implementation
- PostgreSQL for state storage

**Key Sub-Components:**
- **Event Processor:** Processes behavioral events according to model framework
- **State Updater:** Updates learner model state incrementally
- **Recommendation Engine:** Generates content recommendations based on learner state
- **Preference Weight Calculator:** Calculates preference weights from behavioral signals

## Analytics Service

**Responsibility:** Collects and processes behavioral events for adaptation, product insights, and model validation. Aggregates events and calculates metrics according to model measurement framework.

**Key Interfaces:**
- `recordEvent(event): Promise<void>`
- `recordEventsBatch(events): Promise<void>`
- `getSessionAnalytics(sessionId): SessionAnalytics`
- `getContentAnalytics(contentId): ContentAnalytics`
- `getModelValidationMetrics(): ModelValidationMetrics`

**Dependencies:**
- PostgreSQL (for event storage and aggregation)
- Model Service (for model validation metrics)

**Technology Stack:**
- Node.js with TypeScript
- PostgreSQL with aggregation queries
- Analytics calculation algorithms

**Key Sub-Components:**
- **Event Collector:** Receives and stores behavioral events
- **Metrics Calculator:** Aggregates events into engagement metrics
- **Pattern Analyzer:** Identifies patterns in behavioral data
- **Validation Tracker:** Tracks model predictions vs. outcomes for validation

## Session Storage Service

**Responsibility:** Manages session-based content storage for backward navigation. Handles temporary content storage during sessions (frontend localStorage + backend session tracking). Unified service handles both frontend and backend session concerns.

**Key Interfaces:**
- `storeContent(sessionId, content): Promise<void>`
- `getSessionContent(sessionId): Promise<Content[]>`
- `getContentById(sessionId, contentId): Promise<Content>`
- `updateSession(sessionId, updates): Promise<Session>`
- `createSession(): Promise<Session>`
- `getSession(sessionId): Promise<Session>`

**Dependencies:**
- Frontend localStorage (for temporary content storage)
- PostgreSQL (for session metadata and persistence)
- Redis (for session caching)

**Technology Stack:**
- Node.js with TypeScript
- localStorage API (frontend, via service layer)
- PostgreSQL (backend)
- Redis (caching)

**Key Sub-Components:**
- **Session Manager:** Creates and manages session lifecycle (frontend and backend)
- **Content Organizer:** Organizes content by session for backward navigation
- **Cache Manager:** Handles Redis caching for session data
- **Storage Adapter:** Abstracts localStorage (frontend) and PostgreSQL (backend) storage

**Design Decision:** Unified Session Storage Service handles both frontend and backend concerns. Simpler architecture for MVP, clear single responsibility for all session-related operations. Frontend and backend implementations share same interface.

## Shared Package (packages/shared)

**Responsibility:** Provides shared TypeScript types, interfaces, constants, and utilities used across frontend and backend.

**Key Interfaces:**
- All data model interfaces (Content, UserPreferences, BehavioralEvent, etc.)
- API request/response types
- Shared utility functions

**Dependencies:**
- None (pure TypeScript definitions and utilities)

**Technology Stack:**
- TypeScript
- No runtime dependencies

**Key Sub-Components:**
- **Types:** All shared TypeScript interfaces and types
- **Constants:** Shared constants (event types, content formats, etc.)
- **Utilities:** Shared helper functions (date formatting, validation, etc.)

---

