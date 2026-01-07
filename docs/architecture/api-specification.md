# API Specification


REST API specification using OpenAPI 3.0. All endpoints follow RESTful conventions with JSON request/response bodies.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Adaptive Italian Audio API
  version: 1.0.0
  description: REST API for Adaptive Italian Audio application. Supports model-driven content generation, behavioral tracking, and adaptation.
servers:
  - url: https://api.adaptive-italian-audio.railway.app
    description: Production server
  - url: http://localhost:3001
    description: Local development server

paths:
  # Content Generation Endpoints
  /api/content/generate:
    post:
      summary: Generate new Italian audio content
      description: Triggers model-driven content generation pipeline. Returns generation status immediately, content available via polling or webhook notification.
      operationId: generateContent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - sessionId
              properties:
                sessionId:
                  type: string
                  description: Current session identifier
                webhookUrl:
                  type: string
                  format: uri
                  description: Optional webhook URL for generation completion notification
                userPreferences:
                  $ref: '#/components/schemas/UserPreferences'
                adaptationSignals:
                  type: object
                  description: Model-driven adaptation signals from learner model
                  properties:
                    preferredFormats:
                      type: array
                      items:
                        type: string
                        enum: [narrative, podcast, educational]
                    preferredGenres:
                      type: array
                      items:
                        type: string
                    difficultyAdjustment:
                      type: number
                      description: Model-calculated difficulty adjustment
                continuityContext:
                  type: object
                  description: Previous episode context for serial narratives
                  properties:
                    previousEpisodeId:
                      type: string
                    episodeNumber:
                      type: number
                    storylineContext:
                      type: string
      responses:
        '202':
          description: Content generation initiated
          content:
            application/json:
              schema:
                type: object
                properties:
                  generationId:
                    type: string
                  status:
                    type: string
                    enum: [generating, processing, completed, failed]
                  estimatedCompletionTime:
                    type: number
                    description: Estimated seconds until completion
                  webhookRegistered:
                    type: boolean
                    description: Whether webhook notification will be sent
        '400':
          $ref: '#/components/responses/BadRequest'
        '429':
          $ref: '#/components/responses/RateLimitExceeded'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /api/content/{contentId}:
    get:
      summary: Retrieve generated content
      description: Get content metadata and audio URL by content ID
      operationId: getContent
      parameters:
        - name: contentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Content retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Content'
        '404':
          $ref: '#/components/responses/NotFound'

  /api/content/{generationId}/status:
    get:
      summary: Check content generation status
      description: Poll generation status. Returns content when completed.
      operationId: getGenerationStatus
      parameters:
        - name: generationId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Generation status
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    enum: [generating, processing, completed, failed]
                  content:
                    $ref: '#/components/schemas/Content'
                  error:
                    type: string
        '404':
          $ref: '#/components/responses/NotFound'

  # Session Management Endpoints
  /api/sessions:
    post:
      summary: Create new session
      description: Initialize a new listening session
      operationId: createSession
      responses:
        '201':
          description: Session created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'
    get:
      summary: Get current session
      description: Retrieve session by session ID (from query or header)
      operationId: getSession
      parameters:
        - name: sessionId
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Session retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'
        '404':
          $ref: '#/components/responses/NotFound'

  /api/sessions/{sessionId}:
    get:
      summary: Get session by ID
      operationId: getSessionById
      parameters:
        - name: sessionId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Session retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'
        '404':
          $ref: '#/components/responses/NotFound'
    patch:
      summary: Update session
      description: Update session metadata (e.g., current content, listening time)
      operationId: updateSession
      parameters:
        - name: sessionId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                currentContentId:
                  type: string
                totalListeningTime:
                  type: number
      responses:
        '200':
          description: Session updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Session'

  # Behavioral Tracking Endpoints
  /api/events:
    post:
      summary: Track behavioral event
      description: Record user behavioral event (play, pause, skip, etc.)
      operationId: trackEvent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BehavioralEvent'
      responses:
        '201':
          description: Event recorded
          content:
            application/json:
              schema:
                type: object
                properties:
                  eventId:
                    type: string
                  recorded:
                    type: boolean
        '400':
          $ref: '#/components/responses/BadRequest'

  /api/events/batch:
    post:
      summary: Track multiple behavioral events
      description: Batch upload of behavioral events for efficiency
      operationId: trackEventsBatch
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                events:
                  type: array
                  items:
                    $ref: '#/components/schemas/BehavioralEvent'
      responses:
        '201':
          description: Events recorded
          content:
            application/json:
              schema:
                type: object
                properties:
                  recorded:
                    type: number
                    description: Number of events successfully recorded
                  failed:
                    type: number

  # Like/Engagement Endpoints
  /api/content/{contentId}/like:
    post:
      summary: Like content
      description: Record like engagement for content
      operationId: likeContent
      parameters:
        - name: contentId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - sessionId
              properties:
                sessionId:
                  type: string
                reactionType:
                  type: string
                  enum: [like, love, favorite]
                  default: like
      responses:
        '200':
          description: Like recorded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LikeEngagement'
    delete:
      summary: Unlike content
      description: Remove like engagement
      operationId: unlikeContent
      parameters:
        - name: contentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Unlike recorded
        '404':
          $ref: '#/components/responses/NotFound'

  # User Preferences Endpoints (MVP uses localStorage, but API ready for post-MVP)
  /api/preferences:
    get:
      summary: Get user preferences
      description: Retrieve user preferences (post-MVP with authentication)
      operationId: getPreferences
      responses:
        '200':
          description: Preferences retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserPreferences'
        '401':
          $ref: '#/components/responses/Unauthorized'
    put:
      summary: Update user preferences
      description: Update user preferences (post-MVP with authentication)
      operationId: updatePreferences
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserPreferences'
      responses:
        '200':
          description: Preferences updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserPreferences'
        '401':
          $ref: '#/components/responses/Unauthorized'

  # Model Service Endpoints (Internal, but exposed for adaptation)
  /api/model/adaptation:
    post:
      summary: Get model-driven adaptation recommendations
      description: Request adaptation signals based on behavioral data and learner model
      operationId: getAdaptationRecommendations
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                recentEvents:
                  type: array
                  items:
                    $ref: '#/components/schemas/BehavioralEvent'
                recentLikes:
                  type: array
                  items:
                    $ref: '#/components/schemas/LikeEngagement'
                userPreferences:
                  $ref: '#/components/schemas/UserPreferences'
      responses:
        '200':
          description: Adaptation recommendations
          content:
            application/json:
              schema:
                type: object
                properties:
                  recommendedFormats:
                    type: array
                    items:
                      type: string
                  recommendedGenres:
                    type: array
                    items:
                      type: string
                  difficultyAdjustment:
                    type: number
                  templateRecommendations:
                    type: array
                    items:
                      type: string

  # Analytics Endpoints (Post-MVP, but structure defined)
  /api/analytics/session/{sessionId}:
    get:
      summary: Get session analytics
      description: Retrieve aggregated analytics for a session (post-MVP)
      operationId: getSessionAnalytics
      parameters:
        - name: sessionId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Analytics retrieved
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalListeningTime:
                    type: number
                  contentCompleted:
                    type: number
                  averageCompletionRate:
                    type: number
                  preferredFormats:
                    type: array
                    items:
                      type: string

components:
  schemas:
    Content:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: string
          nullable: true
        textContent:
          type: string
        audioUrl:
          type: string
        format:
          type: string
          enum: [narrative, podcast, educational]
        genre:
          type: string
          nullable: true
        difficulty:
          type: string
          enum: [lexical-heavy, discourse-heavy]
        duration:
          type: number
        modelParameters:
          $ref: '#/components/schemas/ModelParameters'
        generatedAt:
          type: string
          format: date-time
        sessionId:
          type: string
        episodeNumber:
          type: number
          nullable: true
      required:
        - id
        - title
        - textContent
        - audioUrl
        - format
        - difficulty
        - duration
        - sessionId

    ModelParameters:
      type: object
      properties:
        lexicalNoveltyBudget:
          type: number
        constructionSets:
          type: array
          items:
            type: string
        variationPattern:
          type: string
        comprehensibilityTarget:
          type: number
        semanticStability:
          type: number

    UserPreferences:
      type: object
      properties:
        difficultyPreference:
          type: string
          enum: [beginner, intermediate, advanced]
        preferredFormats:
          type: array
          items:
            type: string
            enum: [narrative, podcast, educational]
        preferredGenres:
          type: array
          items:
            type: string
        playbackSpeed:
          type: number
        autoPlay:
          type: boolean

    BehavioralEvent:
      type: object
      properties:
        id:
          type: string
        contentId:
          type: string
        eventType:
          type: string
          enum: [play, pause, resume, stop, skip-forward, skip-backward, replay-segment, complete, abandon]
        timestamp:
          type: string
          format: date-time
        playbackPosition:
          type: number
        sessionId:
          type: string
        contentCharacteristics:
          $ref: '#/components/schemas/ContentCharacteristics'
      required:
        - contentId
        - eventType
        - timestamp
        - playbackPosition
        - sessionId

    ContentCharacteristics:
      type: object
      properties:
        format:
          type: string
        genre:
          type: string
          nullable: true
        difficulty:
          type: string
        templateId:
          type: string

    LikeEngagement:
      type: object
      properties:
        contentId:
          type: string
        liked:
          type: boolean
        likedAt:
          type: string
          format: date-time
          nullable: true
        sessionId:
          type: string
        reactionType:
          type: string
          enum: [like, love, favorite]
          nullable: true

    Session:
      type: object
      properties:
        id:
          type: string
        startedAt:
          type: string
          format: date-time
        lastActivityAt:
          type: string
          format: date-time
        contentIds:
          type: array
          items:
            type: string
        currentContentId:
          type: string
          nullable: true
        totalListeningTime:
          type: number

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Unauthorized (post-MVP with authentication)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    RateLimitExceeded:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string

    WebhookPayload:
      type: object
      description: Payload sent to webhook URL when content generation completes
      properties:
        generationId:
          type: string
        status:
          type: string
          enum: [completed, failed]
        content:
          $ref: '#/components/schemas/Content'
          nullable: true
        error:
          type: string
          nullable: true
          description: Error message when status is 'failed'
        timestamp:
          type: string
          format: date-time
      required:
        - generationId
        - status
        - timestamp
```

## API Design Decisions

**Asynchronous Content Generation:**
- POST `/api/content/generate` returns 202 Accepted with generation ID
- Status polling via GET `/api/content/{generationId}/status`
- Webhook notifications: Optional webhook URL in request, POST notification sent to webhook URL when generation completes or fails
- Webhook payload includes generation ID, status, and full Content object when completed
- Webhook retries: 3 retries with exponential backoff on failure (10 second timeout)
- Non-blocking design supports long-running generation pipeline

**Session-Based Architecture:**
- Sessions managed via REST endpoints
- Session ID passed in requests (query param or header)
- Enables session-based content organization and backward navigation

**Batch Event Tracking:**
- POST `/api/events/batch` for efficient bulk event upload
- Reduces API calls for high-frequency events
- Supports offline event queuing

**Model Service Integration:**
- POST `/api/model/adaptation` exposes adaptation recommendations
- Frontend can request adaptation signals before content generation
- Model service remains internal but accessible via API

**Error Handling:**
- Standardized error response format
- Includes error code, message, details, timestamp, and request ID
- Supports debugging and monitoring

**Authentication:**
- MVP: No authentication (session-based)
- Post-MVP: Endpoints ready for authentication headers
- Preferences endpoints marked for post-MVP authentication

**API Simplicity:**
- No pagination: Session-based content organization doesn't require pagination
- No filtering/sorting: Simple API design for MVP, content retrieved by ID or session
- Webhook support: Optional webhook URL for generation completion notifications

---

