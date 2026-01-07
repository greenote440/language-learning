/**
 * Signal Interpretation Interface (v1)
 * 
 * Model framework for interpreting behavioral signals.
 * Converts raw behavioral events into model-informed insights
 * about comprehension, preferences, and engagement.
 */

import { PreferenceWeights, ContentTypePreferences } from './learner-state.interface';

/**
 * Signal interpretation from behavioral events and like engagement.
 * Provides model-informed insights about learner comprehension and preferences.
 */
export interface SignalInterpretation {
  /**
   * Comprehension level: Inferred comprehension level (0-1 scale).
   * Model-calculated estimate of learner's comprehension ability.
   * Higher = better comprehension, lower = struggling
   */
  comprehensionLevel: number;

  /**
   * Preference weights: Model-inferred preference scores.
   * Weights for different formats and genres based on behavioral signals.
   */
  preferenceWeights: PreferenceWeights;

  /**
   * Content type preferences: Format/genre preference scores.
   * Detailed preference scores for different content types.
   */
  contentTypePreferences: ContentTypePreferences;
}
