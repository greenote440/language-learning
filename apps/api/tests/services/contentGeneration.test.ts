/**
 * Content Generation Service Tests
 * 
 * Unit tests for content generation service with mocked dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentGenerationService, ContentGenerationRequest } from '../../src/services/contentGeneration.service.js';
import { ModelService } from '@adaptive-italian-audio/model-service';
import { GeminiClientService } from '../../src/services/geminiClient.service.js';
import { ApiIntegrationService } from '../../src/services/apiIntegration.service.js';
import { ApiClientError } from '../../src/utils/errors.js';

// Mock dependencies
vi.mock('@adaptive-italian-audio/model-service', () => ({
  ModelService: vi.fn(),
}));

vi.mock('../../src/services/geminiClient.service.js', () => ({
  GeminiClientService: vi.fn(),
}));

vi.mock('../../src/services/apiIntegration.service.js', () => ({
  ApiIntegrationService: vi.fn(),
}));

describe('ContentGenerationService', () => {
  let service: ContentGenerationService;
  let mockModelService: any;
  let mockGeminiClient: any;
  let mockApiIntegration: any;

  const mockUserPreferences = {
    difficultyPreference: 'intermediate' as const,
    preferredFormats: ['narrative', 'podcast', 'educational'] as const,
    preferredGenres: [],
    playbackSpeed: 1.0,
    autoPlay: true,
  };

  const mockModelParameters = {
    lexicalNoveltyBudget: 0.05,
    constructionSets: ['present-tense', 'simple-questions'],
    variationPattern: 'same-meaning-different-syntax',
    comprehensibilityTarget: 0.7,
    semanticStability: 0.8,
  };

  const mockPromptGuidance = {
    meaningFirstApproach: 'Prioritize semantic grounding',
    variationSpecification: 'Use controlled variation',
    comprehensibilityGuidance: 'Ensure comprehensibility',
    semanticAnchoringGuidance: 'Anchor to context',
  };

  const mockGeneratedText = `C'era una volta un piccolo villaggio italiano. Il villaggio si trovava in una valle verde e tranquilla. Gli abitanti erano felici e lavoravano insieme. Ogni giorno, i bambini giocavano nella piazza principale. Le donne preparavano il pranzo con ingredienti freschi. Gli uomini lavoravano nei campi. La vita era semplice ma piena di gioia. Il villaggio aveva una lunga storia. Molte generazioni avevano vissuto lì. Le tradizioni erano importanti per tutti. I bambini imparavano dai nonni. Le storie venivano tramandate di generazione in generazione. Il villaggio era un posto speciale dove tutti si conoscevano. La comunità era unita e solidale. Ogni persona aveva un ruolo importante.`;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mock ModelService
    mockModelService = {
      getGenerationParameters: vi.fn().mockReturnValue(mockModelParameters),
      getPromptEngineeringGuidance: vi.fn().mockReturnValue(mockPromptGuidance),
    };
    (ModelService as any).mockImplementation(() => mockModelService);

    // Setup mock GeminiClientService
    mockGeminiClient = {
      generateText: vi.fn().mockResolvedValue(mockGeneratedText),
    };
    (GeminiClientService as any).mockImplementation(() => mockGeminiClient);

    // Setup mock ApiIntegrationService
    mockApiIntegration = {
      withStandardErrors: vi.fn().mockImplementation(async (service, fn) => {
        return fn();
      }),
    };
    (ApiIntegrationService as any).mockImplementation(() => mockApiIntegration);

    service = new ContentGenerationService();
  });

  describe('generateContent', () => {
    it('should generate content with default user preferences', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      const result = await service.generateContent(request);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe('test-session-123');
      expect(result.textContent).toBe(mockGeneratedText);
      expect(['narrative', 'podcast', 'educational']).toContain(result.format);
      expect(result.modelParameters).toEqual(mockModelParameters);
      expect(mockModelService.getGenerationParameters).toHaveBeenCalled();
    });

    it('should use provided user preferences', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        userPreferences: {
          ...mockUserPreferences,
          difficultyPreference: 'advanced',
        },
      };

      await service.generateContent(request);

      expect(mockModelService.getGenerationParameters).toHaveBeenCalledWith(
        expect.objectContaining({
          difficultyPreference: 'advanced',
        })
      );
    });

    it('should select format from adaptation signals', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        adaptationSignals: {
          preferredFormats: ['podcast'],
        },
      };

      const result = await service.generateContent(request);

      expect(result.format).toBe('podcast');
    });

    it('should select format from user preferences', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        userPreferences: {
          ...mockUserPreferences,
          preferredFormats: ['educational'],
        },
      };

      const result = await service.generateContent(request);

      expect(result.format).toBe('educational');
    });

    it('should include continuity context in prompt', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        continuityContext: {
          episodeNumber: 2,
          storylineContext: 'Previous episode ended with...',
        },
      };

      await service.generateContent(request);

      // Verify prompt was built with continuity context
      expect(mockGeminiClient.generateText).toHaveBeenCalled();
      const callArgs = mockGeminiClient.generateText.mock.calls[0][0];
      expect(callArgs.prompt).toContain('episode');
    });

    it('should handle model service errors with fallback parameters', async () => {
      mockModelService.getGenerationParameters.mockImplementation(() => {
        throw new Error('Model service unavailable');
      });

      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      const result = await service.generateContent(request);

      expect(result).toBeDefined();
      expect(result.modelParameters).toBeDefined();
      // Should use fallback parameters
      expect(result.modelParameters.lexicalNoveltyBudget).toBe(0.05);
    });

    it('should handle Gemini API errors', async () => {
      const apiError = new ApiClientError({
        message: 'API rate limit exceeded',
        type: 'RateLimitError',
        service: 'gemini',
      });
      mockGeminiClient.generateText.mockRejectedValue(apiError);

      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      await expect(service.generateContent(request)).rejects.toThrow(ApiClientError);
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Generation timeout after 10 seconds');
      mockApiIntegration.withStandardErrors.mockImplementation(async () => {
        throw timeoutError;
      });

      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      await expect(service.generateContent(request)).rejects.toThrow();
    });

    it('should generate metadata correctly', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      const result = await service.generateContent(request);

      expect(result.id).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
      expect(['lexical-heavy', 'discourse-heavy']).toContain(result.difficulty);
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('should retry on validation failure', async () => {
      // Mock short text that fails validation
      mockGeminiClient.generateText
        .mockResolvedValueOnce('Short text') // First attempt fails validation
        .mockResolvedValueOnce(mockGeneratedText); // Second attempt succeeds

      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      const result = await service.generateContent(request);

      expect(result).toBeDefined();
      expect(mockGeminiClient.generateText).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries on validation failure', async () => {
      // Mock text that always fails validation
      mockGeminiClient.generateText.mockResolvedValue('Too short');

      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      await expect(service.generateContent(request)).rejects.toThrow(ApiClientError);
      // Should retry up to 2 times (3 total attempts)
      expect(mockGeminiClient.generateText).toHaveBeenCalledTimes(3);
    });
  });

  describe('format selection', () => {
    it('should default to narrative when no preferences provided', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        userPreferences: {
          difficultyPreference: 'intermediate',
          preferredFormats: [],
          preferredGenres: [],
          playbackSpeed: 1.0,
          autoPlay: true,
        },
      };

      const result = await service.generateContent(request);

      expect(result.format).toBe('narrative');
    });
  });

  describe('model service integration', () => {
    it('should call model service for generation parameters', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        userPreferences: mockUserPreferences,
      };

      await service.generateContent(request);

      expect(mockModelService.getGenerationParameters).toHaveBeenCalledWith(mockUserPreferences);
    });

    it('should call model service for prompt guidance', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
        userPreferences: mockUserPreferences,
      };

      await service.generateContent(request);

      expect(mockModelService.getPromptEngineeringGuidance).toHaveBeenCalledWith(
        mockUserPreferences,
        mockModelParameters
      );
    });
  });

  describe('on-demand generation', () => {
    it('should generate fresh content each time', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      const result1 = await service.generateContent(request);
      const result2 = await service.generateContent(request);

      // Each generation should have unique ID
      expect(result1.id).not.toBe(result2.id);
      // Timestamps may be the same if generated in the same millisecond, but IDs must be unique
      expect(result1.generatedAt).toBeInstanceOf(Date);
      expect(result2.generatedAt).toBeInstanceOf(Date);
    });

    it('should not cache or reuse content', async () => {
      const request: ContentGenerationRequest = {
        sessionId: 'test-session-123',
      };

      await service.generateContent(request);
      await service.generateContent(request);

      // Should call Gemini API at least twice (once per generation, may retry on validation)
      expect(mockGeminiClient.generateText).toHaveBeenCalled();
      expect(mockGeminiClient.generateText.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });
});
