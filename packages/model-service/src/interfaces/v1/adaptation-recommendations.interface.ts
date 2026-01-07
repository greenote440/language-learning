/**
 * Adaptation Recommendations Interface (v1)
 * 
 * Model-informed recommendations for content adaptation.
 * Provides format, genre, difficulty, and template recommendations
 * based on learner state and behavioral signals.
 */

/**
 * Adaptation recommendations from model service.
 * Guides content selection and generation to match learner needs.
 */
export interface AdaptationRecommendations {
  /**
   * Recommended content formats.
   * Array of format identifiers prioritized by model predictions.
   * Example: ['narrative', 'podcast', 'educational']
   */
  recommendedFormats: string[];

  /**
   * Recommended genres (for narrative format).
   * Array of genre identifiers prioritized by model predictions.
   * Example: ['adventure', 'mystery', 'romance']
   */
  recommendedGenres: string[];

  /**
   * Difficulty adjustment: Model-calculated difficulty adjustment.
   * Positive = increase difficulty, negative = decrease difficulty.
   * Range typically -1.0 to +1.0, where 0 = no change.
   */
  difficultyAdjustment: number;

  /**
   * Template recommendations: Content template identifiers.
   * Suggests which templates to use for generation.
   * Example: ['narrative-adventure-v1', 'podcast-dialogue-v1']
   */
  templateRecommendations: string[];
}
