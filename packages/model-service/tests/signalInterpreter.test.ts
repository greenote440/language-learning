/**
 * Unit tests for Signal Interpreter Module
 */

import { describe, it, expect } from 'vitest';
import { interpretSignals } from '../src/model/signalInterpreter';
import { BehavioralEvent } from '../src/interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../src/interfaces/types/like-engagement.type';

describe('Signal Interpreter', () => {
  const createMockEvent = (
    eventType: BehavioralEvent['eventType'],
    playbackPositionPercent: number = 50
  ): BehavioralEvent => ({
    id: `event-${Date.now()}`,
    contentId: 'content-1',
    eventType,
    timestamp: new Date(),
    playbackPosition: 10,
    playbackPositionPercent,
    duration: 0,
    sessionId: 'session-1',
    contentCharacteristics: {
      format: 'narrative',
      genre: 'adventure',
      difficulty: 'lexical-heavy',
      templateId: 'template-1',
    },
  });

  const createMockLike = (liked: boolean): LikeEngagement => ({
    contentId: 'content-1',
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

  describe('interpretSignals', () => {
    it('should interpret high completion as good comprehension', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('complete', 100),
        createMockEvent('complete', 100),
        createMockEvent('complete', 100),
      ];

      const interpretation = interpretSignals(events, []);

      expect(interpretation.comprehensionLevel).toBeGreaterThan(0.5);
      expect(interpretation.comprehensionLevel).toBeLessThanOrEqual(1);
    });

    it('should interpret early abandonment as low comprehension', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('abandon-early', 10),
        createMockEvent('abandon-early', 15),
        createMockEvent('abandon-early', 20),
      ];

      const interpretation = interpretSignals(events, []);

      expect(interpretation.comprehensionLevel).toBeLessThan(0.5);
    });

    it('should calculate preference weights from likes', () => {
      const likes: LikeEngagement[] = [
        createMockLike(true),
        createMockLike(true),
        createMockLike(false),
      ];

      const interpretation = interpretSignals([], likes);

      expect(interpretation.preferenceWeights.narrative).toBeGreaterThan(0);
      expect(interpretation.preferenceWeights.narrative).toBeLessThanOrEqual(1);
      expect(interpretation.preferenceWeights.podcast).toBeGreaterThanOrEqual(0);
      expect(interpretation.preferenceWeights.educational).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty events and likes', () => {
      const interpretation = interpretSignals([], []);

      expect(interpretation.comprehensionLevel).toBe(0.5); // Default
      expect(interpretation.preferenceWeights.narrative).toBe(0.33);
      expect(interpretation.preferenceWeights.podcast).toBe(0.33);
      expect(interpretation.preferenceWeights.educational).toBe(0.33);
    });

    it('should infer content type preferences from events', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('complete', 100),
        createMockEvent('replay-segment', 50),
      ];

      const interpretation = interpretSignals(events, []);

      expect(interpretation.contentTypePreferences.formatScores).toBeDefined();
      expect(interpretation.contentTypePreferences.genreScores).toBeDefined();
      expect(interpretation.contentTypePreferences.difficultyScores).toBeDefined();
    });

    it('should incorporate likes into content type preferences', () => {
      const likes: LikeEngagement[] = [
        createMockLike(true),
        createMockLike(true),
      ];

      const interpretation = interpretSignals([], likes);

      expect(interpretation.contentTypePreferences.formatScores['narrative']).toBeGreaterThan(0);
    });

    it('should handle mixed signals appropriately', () => {
      const events: BehavioralEvent[] = [
        createMockEvent('complete', 100),
        createMockEvent('abandon-early', 10),
        createMockEvent('replay-segment', 50),
      ];

      const likes: LikeEngagement[] = [
        createMockLike(true),
        createMockLike(false),
      ];

      const interpretation = interpretSignals(events, likes);

      expect(interpretation.comprehensionLevel).toBeGreaterThanOrEqual(0);
      expect(interpretation.comprehensionLevel).toBeLessThanOrEqual(1);
      expect(interpretation.preferenceWeights.narrative).toBeGreaterThanOrEqual(0);
      expect(interpretation.preferenceWeights.narrative).toBeLessThanOrEqual(1);
    });
  });
});
