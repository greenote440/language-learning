/**
 * User Preferences Type
 * 
 * User preferences for difficulty, content formats, and settings.
 * Used as input to model service for generation parameters and adaptation.
 */

/**
 * User preferences for content generation and adaptation.
 */
export interface UserPreferences {
  /**
   * Difficulty preference: User-selected difficulty level.
   */
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced';

  /**
   * Preferred formats: Content format preferences.
   */
  preferredFormats: ('narrative' | 'podcast' | 'educational')[];

  /**
   * Preferred genres: Genre preferences (for narratives).
   */
  preferredGenres: string[];

  /**
   * Playback speed: Audio playback speed multiplier.
   */
  playbackSpeed: number;

  /**
   * Auto-play: Auto-play on content load.
   */
  autoPlay: boolean;
}
