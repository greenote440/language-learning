# Core Workflows


Key system workflows illustrating component interactions for critical user journeys and system operations.

## Workflow 1: First-Time User Onboarding & Initial Content Generation

**User Journey:** User opens app for first time, completes onboarding, receives first generated content.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant SessionService
    participant ModelService
    participant ContentGen
    participant Pipeline
    participant TTS
    participant S3
    participant CDN

    User->>Frontend: Open app
    Frontend->>SessionService: Create session
    SessionService-->>Frontend: Session ID
    Frontend->>Frontend: Check localStorage for preferences
    alt No preferences found
        Frontend->>User: Show onboarding
        User->>Frontend: Select difficulty preference
        Frontend->>Frontend: Save preferences to localStorage
    end
    Frontend->>API: POST /api/content/generate (sessionId, preferences)
    API->>ModelService: Get generation parameters (preferences)
    ModelService-->>API: Model parameters
    API->>ContentGen: Generate text (model parameters)
    ContentGen->>ContentGen: Gemini API call
    ContentGen-->>API: Generated Italian text
    API->>Pipeline: Execute pipeline (text, sessionId)
    Pipeline->>TTS: Synthesize speech (text)
    TTS->>TTS: Google Cloud TTS API
    TTS-->>Pipeline: Audio file
    Pipeline->>S3: Upload audio file
    S3-->>Pipeline: Audio URL
    Pipeline->>SessionService: Store content (sessionId, content)
    SessionService-->>Pipeline: Stored
    Pipeline-->>API: Content ready (with CDN URL)
    API-->>Frontend: 202 Accepted (generationId)
    Frontend->>API: Poll GET /api/content/{generationId}/status
    API-->>Frontend: Status: completed, Content object
    Frontend->>CDN: Request audio file
    CDN-->>Frontend: Audio stream
    Frontend->>Frontend: Auto-play audio
    Frontend->>User: Audio playing
```

## Workflow 2: Scroll Forward - Generate New Content

**User Journey:** User scrolls forward to generate new content, system generates content on-demand with model-driven adaptation.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Analytics
    participant LearnerModel
    participant ModelService
    participant ContentGen
    participant Pipeline
    participant Webhook

    User->>Frontend: Scroll forward
    Frontend->>Frontend: Stop current playback
    Frontend->>Analytics: Get recent behavioral events
    Analytics-->>Frontend: Recent events
    Frontend->>LearnerModel: Get learner state (sessionId)
    LearnerModel-->>Frontend: Learner state + adaptation signals
    Frontend->>API: POST /api/content/generate (sessionId, preferences, adaptationSignals, webhookUrl)
    API->>ModelService: Get generation parameters (preferences, adaptationSignals)
    ModelService-->>API: Model parameters (adapted)
    API->>ContentGen: Generate content (model parameters, adaptationSignals)
    ContentGen->>ContentGen: Gemini API (with adapted prompts)
    ContentGen-->>API: Generated text
    API->>Pipeline: Execute pipeline (text, sessionId, webhookUrl)
    Pipeline->>Pipeline: TTS → Storage → Session Storage
    Pipeline->>Webhook: POST webhookUrl (generation complete)
    Webhook-->>Pipeline: 200 OK
    Pipeline-->>API: Content ready
    API-->>Frontend: Webhook notification (or polling response)
    Frontend->>Frontend: Display new content in feed
    Frontend->>Frontend: Auto-play new content
    Frontend->>User: New content playing
```

## Workflow 3: Scroll Backward - Access Session History

**User Journey:** User scrolls backward to access previously generated content from current session.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SessionService
    participant CDN

    User->>Frontend: Scroll backward
    Frontend->>Frontend: Stop current playback
    Frontend->>SessionService: Get previous content (sessionId, currentIndex - 1)
    SessionService->>SessionService: Retrieve from localStorage (frontend) or PostgreSQL (backend)
    SessionService-->>Frontend: Content object (with audio URL)
    Frontend->>CDN: Request audio file (cached URL)
    CDN-->>Frontend: Audio stream (instant, cached)
    Frontend->>Frontend: Play audio
    Frontend->>User: Previous content playing
```

## Workflow 4: Behavioral Event Tracking & Model-Driven Adaptation

**User Journey:** User listens to content, system tracks behavior, updates learner model, and adapts next content generation.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Analytics
    participant LearnerModel
    participant ModelService

    User->>Frontend: Listen to content (play, pause, skip, complete)
    Frontend->>Frontend: Track behavioral events locally
    Frontend->>API: POST /api/events/batch (events[])
    API->>Analytics: Record events
    Analytics->>Analytics: Aggregate events by content characteristics
    Analytics->>LearnerModel: Process events for learner state update
    LearnerModel->>ModelService: Interpret signals (model framework)
    ModelService-->>LearnerModel: Comprehension inference
    LearnerModel->>LearnerModel: Update preference weights
    LearnerModel->>LearnerModel: Update difficulty adjustment
    LearnerModel-->>Analytics: Updated learner state
    Analytics->>Analytics: Store updated state
    Note over Frontend,ModelService: Next content generation uses updated learner state
    Frontend->>User: Content continues playing
```

## Workflow 5: Like Engagement & Immediate Adaptation

**User Journey:** User likes content, system immediately incorporates like data into adaptation for next content.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Analytics
    participant LearnerModel
    participant ModelService

    User->>Frontend: Tap like button
    Frontend->>Frontend: Update UI (like state)
    Frontend->>Frontend: Store like in localStorage
    Frontend->>API: POST /api/content/{contentId}/like (sessionId, reactionType)
    API->>Analytics: Record like engagement
    Analytics->>LearnerModel: Update preferences with like data
    LearnerModel->>ModelService: Calculate preference weights (with like)
    ModelService-->>LearnerModel: Updated preference weights
    LearnerModel->>LearnerModel: Store updated state
    Note over Frontend,ModelService: Next content generation uses updated preferences
    LearnerModel-->>API: Adaptation signals updated
    API-->>Frontend: Like recorded
    Frontend->>User: Visual feedback (like confirmed)
```

## Workflow 6: Content Generation Pipeline with Error Handling

**System Operation:** Complete content generation pipeline with error handling and fallback mechanisms.

```mermaid
sequenceDiagram
    participant Pipeline
    participant ModelService
    participant ContentGen
    participant GeminiAPI
    participant TTS
    participant GoogleTTS
    participant AzureTTS
    participant AudioProc
    participant S3
    participant SessionService

    Pipeline->>ModelService: Get generation parameters
    ModelService-->>Pipeline: Model parameters
    Pipeline->>ContentGen: Generate text
    ContentGen->>GeminiAPI: POST /v1beta/models/gemini-1.5-pro:generateContent
    alt Gemini Success
        GeminiAPI-->>ContentGen: Generated text
        ContentGen-->>Pipeline: Text content
    else Gemini Failure
        GeminiAPI-->>ContentGen: Error
        ContentGen-->>Pipeline: Generation failed
        Pipeline-->>Pipeline: Return error to API
    end
    Pipeline->>TTS: Synthesize speech
    TTS->>GoogleTTS: POST /text:synthesize
    alt Google TTS Success
        GoogleTTS-->>TTS: Audio file
        TTS-->>Pipeline: Audio data
    else Google TTS Failure
        GoogleTTS-->>TTS: Error
        TTS->>AzureTTS: Fallback: POST /cognitiveservices/v1
        alt Azure TTS Success
            AzureTTS-->>TTS: Audio file
            TTS-->>Pipeline: Audio data
        else Azure TTS Failure
            AzureTTS-->>TTS: Error
            TTS-->>Pipeline: TTS failed
            Pipeline-->>Pipeline: Return error to API
        end
    end
    Pipeline->>AudioProc: Process and store audio
    AudioProc->>S3: Upload audio file
    alt S3 Success
        S3-->>AudioProc: Audio URL
        AudioProc->>AudioProc: Generate CDN URL
        AudioProc-->>Pipeline: Audio URL (CDN)
    else S3 Failure
        S3-->>AudioProc: Error
        AudioProc-->>Pipeline: Storage failed
        Pipeline-->>Pipeline: Return error to API
    end
    Pipeline->>SessionService: Store content metadata
    SessionService-->>Pipeline: Stored
    Pipeline-->>Pipeline: Return success with Content object
```

---

