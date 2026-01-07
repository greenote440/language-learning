/**
 * Signal Interpreter Module
 * 
 * Implements model framework for behavioral signal interpretation.
 * Applies foundation model principles: probabilistic competence tracking,
 * non-linear acquisition, meaning-driven inference.
 */

import { SignalInterpretation } from '../interfaces/v1/signal-interpretation.interface';
import { BehavioralEvent } from '../interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../interfaces/types/like-engagement.type';
import { PreferenceWeights, ContentTypePreferences } from '../interfaces/v1/learner-state.interface';

/**
 * Interpret behavioral signals according to model framework.
 * 
 * Implements:
 * - Comprehension inference from behavioral events
 * - Preference weight calculation from like engagement
 * - Content type preference inference
 * 
 * Model principles:
 * - Probabilistic competence tracking: Not deterministic, but probabilistic
 * - Non-linear acquisition: Competence estimates are overlapping, not level-based
 * - Meaning-driven inference: Signals interpreted through model lens
 * 
 * @param events - Behavioral events to interpret
 * @param likes - Like engagement data
 * @returns Signal interpretation
 */
export function interpretSignals(
  events: BehavioralEvent[],
  likes: LikeEngagement[]
): SignalInterpretation {
  // Infer comprehension level from behavioral events
  const comprehensionLevel = inferComprehensionLevel(events);

  // Calculate preference weights from like engagement
  const preferenceWeights = calculatePreferenceWeights(likes);

  // Infer content type preferences
  const contentTypePreferences = inferContentTypePreferences(events, likes);

  return {
    comprehensionLevel,
    preferenceWeights,
    contentTypePreferences,
  };
}

/**
 * Infer comprehension level from behavioral events.
 * Model principle: Probabilistic competence tracking.
 */
function inferComprehensionLevel(events: BehavioralEvent[]): number {
  if (events.length === 0) {
    return 0.5; // Default neutral comprehension level
  }

  // Analyze completion patterns
  const completions = events.filter((e) => e.eventType === 'complete').length;
  const abandonments = events.filter((e) => e.eventType.startsWith('abandon')).length;
  const earlyAbandons = events.filter((e) => e.eventType === 'abandon-early').length;
  const replays = events.filter((e) => e.eventType.startsWith('replay')).length;
  const skips = events.filter((e) => e.eventType.includes('skip')).length;

  const contentIds = new Set(events.map((e) => e.contentId));
  const totalContent = contentIds.size;

  // Calculate completion rate
  const completionRate = totalContent > 0 ? completions / totalContent : 0;
  
  // Calculate abandonment rate
  const abandonmentRate = totalContent > 0 ? abandonments / totalContent : 0;
  
  // Calculate early abandonment rate (strong indicator of difficulty)
  const earlyAbandonmentRate = totalContent > 0 ? earlyAbandons / totalContent : 0;

  // Calculate average playback position for completed/abandoned content
  const completionPositions = events
    .filter((e) => e.eventType === 'complete' || e.eventType.startsWith('abandon'))
    .map((e) => e.playbackPositionPercent);

  const averagePosition =
    completionPositions.length > 0
      ? completionPositions.reduce((a, b) => a + b, 0) / completionPositions.length
      : 0;

  // Model-based comprehension inference
  // High completion rate + low abandonment = good comprehension
  let comprehensionScore = completionRate * 0.4;

  // Average position indicates engagement/comprehension
  comprehensionScore += (averagePosition / 100) * 0.3;

  // Replay rate suggests engagement but need for support (moderate comprehension)
  const replayRate = events.length > 0 ? replays / events.length : 0;
  if (replayRate > 0.1 && replayRate < 0.3) {
    comprehensionScore += 0.1; // Moderate comprehension with engagement
  }

  // Skip rate suggests content mismatch (lower comprehension or disengagement)
  const skipRate = events.length > 0 ? skips / events.length : 0;
  if (skipRate > 0.2) {
    comprehensionScore -= 0.2; // High skips suggest comprehension issues
  }

  // Early abandonment strongly suggests comprehension difficulty
  comprehensionScore -= earlyAbandonmentRate * 0.3;

  // Clamp to 0-1 range
  return Math.max(0, Math.min(1, comprehensionScore));
}

/**
 * Calculate preference weights from like engagement.
 * Model principle: Preference inference from behavioral signals.
 */
function calculatePreferenceWeights(likes: LikeEngagement[]): PreferenceWeights {
  const weights: PreferenceWeights = {
    narrative: 0.33, // Default equal weights
    podcast: 0.33,
    educational: 0.33,
  };

  const likedContent = likes.filter((l) => l.liked);
  const unlikedContent = likes.filter((l) => !l.liked);

  if (likedContent.length === 0 && unlikedContent.length === 0) {
    return weights; // No data, return defaults
  }

  // Count format preferences from likes
  const formatCounts: Record<string, number> = {};
  likedContent.forEach((like) => {
    const format = like.contentCharacteristics.format;
    formatCounts[format] = (formatCounts[format] || 0) + 1;
  });

  // Count format dislikes
  const formatDislikes: Record<string, number> = {};
  unlikedContent.forEach((like) => {
    const format = like.contentCharacteristics.format;
    formatDislikes[format] = (formatDislikes[format] || 0) + 1;
  });

  // Calculate weights (likes boost, unlikes reduce)
  const totalLikes = likedContent.length;
  const totalUnlikes = unlikedContent.length;
  const total = totalLikes + totalUnlikes;

  if (total > 0) {
    // Normalize based on total engagement
    Object.keys(formatCounts).forEach((format) => {
      const likeScore = formatCounts[format] / total;
      const dislikeScore = (formatDislikes[format] || 0) / total;
      const netScore = likeScore - dislikeScore * 0.5; // Unlikes have less weight

      if (format === 'narrative' || format === 'podcast' || format === 'educational') {
        weights[format] = Math.max(0, Math.min(1, 0.33 + netScore));
      }
    });

    // Normalize to sum to 1.0
    const sum = weights.narrative + weights.podcast + weights.educational;
    if (sum > 0) {
      weights.narrative /= sum;
      weights.podcast /= sum;
      weights.educational /= sum;
    }
  }

  // Add genre preferences
  likedContent.forEach((like) => {
    const genre = like.contentCharacteristics.genre;
    if (genre) {
      weights[genre] = (weights[genre] || 0) + 0.1;
    }
  });

  return weights;
}

/**
 * Infer content type preferences from events and likes.
 */
function inferContentTypePreferences(
  events: BehavioralEvent[],
  likes: LikeEngagement[]
): ContentTypePreferences {
  const formatScores: Record<string, number> = {};
  const genreScores: Record<string, number> = {};
  const difficultyScores: Record<string, number> = {};

  // Analyze events for format/genre/difficulty engagement
  events.forEach((event) => {
    const { format, genre, difficulty } = event.contentCharacteristics;

    // Completion events boost scores
    if (event.eventType === 'complete') {
      formatScores[format] = (formatScores[format] || 0) + 1;
      if (genre) {
        genreScores[genre] = (genreScores[genre] || 0) + 1;
      }
      difficultyScores[difficulty] = (difficultyScores[difficulty] || 0) + 1;
    }

    // Replay events suggest engagement (moderate boost)
    if (event.eventType.startsWith('replay')) {
      formatScores[format] = (formatScores[format] || 0) + 0.5;
      if (genre) {
        genreScores[genre] = (genreScores[genre] || 0) + 0.5;
      }
    }

    // Early abandonment reduces scores
    if (event.eventType === 'abandon-early') {
      formatScores[format] = (formatScores[format] || 0) - 0.5;
      if (genre) {
        genreScores[genre] = (genreScores[genre] || 0) - 0.5;
      }
      difficultyScores[difficulty] = (difficultyScores[difficulty] || 0) - 0.5;
    }
  });

  // Analyze likes for preferences
  likes.forEach((like) => {
    const { format, genre, difficulty } = like.contentCharacteristics;

    if (like.liked) {
      formatScores[format] = (formatScores[format] || 0) + 2; // Likes have strong weight
      if (genre) {
        genreScores[genre] = (genreScores[genre] || 0) + 2;
      }
      difficultyScores[difficulty] = (difficultyScores[difficulty] || 0) + 2;
    } else {
      formatScores[format] = (formatScores[format] || 0) - 1; // Unlikes reduce
      if (genre) {
        genreScores[genre] = (genreScores[genre] || 0) - 1;
      }
      difficultyScores[difficulty] = (difficultyScores[difficulty] || 0) - 1;
    }
  });

  // Normalize scores to 0-1 range
  const normalizeScores = (scores: Record<string, number>): Record<string, number> => {
    const max = Math.max(...Object.values(scores), 1);
    const min = Math.min(...Object.values(scores), 0);
    const range = max - min || 1;

    const normalized: Record<string, number> = {};
    Object.entries(scores).forEach(([key, value]) => {
      normalized[key] = (value - min) / range;
    });

    return normalized;
  };

  return {
    formatScores: normalizeScores(formatScores),
    genreScores: normalizeScores(genreScores),
    difficultyScores: normalizeScores(difficultyScores),
  };
}
