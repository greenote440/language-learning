import { Router, Request, Response } from 'express';
import { ModelService } from '@adaptive-italian-audio/model-service';
import { BehavioralEvent, LikeEngagement, UserPreferences } from '@adaptive-italian-audio/model-service';

const router = Router();
const modelService: ModelService = new ModelService();

/**
 * POST /api/model/adaptation
 * 
 * Get model-driven adaptation recommendations based on behavioral data and learner model.
 * 
 * Request body:
 * - sessionId: string (required)
 * - recentEvents?: BehavioralEvent[]
 * - recentLikes?: LikeEngagement[]
 * - userPreferences?: UserPreferences
 * 
 * Response:
 * - recommendedFormats: string[]
 * - recommendedGenres: string[]
 * - difficultyAdjustment: number
 * - templateRecommendations: string[]
 */
router.post('/adaptation', async (req: Request, res: Response) => {
  try {
    const { sessionId, recentEvents = [], recentLikes = [], userPreferences } = req.body;

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        error: {
          code: 'MISSING_SESSION_ID',
          message: 'sessionId is required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Validate userPreferences if provided
    if (userPreferences) {
      if (
        !userPreferences.difficultyPreference ||
        !['beginner', 'intermediate', 'advanced'].includes(userPreferences.difficultyPreference)
      ) {
        return res.status(400).json({
          error: {
            code: 'INVALID_PREFERENCES',
            message: 'userPreferences.difficultyPreference must be one of: beginner, intermediate, advanced',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Default user preferences if not provided
    const preferences: UserPreferences = userPreferences || {
      difficultyPreference: 'intermediate',
      preferredFormats: ['narrative', 'podcast', 'educational'],
      preferredGenres: [],
      playbackSpeed: 1.0,
      autoPlay: true,
    };

    // Convert date strings to Date objects for events
    const normalizedEvents: BehavioralEvent[] = recentEvents.map((event: any) => ({
      ...event,
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
    }));

    // Convert date strings to Date objects for likes
    const normalizedLikes: LikeEngagement[] = recentLikes.map((like: any) => ({
      ...like,
      likedAt: like.likedAt ? new Date(like.likedAt) : null,
    }));

    // Get adaptation recommendations from model service
    const recommendations = modelService.getAdaptationRecommendations(
      normalizedEvents,
      normalizedLikes,
      preferences
    );

    res.json({
      recommendedFormats: recommendations.recommendedFormats,
      recommendedGenres: recommendations.recommendedGenres,
      difficultyAdjustment: recommendations.difficultyAdjustment,
      templateRecommendations: recommendations.templateRecommendations,
    });
  } catch (error) {
    console.error('Error in /api/model/adaptation:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
