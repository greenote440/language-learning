/**
 * Adaptation Engine Module
 * 
 * Implements model-informed adaptation logic.
 * Applies foundation model principles: prediction under uncertainty,
 * meaning anchoring, comprehension margin, non-linear acquisition.
 */

import { AdaptationRecommendations } from '../interfaces/v1/adaptation-recommendations.interface';
import { LearnerState } from '../interfaces/v1/learner-state.interface';
import { BehavioralEvent } from '../interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../interfaces/types/like-engagement.type';
import { UserPreferences } from '../interfaces/types/user-preferences.type';

/**
 * Get adaptation recommendations based on behavioral signals and learner state.
 * 
 * Implements:
 * - Difficulty adjustment calculation (model predictions about optimal input characteristics)
 * - Content selection logic (format/genre recommendations based on learner state)
 * - Lexical-heavy vs. discourse-heavy difficulty determination
 * 
 * Model principles:
 * - Prediction under uncertainty: Model operates with probabilistic predictions
 * - Meaning anchoring: Adaptation preserves semantic accessibility
 * - Comprehension margin: Adjusts to maintain i+ε zone
 * 
 * @param recentEvents - Recent behavioral events
 * @param recentLikes - Recent like engagement data
 * @param userPreferences - User preferences
 * @param currentLearnerState - Current learner state (optional)
 * @returns Adaptation recommendations
 */
export function getAdaptationRecommendations(
  recentEvents: BehavioralEvent[],
  recentLikes: LikeEngagement[],
  userPreferences: UserPreferences,
  currentLearnerState?: LearnerState
): AdaptationRecommendations {
  // Analyze behavioral signals for comprehension indicators
  const comprehensionSignals = analyzeComprehensionSignals(recentEvents);
  
  // Analyze like engagement for preference signals
  const preferenceSignals = analyzePreferenceSignals(recentLikes);

  // Calculate difficulty adjustment
  // Model principle: Prediction under uncertainty - probabilistic adjustment
  const difficultyAdjustment = calculateDifficultyAdjustment(
    comprehensionSignals,
    currentLearnerState,
    userPreferences.difficultyPreference
  );

  // Determine recommended formats
  // Model principle: Content selection based on learner state and preferences
  const recommendedFormats = determineRecommendedFormats(
    userPreferences.preferredFormats,
    preferenceSignals,
    currentLearnerState
  );

  // Determine recommended genres
  const recommendedGenres = determineRecommendedGenres(
    userPreferences.preferredGenres,
    preferenceSignals,
    currentLearnerState
  );

  // Determine template recommendations
  const templateRecommendations = determineTemplateRecommendations(
    recommendedFormats,
    recommendedGenres,
    difficultyAdjustment
  );

  return {
    recommendedFormats,
    recommendedGenres,
    difficultyAdjustment,
    templateRecommendations,
  };
}

/**
 * Comprehension signals from behavioral events.
 */
interface ComprehensionSignals {
  completionRate: number;
  abandonmentRate: number;
  replayRate: number;
  skipRate: number;
  averageCompletionPercent: number;
  earlyAbandonmentRate: number;
}

/**
 * Analyze behavioral events for comprehension indicators.
 * Model principle: Behavioral signals indicate comprehension level.
 */
function analyzeComprehensionSignals(
  events: BehavioralEvent[]
): ComprehensionSignals {
  if (events.length === 0) {
    return {
      completionRate: 0,
      abandonmentRate: 0,
      replayRate: 0,
      skipRate: 0,
      averageCompletionPercent: 0,
      earlyAbandonmentRate: 0,
    };
  }

  const completions = events.filter((e) => e.eventType === 'complete').length;
  const abandonments = events.filter((e) => e.eventType.startsWith('abandon')).length;
  const replays = events.filter((e) => e.eventType.startsWith('replay')).length;
  const skips = events.filter((e) => e.eventType.includes('skip')).length;
  const earlyAbandons = events.filter((e) => e.eventType === 'abandon-early').length;

  const contentIds = new Set(events.map((e) => e.contentId));
  const totalContent = contentIds.size;

  const completionPercentages = events
    .filter((e) => e.eventType === 'complete' || e.eventType.startsWith('abandon'))
    .map((e) => e.playbackPositionPercent);

  const averageCompletionPercent =
    completionPercentages.length > 0
      ? completionPercentages.reduce((a, b) => a + b, 0) / completionPercentages.length
      : 0;

  return {
    completionRate: totalContent > 0 ? completions / totalContent : 0,
    abandonmentRate: totalContent > 0 ? abandonments / totalContent : 0,
    replayRate: events.length > 0 ? replays / events.length : 0,
    skipRate: events.length > 0 ? skips / events.length : 0,
    averageCompletionPercent,
    earlyAbandonmentRate: totalContent > 0 ? earlyAbandons / totalContent : 0,
  };
}

/**
 * Preference signals from like engagement.
 */
interface PreferenceSignals {
  formatPreferences: Record<string, number>;
  genrePreferences: Record<string, number>;
  difficultyPreferences: Record<string, number>;
}

/**
 * Analyze like engagement for preference signals.
 */
function analyzePreferenceSignals(likes: LikeEngagement[]): PreferenceSignals {
  const formatPreferences: Record<string, number> = {};
  const genrePreferences: Record<string, number> = {};
  const difficultyPreferences: Record<string, number> = {};

  const likedContent = likes.filter((l) => l.liked);

  likedContent.forEach((like) => {
    const { format, genre, difficulty } = like.contentCharacteristics;

    // Count format preferences
    formatPreferences[format] = (formatPreferences[format] || 0) + 1;

    // Count genre preferences (if genre exists)
    if (genre) {
      genrePreferences[genre] = (genrePreferences[genre] || 0) + 1;
    }

    // Count difficulty preferences
    difficultyPreferences[difficulty] = (difficultyPreferences[difficulty] || 0) + 1;
  });

  return {
    formatPreferences,
    genrePreferences,
    difficultyPreferences,
  };
}

/**
 * Calculate difficulty adjustment.
 * Model principle: Prediction under uncertainty - probabilistic adjustment.
 */
function calculateDifficultyAdjustment(
  comprehensionSignals: ComprehensionSignals,
  currentLearnerState: LearnerState | undefined,
  userDifficultyPreference: 'beginner' | 'intermediate' | 'advanced'
): number {
  // Base adjustment from comprehension signals
  let adjustment = 0;

  // High completion rate (>0.8) suggests content might be too easy
  if (comprehensionSignals.completionRate > 0.8) {
    adjustment += 0.2;
  }

  // High abandonment rate (>0.3) suggests content might be too hard
  if (comprehensionSignals.abandonmentRate > 0.3) {
    adjustment -= 0.3;
  }

  // Early abandonment suggests content is too hard
  if (comprehensionSignals.earlyAbandonmentRate > 0.2) {
    adjustment -= 0.2;
  }

  // High replay rate suggests content is challenging but engaging
  if (comprehensionSignals.replayRate > 0.15) {
    adjustment -= 0.1; // Slight decrease - they're engaging but need support
  }

  // Average completion percent indicates engagement level
  if (comprehensionSignals.averageCompletionPercent < 50) {
    adjustment -= 0.2; // Low completion suggests too hard
  } else if (comprehensionSignals.averageCompletionPercent > 90) {
    adjustment += 0.1; // Very high completion suggests too easy
  }

  // Incorporate learner state if available
  if (currentLearnerState) {
    // If comprehension level is high, can increase difficulty
    if (currentLearnerState.comprehensionLevel > 0.8) {
      adjustment += 0.1;
    } else if (currentLearnerState.comprehensionLevel < 0.5) {
      adjustment -= 0.2;
    }

    // Incorporate existing difficulty adjustment
    adjustment += currentLearnerState.difficultyAdjustment * 0.5;
  }

  // Clamp adjustment to reasonable range
  return Math.max(-1.0, Math.min(1.0, adjustment));
}

/**
 * Determine recommended formats based on preferences and signals.
 */
function determineRecommendedFormats(
  userPreferredFormats: ('narrative' | 'podcast' | 'educational')[],
  preferenceSignals: PreferenceSignals,
  currentLearnerState: LearnerState | undefined
): string[] {
  // Start with user preferences
  const formats: string[] = [...userPreferredFormats];

  // Boost formats with high preference signals
  Object.entries(preferenceSignals.formatPreferences)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .forEach(([format]) => {
      if (!formats.includes(format)) {
        formats.push(format);
      }
    });

  // If learner state exists, incorporate format preferences
  if (currentLearnerState) {
    const stateFormats = Object.entries(currentLearnerState.contentTypePreferences.formatScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([format]) => format);

    stateFormats.forEach((format) => {
      if (!formats.includes(format)) {
        formats.push(format);
      }
    });
  }

  // Ensure at least one format is recommended
  if (formats.length === 0) {
    return ['narrative']; // Default
  }

  return formats.slice(0, 3); // Limit to top 3
}

/**
 * Determine recommended genres based on preferences and signals.
 */
function determineRecommendedGenres(
  userPreferredGenres: string[],
  preferenceSignals: PreferenceSignals,
  currentLearnerState: LearnerState | undefined
): string[] {
  // Start with user preferences
  const genres = [...userPreferredGenres];

  // Boost genres with high preference signals
  Object.entries(preferenceSignals.genrePreferences)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .forEach(([genre]) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });

  // If learner state exists, incorporate genre preferences
  if (currentLearnerState) {
    const stateGenres = Object.entries(currentLearnerState.contentTypePreferences.genreScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    stateGenres.forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  }

  return genres.slice(0, 5); // Limit to top 5
}

/**
 * Determine template recommendations based on formats, genres, and difficulty.
 */
function determineTemplateRecommendations(
  formats: string[],
  genres: string[],
  difficultyAdjustment: number
): string[] {
  const templates: string[] = [];

  formats.forEach((format) => {
    genres.forEach((genre) => {
      // Determine difficulty level based on adjustment
      let difficultyLevel = 'intermediate';
      if (difficultyAdjustment < -0.3) {
        difficultyLevel = 'beginner';
      } else if (difficultyAdjustment > 0.3) {
        difficultyLevel = 'advanced';
      }

      // Generate template identifier
      const templateId = `${format}-${genre}-${difficultyLevel}-v1`;
      templates.push(templateId);
    });

    // Also add format-only templates
    if (genres.length === 0) {
      let difficultyLevel = 'intermediate';
      if (difficultyAdjustment < -0.3) {
        difficultyLevel = 'beginner';
      } else if (difficultyAdjustment > 0.3) {
        difficultyLevel = 'advanced';
      }
      const templateId = `${format}-${difficultyLevel}-v1`;
      templates.push(templateId);
    }
  });

  return templates.slice(0, 5); // Limit to top 5
}
