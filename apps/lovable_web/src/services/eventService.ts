// Behavioral Event Tracking Service
// Tracks user audio playback behavior for model-driven adaptation

export type BehavioralEventType =
  | 'play'
  | 'pause'
  | 'skip-forward'
  | 'skip-backward'
  | 'complete'
  | 'abandon'
  | 'content-switch';

export interface BehavioralEvent {
  id: string;
  contentId: string;
  eventType: BehavioralEventType;
  timestamp: Date;
  playbackPosition: number;
  playbackPositionPercent: number;
  sessionId: string;
  contentCharacteristics?: {
    format?: string;
    title?: string;
  };
}

const STORAGE_KEY = 'behavioral-events-queue';
const MAX_EVENTS_IN_MEMORY = 100;

class EventService {
  private events: BehavioralEvent[] = [];
  private sessionId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  // Initialize with session ID
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  // Track an event
  trackEvent(
    contentId: string,
    eventType: BehavioralEventType,
    playbackPosition: number,
    duration: number,
    contentCharacteristics?: { format?: string; title?: string }
  ): void {
    if (!this.sessionId) {
      console.warn('EventService: No session ID set, skipping event tracking');
      return;
    }

    const playbackPositionPercent = duration > 0 
      ? Math.round((playbackPosition / duration) * 100) 
      : 0;

    const event: BehavioralEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      contentId,
      eventType,
      timestamp: new Date(),
      playbackPosition,
      playbackPositionPercent,
      sessionId: this.sessionId,
      contentCharacteristics,
    };

    this.events.push(event);

    // Limit memory usage
    if (this.events.length > MAX_EVENTS_IN_MEMORY) {
      this.events = this.events.slice(-MAX_EVENTS_IN_MEMORY);
    }

    // Save to storage
    this.saveToStorage();
  }

  // Track playback position update (throttled)
  private lastPositionUpdate: number = 0;
  private positionUpdateThrottle: number = 5000; // 5 seconds

  trackPositionUpdate(
    contentId: string,
    playbackPosition: number,
    duration: number,
    contentCharacteristics?: { format?: string; title?: string }
  ): void {
    const now = Date.now();
    // Throttle position updates to avoid excessive events
    if (now - this.lastPositionUpdate < this.positionUpdateThrottle) {
      return;
    }
    this.lastPositionUpdate = now;

    // Position updates are tracked as implicit progress markers
    // Not stored as separate events, but can be used for analytics
    // For now, we'll track significant milestones (25%, 50%, 75%)
    const percent = duration > 0 ? (playbackPosition / duration) * 100 : 0;
    const milestones = [25, 50, 75];
    const nearestMilestone = milestones.find(
      (m) => percent >= m && percent < m + 5
    );

    // Only track milestone positions
    // Full position tracking would be done server-side or batched
  }

  // Get all events (for batch upload)
  getEvents(): BehavioralEvent[] {
    return [...this.events];
  }

  // Clear events (after successful upload)
  clearEvents(): void {
    this.events = [];
    this.saveToStorage();
  }

  // Get events count
  getEventCount(): number {
    return this.events.length;
  }

  // Save to localStorage
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(
        this.events.map((e) => ({
          ...e,
          timestamp: e.timestamp.toISOString(),
        }))
      );
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save events to storage:', error);
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.events = parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load events from storage:', error);
      this.events = [];
    }
  }

  // TODO: Upload events to API (future story)
  async uploadEvents(): Promise<void> {
    // Placeholder for future API integration
    // POST /api/events/batch
    console.log(`Would upload ${this.events.length} events to API`);
  }
}

// Singleton instance
export const eventService = new EventService();
