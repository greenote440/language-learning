/**
 * Performance tests for Model Service
 * 
 * Verifies computational efficiency requirement: < 100ms per request
 */

import { describe, it, expect } from 'vitest';
import { ModelService, createModelService } from '../src/model-service';
import { BehavioralEvent } from '../src/interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../src/interfaces/types/like-engagement.type';
import { UserPreferences } from '../src/interfaces/types/user-preferences.type';

describe('Performance Tests', () => {
  const modelService = createModelService();

  const createMockEvent = (): BehavioralEvent => ({
    id: `event-${Date.now()}-${Math.random()}`,
    contentId: `content-${Math.floor(Math.random() * 10)}`,
    eventType: 'complete',
    timestamp: new Date(),
    playbackPosition: 10,
    playbackPositionPercent: 100,
    duration: 0,
    sessionId: 'session-1',
    contentCharacteristics: {
      format: 'narrative',
      genre: 'adventure',
      difficulty: 'lexical-heavy',
      templateId: 'template-1',
    },
  });

  const createMockLike = (): LikeEngagement => ({
    contentId: `content-${Math.floor(Math.random() * 10)}`,
    liked: Math.random() > 0.5,
    likedAt: new Date(),
    sessionId: 'session-1',
    contentCharacteristics: {
      format: 'narrative',
      genre: 'adventure',
      difficulty: 'lexical-heavy',
      templateId: 'template-1',
    },
  });

  const preferences: UserPreferences = {
    difficultyPreference: 'intermediate',
    preferredFormats: ['narrative', 'podcast'],
    preferredGenres: ['adventure'],
    playbackSpeed: 1.0,
    autoPlay: true,
  };

  it('should execute getGenerationParameters in < 100ms', () => {
    const start = performance.now();
    modelService.getGenerationParameters(preferences);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
  });

  it('should execute getAdaptationRecommendations in < 100ms', () => {
    const events = Array.from({ length: 100 }, () => createMockEvent());
    const likes = Array.from({ length: 50 }, () => createMockLike());

    const start = performance.now();
    modelService.getAdaptationRecommendations(events, likes, preferences);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
  });

  it('should execute interpretSignals in < 100ms', () => {
    const events = Array.from({ length: 100 }, () => createMockEvent());
    const likes = Array.from({ length: 50 }, () => createMockLike());

    const start = performance.now();
    modelService.interpretSignals(events, likes);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
  });

  it('should execute updateLearnerState in < 100ms', () => {
    const interpretation = modelService.interpretSignals([], []);

    const start = performance.now();
    modelService.updateLearnerState(interpretation);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
  });

  it('should handle large datasets efficiently', () => {
    const events = Array.from({ length: 1000 }, () => createMockEvent());
    const likes = Array.from({ length: 500 }, () => createMockLike());

    const start = performance.now();
    const interpretation = modelService.interpretSignals(events, likes);
    modelService.getAdaptationRecommendations(events, likes, preferences);
    modelService.updateLearnerState(interpretation);
    const end = performance.now();
    const duration = end - start;

    // Should handle large datasets in reasonable time (< 300ms for all operations)
    expect(duration).toBeLessThan(300);
  });
});
