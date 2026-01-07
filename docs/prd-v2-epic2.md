# PRD v2: Epic 2 - Model-Driven Content Generation & Delivery Pipeline

**Part of:** PRD v2 - Adaptive Italian Audio for Accelerated Acquisition  
**Document Version:** 2.0  
**Date:** 2026-01-07  
**Status:** Draft

---

## Epic 2: Model-Driven Content Generation & Delivery Pipeline

**Epic Goal:**

Build the core model-driven content generation infrastructure that operationalizes the foundation language acquisition model. Integrate AI text generation APIs with the model service to produce engaging Italian narratives, podcasts, and educational content following model principles. Implement text-to-speech conversion and establish storage/delivery system that integrates seamlessly with the scrolling feed interface from Epic 1. Add content engagement tracking through a like feature that informs model-driven adaptation. The epic delivers unlimited, diverse Italian content generated according to model specifications (meaning-first approach, controlled variation, comprehensibility before correctness), replacing sample content with real-time model-driven generation. This epic proves that the foundation language acquisition model can be successfully operationalized in content generation and that model-driven generation produces engaging, coherent Italian content at scale.

### Story 2.1: Foundation Model Service Implementation

**As a** system,  
**I want** to implement the foundation language acquisition model as a centralized service,  
**so that** all content generation and adaptation decisions can be driven by model principles consistently.

**Acceptance Criteria:**

1. Model service created as centralized service module implementing foundation language acquisition model principles
2. Model service provides API for content generation parameters (determines generation parameters based on model principles)
3. Model service provides API for adaptation decisions (model-informed difficulty and content selection)
4. Model service provides API for signal interpretation (model framework for understanding behavioral signals)
5. Model service provides API for learner state representation (model-based learner state tracking)
6. Model service interface is versioned to support model evolution and refinement
7. Model service implements core model principles (meaning-first approach, comprehensibility before correctness, variation is essential, prediction under uncertainty, meaning anchoring, statistical abstraction, re-expression/compression)
8. Model service determines content generation parameters (lexical sets, construction sets, novelty budgets, variation patterns) according to model specifications
9. Model service provides prompt engineering guidance aligned with model principles (meaning-first prompts, controlled variation specifications)
10. Model service is computationally efficient (implements model principles through algorithms/heuristics, not full ML implementation)
11. Model service integrates with content generation pipeline (model parameters passed to generation service)
12. Model service designed for extensibility (ready for model refinement and increased sophistication in Phase 2+)

### Story 2.2: External API Integration Setup

**As a** developer,  
**I want** external API integration infrastructure configured and tested before content generation begins,  
**so that** Gemini API, Google Cloud TTS, and AWS S3 services are properly integrated and validated before being used in content generation.

**Acceptance Criteria:**

1. Gemini API client integration implemented and configured (API key validation, connection testing)
2. Google Cloud TTS API client library integrated and configured (service account authentication, connection testing)
3. AWS S3 client library integrated and configured (access key authentication, bucket connection testing)
4. API authentication and credential management implemented (environment variable loading, credential validation)
5. API connection health checks implemented (test connections to each service, validate credentials)
6. API error handling infrastructure implemented (network errors, authentication errors, rate limit handling)
7. API rate limiting awareness implemented (tracks usage, respects free-tier limits, implements backoff strategies)
8. API integration test suite created (unit tests for API clients, integration tests for service connections)
9. API integration documentation created (setup requirements, credential configuration, troubleshooting guide)
10. All external API integrations validated and tested before content generation stories begin
11. API integration service layer created (abstracts API calls, provides consistent error handling interface)
12. API integration ready for use in content generation pipeline (validated, tested, documented)

### Story 2.3: Model-Driven AI Text Generation Service

**As a** system,  
**I want** to integrate AI text generation APIs with the model service to produce model-driven Italian content on-demand,  
**so that** I can generate diverse, engaging Italian narratives, podcasts, and educational content fresh for each scroll action according to model principles.

**Acceptance Criteria:**

1. Gemini API (or alternative) integrated into backend service with API key management
2. Content generation service integrates with model service to receive model-driven generation parameters
3. Content generation prompts engineered according to model principles (meaning-first approach, meaning anchoring, controlled variation)
4. Model service determines generation parameters for each request (lexical novelty budget, construction sets, variation patterns, difficulty calibration)
5. Content generation service accepts model-driven parameters and user preferences (difficulty level, format preferences from localStorage)
6. API rate limiting and quota management implemented (respects free-tier limits, handles rate limit errors gracefully)
7. Content generation prompts configured for Italian language output with model-informed structure
8. Support for multiple content format templates (narrative/story, podcast-style, educational/explanatory) with model-driven format selection
9. Generated Italian text follows model principles (meaning-first, comprehensible before correct, appropriate variation, semantic grounding)
10. Generated Italian text is grammatically correct and coherent
11. Content generation completes within 5-10 seconds (non-blocking, runs asynchronously)
12. Content generation service returns structured data (text content, metadata, format type, difficulty level, estimated duration, generation timestamp, model parameters used)
13. Error handling for API failures (network errors, API errors, timeout errors) with appropriate fallback or user feedback
14. Generated content is validated for basic quality (non-empty, minimum length, Italian language detected, model criteria met)
15. Content generation works on-demand (generates fresh content each time according to model specifications, not from pre-existing pool)

### Story 2.4: Text-to-Speech Conversion Service

**As a** system,  
**I want** to convert model-generated Italian text into high-quality audio using TTS APIs,  
**so that** users can listen to the generated content as natural-sounding Italian speech that supports model-driven acquisition goals.

**Acceptance Criteria:**

1. Google Cloud TTS API (or alternative) integrated into backend service with API key management
2. TTS service created with proper error handling and retry logic
3. Italian language voice selected and configured for natural-sounding speech
4. Audio format configured for optimal quality and file size (MP3 or similar, appropriate bitrate)
5. TTS conversion completes within 5-10 seconds for typical content length
6. Generated audio quality is clear and comprehensible (suitable for language learning, supports model's comprehensibility goals)
7. Audio file storage location configured (cloud storage bucket or CDN)
8. TTS service returns audio file URL and metadata (duration, file size, format)
9. Error handling for TTS API failures with appropriate fallback or retry logic
10. Audio generation is asynchronous and doesn't block content text generation

### Story 2.5: Model-Driven Content Generation Pipeline Orchestration

**As a** system,  
**I want** to orchestrate the complete model-driven content generation flow from model service → text generation → TTS conversion → storage,  
**so that** I can deliver ready-to-play audio content to users efficiently that follows model principles throughout the pipeline.

**Acceptance Criteria:**

1. Content generation pipeline service coordinates model service → text generation → TTS conversion → cloud storage → session storage workflow
2. Pipeline integrates with model service at start of generation flow (retrieves model-driven parameters before text generation)
3. Pipeline handles asynchronous processing (queue-based or promise-based async flow)
4. Pipeline tracks generation status (generating, processing, completed, failed) for frontend status updates
5. Generated content metadata stored in both cloud storage and temporary session storage (text content, audio URL, format type, difficulty, duration, generation timestamp, session ID, model parameters used, content characteristics for like tracking)
6. Audio files stored in cloud storage (S3, Google Cloud Storage, or CDN) for persistence
7. Complete content data (metadata + audio URL) stored in frontend session storage for backward navigation during session
8. Content retrieval API endpoint created to fetch generated content by ID (for cloud-stored content)
9. Pipeline handles errors gracefully at each stage (model service failure, text generation failure, TTS failure, storage failure)
10. Generation status can be queried (allows frontend to show loading state, check completion)
11. Content generation integrates with scrolling feed trigger (pipeline initiated when user scrolls forward, uses model service to determine generation parameters)
12. Generated content is immediately available after pipeline completion (cloud storage + session storage, retrievable for playback)
13. Pipeline supports session-based content organization (content linked to session for backward navigation)
14. Pipeline logs model parameters and decisions for model validation (tracks what model parameters were used, what content was generated)

### Story 2.6: Model-Driven Serial Narrative Content System

**As a** system,  
**I want** to generate serial narrative content with a modular, extensible template system driven by model principles,  
**so that** I can create engaging, connected content that maintains narrative pull and implements model-specified repetition and variation patterns.

**Acceptance Criteria:**

1. Modular serial narrative template system implemented (templates are pluggable, configurable, and easily extensible)
2. Template system supports multiple narrative genres/themes (adventure, mystery, daily life, romance, thriller, etc.) as separate template modules
3. Each template module is independently configurable (character definitions, storyline arcs, episode structure, genre-specific parameters)
4. Model service determines narrative generation parameters (repetition patterns, variation specifications, semantic stability vs. linguistic variation according to model)
5. Template selection system implemented (can select templates based on configuration, randomization, or external signals like user preferences and model recommendations)
6. Serial narrative continuity system uses session storage to track previous episodes (retrieves previous episode data from session storage)
7. Content generation prompts include serial narrative context retrieved from session storage (previous episode summary, character state, storyline continuity from same session)
8. Model service ensures narrative generation follows model principles (meaning anchoring through story context, controlled variation of linguistic forms around stable meaning, repetition with variation)
9. Generated narratives maintain character consistency across episodes within same session (same characters, consistent personalities, semantic coherence)
10. Narrative storylines progress logically across episodes within session (episodes build on previous events from session history, meaning-first progression)
11. Episode numbering/titling system implemented within session (Episode 1, Episode 2, etc. per session/storyline)
12. Serial narrative metadata tracked and stored in session storage (episode number, storyline arc, featured characters, genre, template type, continuity notes, session ID, model parameters used)
13. Narrative episodes reference previous events from session when appropriate (subtle callbacks, continuity elements from session history, model-driven variation patterns)
14. System can generate multiple concurrent serial narratives across different sessions (different storylines for different sessions)
15. Template system designed for extensibility (easy to add new genres, modify existing templates, adjust selection logic)
16. Template selection interface allows model service to influence selection (model-driven template recommendations based on learner state and model principles)
17. Template metadata stored (genre, template type, configuration parameters) for potential future analytics and model validation
18. Continuity system gracefully handles session boundary (new sessions start fresh narratives, no cross-session continuity in MVP)
19. Model service tracks narrative patterns for model validation (tracks how model-driven narratives perform, validates model predictions)

### Story 2.7: Model-Driven Modular Content Format System

**As a** system,  
**I want** to generate diverse content formats (narratives, podcasts, educational) with a modular, extensible format system driven by model principles,  
**so that** I can provide varied content types that follow model specifications for format-appropriate content generation.

**Acceptance Criteria:**

1. Modular content format template system implemented (narrative, podcast-style, educational as separate, pluggable format modules)
2. Podcast-style content template implemented (informative, conversational, interview-style formats) with sub-categories/topics
3. Educational content template implemented (explanatory, tutorial-style, cultural topics) with diverse subject areas
4. Model service determines format-specific generation parameters (different parameters for narratives vs. podcasts vs. educational content according to model)
5. Format selection system implemented (can select formats based on configuration, randomization, or external signals like model recommendations)
6. Format selection system can alternate between content formats (narrative → podcast → educational) based on configuration or model-driven selection
7. Podcast-style content maintains conversational, natural tone (not narrative, more informative) while following model principles (meaning-first, comprehensibility, variation)
8. Educational content focuses on explaining concepts, cultural topics, or interesting facts in Italian while following model principles (meaning anchoring, controlled complexity, variation)
9. All content formats maintain appropriate length for listening sessions (5-15 minutes typical duration) as determined by model service
10. Content format metadata tracked and stored (format type, sub-category, topic, theme, model parameters used)
11. Format templates designed for extensibility (easy to add new formats, modify existing ones, adjust selection logic)
12. Format selection interface allows model service to influence selection (model-driven format recommendations based on learner state and model principles)
13. Template and format systems integrate seamlessly (narrative genre selection + format selection work together, both model-driven)
14. Format system provides foundation for future enhancement (modular architecture ready for model refinement and increased sophistication)
15. Model service tracks format performance for validation (tracks how different formats perform, validates model predictions about format effectiveness)

### Story 2.8: Model-Driven Content Generation Integration with Scrolling Feed

**As a** system,  
**I want** to integrate model-driven content generation with the scrolling feed interface for on-demand generation and session storage,  
**so that** generated content automatically appears in the feed when users scroll forward, plays automatically, and follows model principles throughout.

**Acceptance Criteria:**

1. Frontend forward scroll action triggers model-driven content generation request to backend (on-demand generation, model service determines parameters)
2. Frontend backward scroll action retrieves previously generated content from session storage (no new generation)
3. Content generation initiated asynchronously when user scrolls forward (non-blocking, background processing, model service consulted first)
4. Loading state displayed during forward-scroll generation (visual indicator, smooth UX, shows generation progress)
5. Backward-scroll content loads instantly from session storage (no loading delay, immediate playback)
6. Generated content automatically appears in feed when generation completes (forward scroll, content generated according to model principles)
7. Previously generated content retrieved from session storage appears in feed when scrolling backward
8. Generated content automatically begins playing when it appears in feed (if user has auto-play enabled)
9. Content generation queue handles multiple concurrent forward-scroll requests gracefully (prevents duplicate generation, each request uses model service)
10. Error states handled appropriately (generation failure shows error message, allows retry on forward scroll)
11. Generated content automatically stored in temporary session storage after generation (enables backward navigation)
12. Session storage maintains scroll order/index (content accessible in same order it was generated for backward navigation)
13. Content metadata (title, format, duration, difficulty, model parameters) displays correctly in feed interface
14. Like button visible and functional on all content items in feed (works during playback, when scrolling, data informs model service)
15. Generation pipeline integrates seamlessly with existing scrolling feed from Epic 1 (bidirectional scrolling works smoothly)
16. User preferences from localStorage included in generation requests (difficulty, format preferences affect model service decisions)
17. Model service integration transparent to user (model-driven generation happens seamlessly, no visible model complexity)

### Story 2.9: Content Like/Engagement Tracking System

**As a** user,  
**I want** to quickly like audio content I enjoy (similar to Instagram's like feature),  
**so that** I can provide feedback on content I find engaging without interrupting my listening experience, and this feedback informs model-driven adaptation.

**Acceptance Criteria:**

1. Like button/icon implemented in feed interface (minimal, unobtrusive design, similar to Instagram like interaction)
2. Like button accessible during playback (tap/double-tap to like, doesn't interrupt audio)
3. Like action provides immediate visual feedback (icon animation, state change)
4. Like state persists for content during session (liked status stored with content in session storage)
5. Like data stored in session storage with content metadata (content ID, like status, timestamp, content characteristics)
6. Like button shows current like state (filled/active when liked, outline when not liked)
7. Like interaction is quick and requires minimal effort (single tap or double-tap, no confirmation needed)
8. Like data structure includes content characteristics (format type, genre, difficulty, template ID, model parameters) for model-driven adaptation use
9. Like state visible when scrolling backward through previously viewed content (shows if content was liked)
10. Like data stored in localStorage (persists across sessions, linked to content characteristics not just content ID)
11. Like system tracks which content types/formats/genres users like (aggregates like data by content characteristics for model service)
12. Like data structured for model service consumption (easy retrieval for model-driven adaptation logic)
13. Like feature doesn't interrupt lean-back experience (minimal UI, subtle animations)
14. Like statistics tracked per session (how many likes, what types of content liked, informs model service)
15. Like data feeds into model service for adaptation decisions (likes inform model predictions about user preferences and comprehension)

---

**Next:** See **prd-v2-epic3.md** for User Preferences & Model-Informed Adaptation
