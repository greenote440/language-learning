# Data Models


Core data models/entities shared between frontend and backend. These TypeScript interfaces will be defined in `packages/shared` for type safety across the entire stack.

## Content

**Purpose:** Represents generated Italian audio content (episodes, narratives, podcasts, educational content) with all metadata needed for playback, adaptation, and model validation. Includes comprehensive metadata for post-MVP features.

**Key Attributes:**
- `id`: string - Unique content identifier
- `title`: string - Content title/name
- `description`: string | null - Content description/summary (post-MVP)
- `textContent`: string - Original generated Italian text
- `audioUrl`: string - URL to audio file (S3/CDN)
- `audioFormat`: 'mp3' | 'ogg' | 'wav' - Audio file format
- `audioBitrate`: number - Audio bitrate in kbps
- `audioSize`: number - Audio file size in bytes
- `format`: 'narrative' | 'podcast' | 'educational' - Content format type
- `genre`: string | null - Narrative genre (if narrative format)
- `subGenre`: string | null - Sub-genre classification (post-MVP)
- `topic`: string | null - Content topic/subject matter
- `tags`: string[] - Content tags for categorization and search (post-MVP)
- `templateId`: string - Template identifier used for generation
- `templateVersion`: string - Template version for tracking
- `difficulty`: 'lexical-heavy' | 'discourse-heavy' - Model-informed difficulty level
- `difficultyScore`: number - Numeric difficulty score (0-1, post-MVP)
- `estimatedComprehensionLevel`: string | null - Model-estimated comprehension level needed (post-MVP)
- `duration`: number - Audio duration in seconds
- `wordCount`: number - Approximate word count in text
- `modelParameters`: ModelParameters - Model service parameters used for generation
- `generatedAt`: Date - Generation timestamp
- `generatedBy`: string - Generation service/version identifier
- `sessionId`: string - Session identifier for backward navigation
- `episodeNumber`: number | null - Episode number (for serial narratives)
- `seriesId`: string | null - Series identifier for grouping episodes (post-MVP)
- `continuityContext`: string | null - Narrative continuity context from previous episodes
- `relatedContentIds`: string[] - Related content identifiers (post-MVP)
- `language`: string - Language code (default: 'it' for Italian)
- `locale`: string | null - Regional variant (e.g., 'it-IT', 'it-CH', post-MVP)
- `qualityScore`: number | null - Content quality score from validation (post-MVP)
- `engagementMetrics`: EngagementMetrics | null - Aggregated engagement data (post-MVP)
- `metadata`: Record<string, any> - Flexible metadata for future extensions

**TypeScript Interface:**
```typescript
interface Content {
  id: string;
  title: string;
  description: string | null;
  textContent: string;
  audioUrl: string;
  audioFormat: 'mp3' | 'ogg' | 'wav';
  audioBitrate: number;
  audioSize: number;
  format: 'narrative' | 'podcast' | 'educational';
  genre: string | null;
  subGenre: string | null;
  topic: string | null;
  tags: string[];
  templateId: string;
  templateVersion: string;
  difficulty: 'lexical-heavy' | 'discourse-heavy';
  difficultyScore: number;
  estimatedComprehensionLevel: string | null;
  duration: number;
  wordCount: number;
  modelParameters: ModelParameters;
  generatedAt: Date;
  generatedBy: string;
  sessionId: string;
  episodeNumber: number | null;
  seriesId: string | null;
  continuityContext: string | null;
  relatedContentIds: string[];
  language: string;
  locale: string | null;
  qualityScore: number | null;
  engagementMetrics: EngagementMetrics | null;
  metadata: Record<string, any>;
}

interface ModelParameters {
  lexicalNoveltyBudget: number;
  constructionSets: string[];
  variationPattern: string;
  comprehensibilityTarget: number;
  semanticStability: number;
  discourseComplexity?: number; // post-MVP
  vocabularyLevel?: string; // post-MVP
  grammarComplexity?: number; // post-MVP
}

interface EngagementMetrics {
  totalPlays: number;
  totalCompletions: number;
  averageCompletionRate: number;
  averageListeningDuration: number;
  likeCount: number;
  skipRate: number;
  replayRate: number;
  lastEngagedAt: Date | null;
}
```

**Relationships:**
- One Content can have many BehavioralEvents (listening behavior tracked)
- One Content can have one LikeEngagement (user like status)
- Many Content items belong to one Session (session-based organization)
- One Content can reference many related Content items (via relatedContentIds, post-MVP)
- Many Content items can belong to one Series (via seriesId, post-MVP)
- **Note:** User model deferred to post-MVP authentication phase

## User Preferences

**Purpose:** Stores user preferences for difficulty, content format preferences, and other settings. Persisted in localStorage for MVP, designed for future database migration.

**Key Attributes:**
- `difficultyPreference`: 'beginner' | 'intermediate' | 'advanced' - User-selected difficulty
- `preferredFormats`: ('narrative' | 'podcast' | 'educational')[] - Format preferences
- `preferredGenres`: string[] - Genre preferences (for narratives)
- `playbackSpeed`: number - Audio playback speed multiplier (default: 1.0)
- `autoPlay`: boolean - Auto-play on content load
- `lastUpdated`: Date - Last preference update timestamp
- `version`: number - Data structure version for migration

**TypeScript Interface:**
```typescript
interface UserPreferences {
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced';
  preferredFormats: ('narrative' | 'podcast' | 'educational')[];
  preferredGenres: string[];
  playbackSpeed: number;
  autoPlay: boolean;
  lastUpdated: Date;
  version: number;
}
```

**Relationships:**
- One UserPreferences influences many Content generation requests (preferences passed to model service)
- One UserPreferences influences LearnerModelState (preferences inform baseline learner state)

## Behavioral Event

**Purpose:** Tracks passive user listening behavior according to the foundation model's measurement framework. Collected in real-time during playback. Designed to be comprehensive and post-MVP ready.

**Key Attributes:**
- `id`: string - Unique event identifier
- `contentId`: string - Associated content identifier
- `eventType`: BehavioralEventType - Granular event type classification
- `timestamp`: Date - Event timestamp (millisecond precision)
- `playbackPosition`: number - Playback position in seconds at event time
- `playbackPositionPercent`: number - Playback position as percentage (0-100)
- `duration`: number - Event duration in seconds (for pause, replay events)
- `sessionId`: string - Session identifier
- `contentCharacteristics`: ContentCharacteristics - Content metadata for pattern analysis
- `deviceInfo`: DeviceInfo | null - Device/browser information (post-MVP)
- `networkType`: string | null - Network connection type (post-MVP)
- `context`: EventContext - Additional context about the event

**TypeScript Interface:**
```typescript
interface BehavioralEvent {
  id: string;
  contentId: string;
  eventType: BehavioralEventType;
  timestamp: Date;
  playbackPosition: number;
  playbackPositionPercent: number;
  duration: number;
  sessionId: string;
  contentCharacteristics: ContentCharacteristics;
  deviceInfo: DeviceInfo | null;
  networkType: string | null;
  context: EventContext;
}

type BehavioralEventType =
  // Playback control events
  | 'play'
  | 'pause'
  | 'resume'
  | 'stop'
  // Navigation events
  | 'skip-forward'
  | 'skip-backward'
  | 'seek-forward'
  | 'seek-backward'
  | 'seek-to-position'
  // Replay events
  | 'replay-segment'
  | 'replay-full'
  | 'replay-from-position'
  // Completion events
  | 'complete'
  | 'complete-with-replay'
  | 'abandon'
  | 'abandon-early' // < 25% completion
  | 'abandon-mid' // 25-75% completion
  | 'abandon-late' // > 75% completion
  // Engagement events
  | 'like'
  | 'unlike'
  | 'share' // post-MVP
  | 'bookmark' // post-MVP
  // Quality/technical events
  | 'buffering-start'
  | 'buffering-end'
  | 'error-audio-load'
  | 'error-playback'
  | 'quality-change' // post-MVP
  // Interaction events
  | 'speed-change'
  | 'volume-change'
  | 'background-play' // App in background
  | 'foreground-play' // App in foreground
  // Model validation events
  | 'comprehension-report' // post-MVP explicit feedback
  | 'difficulty-feedback'; // post-MVP explicit feedback

interface EventContext {
  previousEventType?: BehavioralEventType;
  timeSinceLastEvent?: number;
  consecutiveSkips?: number;
  totalReplays?: number;
  playbackSpeed?: number;
  volumeLevel?: number;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  isMobile: boolean;
  isTablet: boolean;
}

interface ContentCharacteristics {
  format: string;
  genre: string | null;
  difficulty: string;
  templateId: string;
  topic?: string | null; // post-MVP
  tags?: string[]; // post-MVP
}
```

**Relationships:**
- Many BehavioralEvents belong to one Content (multiple events per content item)
- Many BehavioralEvents belong to one Session (session-based tracking)
- BehavioralEvents inform LearnerModelState (signals processed for comprehension inference)

## Like Engagement

**Purpose:** Tracks user likes (Instagram-style) for content items. Quick engagement feedback that informs model-driven adaptation. Extended for post-MVP features.

**Key Attributes:**
- `contentId`: string - Associated content identifier
- `liked`: boolean - Like status
- `likedAt`: Date | null - Like timestamp
- `unlikedAt`: Date | null - Unlike timestamp (post-MVP)
- `sessionId`: string - Session identifier
- `contentCharacteristics`: ContentCharacteristics - Content metadata for pattern analysis
- `reactionType`: 'like' | 'love' | 'favorite' | null - Extended reaction types (post-MVP)

**TypeScript Interface:**
```typescript
interface LikeEngagement {
  contentId: string;
  liked: boolean;
  likedAt: Date | null;
  unlikedAt: Date | null;
  sessionId: string;
  contentCharacteristics: ContentCharacteristics;
  reactionType: 'like' | 'love' | 'favorite' | null;
}
```

**Relationships:**
- One LikeEngagement belongs to one Content (one like status per content)
- LikeEngagement informs LearnerModelState (likes influence preference weights)

## Learner Model State

**Purpose:** Represents inferred user comprehension and preferences based on behavioral signals and model principles. Maintained by Model Service according to foundation model's learner state representation.

**Key Attributes:**
- `preferenceWeights`: PreferenceWeights - Model-inferred preference scores
- `comprehensionLevel`: number - Inferred comprehension level (0-1 scale)
- `contentTypePreferences`: ContentTypePreferences - Format/genre preference scores
- `difficultyAdjustment`: number - Model-calculated difficulty adjustment
- `lastUpdated`: Date - Last model update timestamp
- `dataPoints`: number - Number of behavioral signals processed

**TypeScript Interface:**
```typescript
interface LearnerModelState {
  preferenceWeights: PreferenceWeights;
  comprehensionLevel: number;
  contentTypePreferences: ContentTypePreferences;
  difficultyAdjustment: number;
  lastUpdated: Date;
  dataPoints: number;
}

interface PreferenceWeights {
  narrative: number;
  podcast: number;
  educational: number;
  [genre: string]: number;
}

interface ContentTypePreferences {
  formatScores: Record<string, number>;
  genreScores: Record<string, number>;
  difficultyScores: Record<string, number>;
}
```

**Relationships:**
- LearnerModelState is informed by many BehavioralEvents (signals processed)
- LearnerModelState is informed by many LikeEngagement items (likes influence preferences)
- LearnerModelState influences Content generation (adaptation decisions)

## Session

**Purpose:** Tracks user sessions for content organization and backward navigation. Session-based content storage enables scrolling backward through session history.

**Key Attributes:**
- `id`: string - Unique session identifier
- `startedAt`: Date - Session start timestamp
- `lastActivityAt`: Date - Last activity timestamp
- `contentIds`: string[] - Ordered list of content IDs in session
- `currentContentId`: string | null - Currently playing content
- `totalListeningTime`: number - Total listening time in seconds

**TypeScript Interface:**
```typescript
interface Session {
  id: string;
  startedAt: Date;
  lastActivityAt: Date;
  contentIds: string[];
  currentContentId: string | null;
  totalListeningTime: number;
}
```

**Relationships:**
- One Session contains many Content items (session-based content organization)
- One Session has many BehavioralEvents (events tracked per session)
- One Session has many LikeEngagement items (likes tracked per session)

---

