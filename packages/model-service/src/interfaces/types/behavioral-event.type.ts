/**
 * Behavioral Event Type
 * 
 * Behavioral event tracking according to foundation model's measurement framework.
 * Used as input to model service for signal interpretation and adaptation.
 */

/**
 * Behavioral event types according to model measurement framework.
 */
export type BehavioralEventType =
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
  | 'unlike';

/**
 * Content characteristics for behavioral event analysis.
 */
export interface ContentCharacteristics {
  format: string;
  genre: string | null;
  difficulty: string;
  templateId: string;
  topic?: string | null;
  tags?: string[];
}

/**
 * Behavioral event for model service signal interpretation.
 */
export interface BehavioralEvent {
  id: string;
  contentId: string;
  eventType: BehavioralEventType;
  timestamp: Date;
  playbackPosition: number;
  playbackPositionPercent: number;
  duration: number;
  sessionId: string;
  contentCharacteristics: ContentCharacteristics;
}
