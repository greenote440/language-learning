/**
 * Unit tests for Adaptation Engine Module
 */

import { describe, it, expect } from 'vitest';
import { getAdaptationRecommendations } from '../src/model/adaptationEngine';
import { BehavioralEvent } from '../src/interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../src/interfaces/types/like-engagement.type';
import { UserPreferences } from '../src/interfaces/types/user-preferences.type';
import { LearnerState } from '../src/interfaces/v1/learner-state.interface';

describe('Adaptation Engine', () => {
  const defaultPreferences: UserPreferences = {
    difficultyPreference: 'intermediate',
    preferredFormats: ['narrative', 'podcast'],
    preferredGenres: ['adventure'],
    playbackSpeed: 1.0,
    autoPlay: true,
  };

  const createMockEvent = (
    eventType: BehavioralEvent['eventType'],
    contentId: string = 'content-1'
  ): BehavioralEvent => ({
    id: `event-${Date.now()}`,
    contentId,
    eventType,
    timestamp: new Date(),
    playbackPosition: 10,
    playbackPositionPercent: 50,
    duration: 0,
    sessionId: 'session-1',
    contentCharacteristics: {
      format: 'narrative',
      genre: 'adventure',
      difficulty: 'lexical-heavy',
      templateId: 'template-1',
    },
  });

  const createMockLike = (
    liked: boolean,
    contentId: string = 'content-1'
  ): LikeEngagement => ({
    contentId,
    liked,
    likedAt: liked ? new Date() : null,
    sessionId: 'session-1',
    contentCharacteristics: {
      format: 'narrative',
      genre: 'adventure',
      difficulty: 'lexical-heavy',
      templateId: 'template-1',
    },
  });

  describe('getAdaptationRecommendations', () => {
    it('should return recommendations with high completion rate', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('complete', 'content-1'),
        createMockEvent('complete', 'content-2'),
        createMockEvent('complete', 'content-3'),
      ];

      const recommendations = getAdaptationRecommendations(
        events,
        [],
        defaultPreferences
      );

      expect(recommendations.recommendedFormats.length).toBeGreaterThan(0);
      expect(recommendations.recommendedGenres.length).toBeGreaterThanOrEqual(0);
      expect(recommendations.difficultyAdjustment).toBeGreaterThan(-1);
      expect(recommendations.difficultyAdjustment).toBeLessThan(1);
      expect(recommendations.templateRecommendations.length).toBeGreaterThan(0);
    });

    it('should decrease difficulty with high abandonment rate', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('abandon-early', 'content-1'),
        createMockEvent('abandon-early', 'content-2'),
        createMockEvent('abandon-early', 'content-3'),
      ];

      const recommendations = getAdaptationRecommendations(
        events,
        [],
        defaultPreferences
      );

      expect(recommendations.difficultyAdjustment).toBeLessThan(0);
    });

    it('should incorporate like preferences', () => {
      const likes: LikeEngagement[] = [
        createMockLike(true, 'content-1'),
        createMockLike(true, 'content-2'),
        createMockLike(false, 'content-3'),
      ];

      const recommendations = getAdaptationRecommendations(
        [],
        likes,
        defaultPreferences
      );

      expect(recommendations.recommendedFormats).toContain('narrative');
      expect(recommendations.recommendedGenres.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty events and likes', () => {
      const recommendations = getAdaptationRecommendations(
        [],
        [],
        defaultPreferences
      );

      expect(recommendations.recommendedFormats.length).toBeGreaterThan(0);
      expect(recommendations.difficultyAdjustment).toBeGreaterThanOrEqual(-1);
      expect(recommendations.difficultyAdjustment).toBeLessThanOrEqual(1);
    });

    it('should incorporate learner state if provided', () => {
      const learnerState: LearnerState = {
        preferenceWeights: {
          narrative: 0.5,
          podcast: 0.3,
          educational: 0.2,
        },
        comprehensionLevel: 0.8,
        contentTypePreferences: {
          formatScores: { narrative: 0.8, podcast: 0.6 },
          genreScores: { adventure: 0.9 },
          difficultyScores: { 'lexical-heavy': 0.7 },
        },
        difficultyAdjustment: 0.2,
        lastUpdated: new Date(),
        dataPoints: 10,
      };

      const recommendations = getAdaptationRecommendations(
        [],
        [],
        defaultPreferences,
        learnerState
      );

      expect(recommendations.recommendedFormats).toContain('narrative');
      expect(recommendations.difficultyAdjustment).toBeGreaterThan(-1);
      expect(recommendations.difficultyAdjustment).toBeLessThan(1);
    });

    it('should handle replay events appropriately', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('replay-segment', 'content-1'),
        createMockEvent('replay-full', 'content-2'),
      ];

      const recommendations = getAdaptationRecommendations(
        events,
        [],
        defaultPreferences
      );

      expect(recommendations.difficultyAdjustment).toBeGreaterThan(-1);
      expect(recommendations.difficultyAdjustment).toBeLessThan(1);
    });
  });
});
