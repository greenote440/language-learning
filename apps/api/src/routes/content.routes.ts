/**
 * Content Generation Routes
 * 
 * API routes for content generation endpoints.
 */

import { Router, Request, Response } from 'express';
import { ContentGenerationService, ContentGenerationRequest } from '../services/contentGeneration.service.js';
import { ApiClientError } from '../utils/errors.js';

const router = Router();
const contentGenerationService = new ContentGenerationService();

/**
 * POST /api/content/generate
 * 
 * Generate new Italian audio content using model-driven generation.
 * Returns 202 Accepted immediately with generationId for async processing.
 * 
 * Request body:
 * - sessionId: string (required)
 * - userPreferences?: UserPreferences
 * - adaptationSignals?: object
 * - continuityContext?: object
 * - webhookUrl?: string (optional)
 * 
 * Response (202 Accepted):
 * - generationId: string
 * - status: 'generating' | 'processing' | 'completed' | 'failed'
 * - estimatedCompletionTime?: number
 * - webhookRegistered?: boolean
 */
router.post('/generate', async (req: Request, res: Response) => {
  console.log('[API] POST /api/content/generate - Request received', {
    body: req.body,
    headers: req.headers,
  });
  
  try {
    const { sessionId, userPreferences, adaptationSignals, continuityContext, webhookUrl } = req.body;
    console.log('[API] Request parsed', { sessionId, hasUserPreferences: !!userPreferences });

    // Validate required fields
    if (!sessionId) {
      console.log('[API] Missing sessionId, returning 400');
      return res.status(400).json({
        error: {
          code: 'MISSING_SESSION_ID',
          message: 'sessionId is required',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Build generation request
    const request: ContentGenerationRequest = {
      sessionId,
      userPreferences,
      adaptationSignals,
      continuityContext,
    };
    console.log('[API] Generation request built', { sessionId, format: userPreferences?.preferredFormats });

    // Generate content (synchronous for MVP, can be made async later)
    try {
      console.log('[API] Calling contentGenerationService.generateContent...');
      const content = await contentGenerationService.generateContent(request);
      console.log('[API] Content generated successfully', { contentId: content.id, format: content.format });

      // Return 202 Accepted with generation status
      // For MVP, we generate synchronously, so status is 'completed'
      // Note: audioUrl is placeholder until TTS is implemented (Story 2.5)
      res.status(202).json({
        generationId: content.id,
        status: 'completed',
        estimatedCompletionTime: 0,
        webhookRegistered: !!webhookUrl,
        content: {
          ...content,
          audioUrl: '', // Placeholder - will be populated by TTS service (Story 2.5)
          description: undefined, // Optional field
          genre: undefined, // Optional field
          episodeNumber: undefined, // Optional field
        },
      });
    } catch (error) {
      console.error('[API] Error in content generation:', error);
      console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('[API] Error details:', {
        name: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        type: error instanceof ApiClientError ? error.type : 'Unknown',
      });
      
      // Handle generation errors
      if (error instanceof ApiClientError) {
        const statusCode = error.type === 'AuthenticationError' ? 401 :
                          error.type === 'RateLimitError' ? 429 :
                          error.type === 'NetworkError' ? 503 : 500;

        console.log('[API] Returning ApiClientError response', { statusCode, type: error.type });
        return res.status(statusCode).json({
          error: {
            code: error.type,
            message: error.message,
            timestamp: new Date().toISOString(),
          },
        });
      }

      throw error; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('[API] Unhandled error in /api/content/generate:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[API] Error name:', error instanceof Error ? error.name : typeof error);
    console.error('[API] Error message:', error instanceof Error ? error.message : String(error));
    
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/content/{contentId}
 * 
 * Get content by ID.
 * 
 * Parameters:
 * - contentId: string (path parameter)
 * 
 * Response (200):
 * - Content object
 * 
 * Response (404):
 * - Error object if content not found
 */
router.get('/:contentId', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;

    // For MVP, we don't have a database to store content
    // Content is generated on-demand and returned immediately
    // This endpoint returns 404 for now - content should be loaded from the generate response
    // In future, this will query the database for stored content
    res.status(404).json({
      error: {
        code: 'CONTENT_NOT_FOUND',
        message: `Content with ID ${contentId} not found. Content is generated on-demand and not persisted in MVP.`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /api/content/:contentId:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/content/{generationId}/status
 * 
 * Check content generation status.
 * Returns content when completed.
 * 
 * Parameters:
 * - generationId: string (path parameter)
 * 
 * Response:
 * - status: 'generating' | 'processing' | 'completed' | 'failed'
 * - content?: Content (when completed)
 * - error?: string (when failed)
 */
router.get('/:generationId/status', async (req: Request, res: Response) => {
  try {
    const { generationId } = req.params;

    // For MVP, generation is synchronous, so we don't track status
    // This endpoint is a placeholder for future async implementation
    res.status(404).json({
      error: {
        code: 'GENERATION_NOT_FOUND',
        message: 'Generation status tracking not implemented in MVP. Use POST /api/content/generate to generate content.',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /api/content/:generationId/status:', error);
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
