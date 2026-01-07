/**
 * Learner State Interface (v1)
 * 
 * Model-based learner state representation.
 * Tracks probabilistic competence estimates, preferences, and difficulty
 * according to foundation model principles.
 */

/**
 * Learner state representation according to model principles.
 * Maintains probabilistic model of what learner understands, partially understands,
 * and what is unstable or mis-generalized.
 */
export interface LearnerState {
  /**
   * Preference weights: Model-inferred preference scores.
   * Weights for different formats and genres.
   */
  preferenceWeights: PreferenceWeights;

  /**
   * Comprehension level: Inferred comprehension level (0-1 scale).
   * Model-calculated estimate of learner's comprehension ability.
   */
  comprehensionLevel: number;

  /**
   * Content type preferences: Format/genre preference scores.
   * Detailed preference scores for different content types.
   */
  contentTypePreferences: ContentTypePreferences;

  /**
   * Difficulty adjustment: Model-calculated difficulty adjustment.
   * Positive = increase difficulty, negative = decrease difficulty.
   */
  difficultyAdjustment: number;

  /**
   * Last updated: Timestamp of last state update.
   */
  lastUpdated: Date;

  /**
   * Data points: Number of behavioral signals processed.
   * Tracks how much data has informed this state.
   */
  dataPoints: number;
}

/**
 * Preference weights for different content formats and genres.
 * Model-inferred scores based on behavioral signals.
 */
export interface PreferenceWeights {
  /**
   * Format preferences: Scores for narrative, podcast, educational.
   */
  narrative: number;
  podcast: number;
  educational: number;

  /**
   * Genre preferences: Dynamic scores for different genres.
   * Key = genre identifier, value = preference score.
   */
  [genre: string]: number;
}

/**
 * Content type preferences: Detailed preference scores.
 * Provides format, genre, and difficulty preference scores.
 */
export interface ContentTypePreferences {
  /**
   * Format scores: Preference scores for different formats.
   * Key = format identifier, value = preference score.
   */
  formatScores: Record<string, number>;

  /**
   * Genre scores: Preference scores for different genres.
   * Key = genre identifier, value = preference score.
   */
  genreScores: Record<string, number>;

  /**
   * Difficulty scores: Preference scores for different difficulty levels.
   * Key = difficulty identifier, value = preference score.
   */
  difficultyScores: Record<string, number>;
}
