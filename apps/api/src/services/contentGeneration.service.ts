/**
 * Content Generation Service
 * 
 * Service for generating Italian content using Gemini API with model-driven parameters.
 * Integrates with ModelService for generation parameters and Gemini API client for text generation.
 */

import { ModelService, GenerationParameters, UserPreferences } from '@adaptive-italian-audio/model-service';
import { GeminiClientService } from './geminiClient.service.js';
import { ApiIntegrationService } from './apiIntegration.service.js';
import { ApiClientError } from '../utils/errors.js';
import { buildContentPrompt } from '../utils/promptBuilder.js';
import { validateContent, validateWithRetry } from '../utils/contentValidator.js';
import { randomUUID } from 'crypto';

/**
 * Content format types
 */
export type ContentFormat = 'narrative' | 'podcast' | 'educational';

/**
 * Content difficulty levels
 */
export type ContentDifficulty = 'lexical-heavy' | 'discourse-heavy';

/**
 * Generated content metadata
 */
export interface GeneratedContent {
  id: string;
  title: string;
  textContent: string;
  format: ContentFormat;
  difficulty: ContentDifficulty;
  duration: number;
  wordCount: number;
  modelParameters: GenerationParameters;
  generatedAt: Date;
  sessionId: string;
}

/**
 * Content generation request parameters
 */
export interface ContentGenerationRequest {
  sessionId: string;
  userPreferences?: UserPreferences;
  adaptationSignals?: {
    preferredFormats?: ContentFormat[];
    preferredGenres?: string[];
    difficultyAdjustment?: number;
  };
  continuityContext?: {
    previousEpisodeId?: string;
    episodeNumber?: number;
    storylineContext?: string;
  };
}

/**
 * Content Generation Service
 * 
 * Generates Italian content using model-driven parameters and Gemini API.
 * Uses API integration service layer for consistent error handling.
 */
export class ContentGenerationService {
  private readonly modelService: ModelService;
  private readonly geminiClient: GeminiClientService;
  private readonly apiIntegration: ApiIntegrationService;

  constructor() {
    console.log('[ContentGenerationService] Initializing service...');
    try {
      this.modelService = new ModelService();
      console.log('[ContentGenerationService] ModelService initialized');
      
      this.geminiClient = new GeminiClientService();
      console.log('[ContentGenerationService] GeminiClientService initialized');
      
      this.apiIntegration = new ApiIntegrationService();
      console.log('[ContentGenerationService] ApiIntegrationService initialized');
      
      console.log('[ContentGenerationService] Service initialization complete');
    } catch (error) {
      console.error('[ContentGenerationService] Error during initialization:', error);
      console.error('[ContentGenerationService] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  /**
   * Get generation parameters from model service
   * 
   * @param userPreferences - User preferences for difficulty and formats
   * @returns Model parameters for content generation
   */
  private getModelParameters(userPreferences: UserPreferences): GenerationParameters {
    try {
      return this.modelService.getGenerationParameters(userPreferences);
    } catch (error) {
      // Fallback to default parameters if model service unavailable
      console.warn('Model service unavailable, using default parameters:', error);
      return {
        lexicalNoveltyBudget: 0.05,
        constructionSets: ['present-tense', 'simple-questions', 'basic-connectives'],
        variationPattern: 'same-meaning-different-syntax',
        comprehensibilityTarget: 0.7,
        semanticStability: 0.8,
      };
    }
  }

  /**
   * Get prompt engineering guidance from model service
   * 
   * @param userPreferences - User preferences
   * @param modelParameters - Generation parameters
   * @returns Prompt engineering guidance
   */
  private getPromptGuidance(
    userPreferences: UserPreferences,
    modelParameters: GenerationParameters
  ) {
    try {
      return this.modelService.getPromptEngineeringGuidance(userPreferences, modelParameters);
    } catch (error) {
      // Fallback to default guidance
      console.warn('Model service unavailable for prompt guidance, using defaults:', error);
      return {
        meaningFirstApproach: 'Prioritize semantic grounding and narrative coherence. Language must be meaningful and contextually grounded.',
        variationSpecification: 'Use controlled variation: express the same meaning using different phrasings and syntactic structures.',
        comprehensibilityGuidance: 'Ensure content is comprehensible through semantic access, using known material to support inference of new material.',
        semanticAnchoringGuidance: 'Anchor language to situational context, narrative scenes, and pragmatic intent. Avoid abstract or decontextualized language.',
      };
    }
  }

  /**
   * Select content format based on user preferences and adaptation signals
   * 
   * @param userPreferences - User preferences
   * @param adaptationSignals - Optional adaptation signals
   * @returns Selected content format
   */
  private selectFormat(
    userPreferences: UserPreferences,
    adaptationSignals?: {
      preferredFormats?: ContentFormat[];
      preferredGenres?: string[];
      difficultyAdjustment?: number;
    }
  ): ContentFormat {
    // Use adaptation signals if available
    if (adaptationSignals?.preferredFormats && adaptationSignals.preferredFormats.length > 0) {
      // Randomly select from preferred formats
      const formats = adaptationSignals.preferredFormats;
      return formats[Math.floor(Math.random() * formats.length)];
    }

    // Use user preferences
    if (userPreferences.preferredFormats && userPreferences.preferredFormats.length > 0) {
      const formats = userPreferences.preferredFormats;
      return formats[Math.floor(Math.random() * formats.length)];
    }

    // Default to narrative
    return 'narrative';
  }

  /**
   * Build prompt for content generation
   * 
   * @param format - Content format
   * @param modelParameters - Generation parameters
   * @param userPreferences - User preferences
   * @param continuityContext - Optional continuity context
   * @returns Complete prompt for Gemini API
   */
  private buildPrompt(
    format: ContentFormat,
    modelParameters: GenerationParameters,
    userPreferences: UserPreferences,
    continuityContext?: {
      previousEpisodeId?: string;
      episodeNumber?: number;
      storylineContext?: string;
    }
  ): string {
    const guidance = this.getPromptGuidance(userPreferences, modelParameters);
    return buildContentPrompt(format, modelParameters, guidance, continuityContext);
  }

  /**
   * Generate Italian text using Gemini API with model-driven prompt
   * 
   * @param prompt - Complete prompt for content generation
   * @param modelParameters - Generation parameters for API configuration
   * @returns Generated Italian text
   * @throws ApiClientError if generation fails
   */
  private async generateText(
    prompt: string,
    modelParameters: GenerationParameters
  ): Promise<string> {
    console.log('[ContentGenerationService] generateText called', { promptLength: prompt.length });
    
    try {
      // Use API integration service for consistent error handling
      console.log('[ContentGenerationService] Calling apiIntegration.withStandardErrors...');
      const result = await this.apiIntegration.withStandardErrors('gemini', async () => {
        // Configure request parameters based on model parameters
        // Temperature: higher for more variation, lower for more focused
        // Use comprehensibility target to influence temperature
        const temperature = Math.max(0.7, Math.min(1.0, modelParameters.comprehensibilityTarget + 0.2));
        
        // Max tokens: estimate based on target length (200-400 words ≈ 250-500 tokens)
        const maxTokens = 500;

        console.log('[ContentGenerationService] Calling geminiClient.generateText...', { promptLength: prompt.length });
        
        // Set timeout to 60 seconds (Gemini API can take longer for complex prompts)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Generation timeout after 60 seconds')), 60000);
        });

        // Call Gemini API with timeout
        const generationPromise = this.geminiClient.generateText({
          prompt,
          model: 'gemini-2.5-flash',
        });

        const text = await Promise.race([generationPromise, timeoutPromise]);
        console.log('[ContentGenerationService] Gemini API response received', { textLength: text.length });
        return text;
      });
      
      console.log('[ContentGenerationService] generateText completed', { resultLength: result.length });
      return result;
    } catch (error) {
      console.error('[ContentGenerationService] Error in generateText:', error);
      console.error('[ContentGenerationService] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  /**
   * Calculate word count from text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Estimate audio duration based on word count
   * Assumes average Italian reading speed of ~150 words per minute
   */
  private estimateDuration(wordCount: number): number {
    const wordsPerMinute = 150;
    const minutes = wordCount / wordsPerMinute;
    return Math.ceil(minutes * 60); // Return in seconds
  }

  /**
   * Determine difficulty level from model parameters
   */
  private determineDifficulty(modelParameters: GenerationParameters): ContentDifficulty {
    // If comprehensibility target is high and lexical novelty is low, it's lexical-heavy
    // If comprehensibility target is lower and we have more constructions, it's discourse-heavy
    if (modelParameters.comprehensibilityTarget > 0.75 && modelParameters.lexicalNoveltyBudget < 0.1) {
      return 'lexical-heavy';
    }
    return 'discourse-heavy';
  }

  /**
   * Extract title from content (first sentence or first 50 characters)
   */
  private extractTitle(textContent: string): string {
    const firstSentence = textContent.split(/[.!?]+/)[0]?.trim();
    if (firstSentence && firstSentence.length <= 100) {
      return firstSentence;
    }
    return textContent.substring(0, 50).trim() + '...';
  }

  /**
   * Generate Italian content based on model-driven parameters
   * 
   * @param request - Content generation request with session and preferences
   * @returns Generated content with metadata
   * @throws ApiClientError if generation fails
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    console.log('[ContentGenerationService] generateContent called', { sessionId: request.sessionId });
    
    try {
      // Default user preferences if not provided
      const userPreferences: UserPreferences = request.userPreferences || {
        difficultyPreference: 'intermediate',
        preferredFormats: ['narrative', 'podcast', 'educational'],
        preferredGenres: [],
        playbackSpeed: 1.0,
        autoPlay: true,
      };
      console.log('[ContentGenerationService] User preferences:', userPreferences);

      // Get model-driven generation parameters
      console.log('[ContentGenerationService] Getting model parameters...');
      const modelParameters = this.getModelParameters(userPreferences);
      console.log('[ContentGenerationService] Model parameters received:', modelParameters);

      // Select content format
      console.log('[ContentGenerationService] Selecting format...');
      const format = this.selectFormat(userPreferences, request.adaptationSignals);
      console.log('[ContentGenerationService] Format selected:', format);

      // Build prompt
      console.log('[ContentGenerationService] Building prompt...');
      const prompt = this.buildPrompt(format, modelParameters, userPreferences, request.continuityContext);
      console.log('[ContentGenerationService] Prompt built, length:', prompt.length);

      // Generate text using Gemini API (with retry logic for validation failures)
      console.log('[ContentGenerationService] Generating text with Gemini API...');
      let textContent: string;
      let validationResult;
      let retryCount = 0;
      const maxRetries = 2;

      do {
        console.log(`[ContentGenerationService] Generation attempt ${retryCount + 1}/${maxRetries + 1}`);
        textContent = await this.generateText(prompt, modelParameters);
        console.log('[ContentGenerationService] Text generated, length:', textContent.length);
        
        validationResult = validateWithRetry(textContent, format, retryCount);
        console.log('[ContentGenerationService] Validation result:', { valid: validationResult.valid, errors: validationResult.errors });

        if (!validationResult.valid && retryCount < maxRetries) {
          retryCount++;
          console.warn(`[ContentGenerationService] Content validation failed, retrying (${retryCount}/${maxRetries}):`, validationResult.errors);
        } else {
          break;
        }
      } while (retryCount <= maxRetries);

      // If validation still fails after retries, throw error
      if (!validationResult.valid) {
        console.error('[ContentGenerationService] Validation failed after all retries');
        throw new ApiClientError({
          message: `Content validation failed: ${validationResult.errors.join(', ')}`,
          type: 'ApiError',
          service: 'content-generation',
        });
      }

      // Generate metadata
      console.log('[ContentGenerationService] Generating metadata...');
      const wordCount = this.countWords(textContent);
      const duration = this.estimateDuration(wordCount);
      const difficulty = this.determineDifficulty(modelParameters);
      const title = this.extractTitle(textContent);
      console.log('[ContentGenerationService] Metadata generated', { wordCount, duration, difficulty, title });

      const result = {
        id: randomUUID(),
        title,
        textContent,
        format,
        difficulty,
        duration,
        wordCount,
        modelParameters,
        generatedAt: new Date(),
        sessionId: request.sessionId,
      };
      
      console.log('[ContentGenerationService] Content generation complete', { contentId: result.id });
      return result;
    } catch (error) {
      console.error('[ContentGenerationService] Error in generateContent:', error);
      console.error('[ContentGenerationService] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }
}
