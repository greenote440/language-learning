// Content Service - Handles content generation API calls

export interface UserPreferences {
  difficultyPreference?: 'beginner' | 'intermediate' | 'advanced';
  preferredFormats?: ('narrative' | 'podcast' | 'educational')[];
  preferredGenres?: string[];
  autoPlay?: boolean;
  playbackSpeed?: number;
}

export interface ContentGenerationRequest {
  sessionId: string;
  userPreferences?: UserPreferences;
  adaptationSignals?: {
    preferredFormats?: ('narrative' | 'podcast' | 'educational')[];
    preferredGenres?: string[];
    difficultyAdjustment?: number;
  };
  continuityContext?: {
    previousEpisodeId?: string;
    episodeNumber?: number;
    storylineContext?: string;
  };
  webhookUrl?: string;
}

export interface ContentGenerationResponse {
  generationId: string;
  status: 'generating' | 'processing' | 'completed' | 'failed';
  estimatedCompletionTime?: number;
  webhookRegistered?: boolean;
}

export interface GenerationStatusResponse {
  status: 'generating' | 'processing' | 'completed' | 'failed';
  content?: Content;
  error?: string;
}

export interface Content {
  id: string;
  title: string;
  description?: string;
  textContent: string;
  audioUrl: string;
  format: 'narrative' | 'podcast' | 'educational';
  genre?: string;
  difficulty: 'lexical-heavy' | 'discourse-heavy';
  duration: number;
  sessionId: string;
  episodeNumber?: number;
  generatedAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ContentService {
  /**
   * Generate new content
   */
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/content/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json().catch(() => ({ error: { message: 'Bad request' } }));
        throw new Error(error.error?.message || 'Invalid request');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    if (response.status === 202) {
      const data = await response.json();
      // For MVP, the API returns content directly in the response
      // If content is present, return it in the response format
      if (data.content) {
        return {
          generationId: data.generationId || data.content.id,
          status: data.status || 'completed',
          estimatedCompletionTime: data.estimatedCompletionTime,
          webhookRegistered: data.webhookRegistered,
          content: data.content, // Include content for immediate use
        } as ContentGenerationResponse & { content?: Content };
      }
      return data;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
      // Handle network errors (connection refused, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to API server at ${API_BASE_URL}. Please ensure the backend server is running.`);
      }
      throw error;
    }
  }

  /**
   * Poll generation status
   */
  async getGenerationStatus(generationId: string): Promise<GenerationStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/api/content/${generationId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Generation not found');
      }
      throw new Error(`Failed to get generation status: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get content by ID
   */
  async getContent(contentId: string): Promise<Content> {
    const response = await fetch(`${API_BASE_URL}/api/content/${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Content not found');
      }
      throw new Error(`Failed to get content: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Poll generation status until completed or failed
   * Returns the content when completed, or throws an error if failed
   */
  async pollUntilComplete(
    generationId: string,
    options: {
      pollInterval?: number; // milliseconds between polls
      maxDuration?: number; // maximum polling duration in milliseconds
      onStatusUpdate?: (status: GenerationStatusResponse) => void;
    } = {}
  ): Promise<Content> {
    const {
      pollInterval = 2000, // 2 seconds default
      maxDuration = 30000, // 30 seconds default
      onStatusUpdate,
    } = options;

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check timeout
          if (Date.now() - startTime > maxDuration) {
            reject(new Error('Content generation timeout'));
            return;
          }

          const status = await this.getGenerationStatus(generationId);
          
          // Notify status update
          onStatusUpdate?.(status);

          if (status.status === 'completed' && status.content) {
            resolve(status.content);
            return;
          }

          if (status.status === 'failed') {
            reject(new Error(status.error || 'Content generation failed'));
            return;
          }

          // Still generating or processing, poll again
          setTimeout(poll, pollInterval);
        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  }
}

export const contentService = new ContentService();
