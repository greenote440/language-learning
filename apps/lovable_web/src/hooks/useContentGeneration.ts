import { useState, useCallback } from 'react';
import { contentService, type ContentGenerationRequest, type Content, type UserPreferences } from '@/services/contentService';
import { useSession } from '@/contexts/SessionContext';
import { useContent } from '@/contexts/ContentContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export interface UseContentGenerationOptions {
  onSuccess?: (content: Content) => void;
  onError?: (error: Error) => void;
  onStatusUpdate?: (status: 'generating' | 'processing' | 'completed' | 'failed') => void;
}

export interface UseContentGenerationReturn {
  generate: (userPreferences?: UserPreferences, format?: 'narrative' | 'podcast' | 'educational') => Promise<Content | null>;
  isGenerating: boolean;
  error: Error | null;
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'failed';
}

/**
 * Hook for content generation with automatic context integration
 */
export const useContentGeneration = (options: UseContentGenerationOptions = {}): UseContentGenerationReturn => {
  const { onSuccess, onError, onStatusUpdate } = options;
  const session = useSession();
  const contentContext = useContent();
  const audioPlayer = useAudioPlayer();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'processing' | 'completed' | 'failed'>('idle');

  const generate = useCallback(async (
    userPreferences?: UserPreferences,
    format?: 'narrative' | 'podcast' | 'educational'
  ): Promise<Content | null> => {
    setIsGenerating(true);
    setError(null);
    setStatus('generating');
    onStatusUpdate?.('generating');

    try {
      // Select format: use provided format, or randomize if not provided
      const selectedFormat = format || (() => {
        const formats: ('narrative' | 'podcast' | 'educational')[] = ['narrative', 'podcast', 'educational'];
        return formats[Math.floor(Math.random() * formats.length)];
      })();

      // Prepare request
      const request: ContentGenerationRequest = {
        sessionId: session.sessionId,
        userPreferences: userPreferences || {
          difficultyPreference: 'beginner',
          preferredFormats: [selectedFormat],
          autoPlay: true,
          playbackSpeed: 1.0,
        },
      };

      // Start generation
      const generationResponse = await contentService.generateContent(request);
      
      // Check if content is already available in response (MVP synchronous generation)
      const responseWithContent = generationResponse as ContentGenerationResponse & { content?: Content };
      if (responseWithContent.content && generationResponse.status === 'completed') {
        // Content is already available, use it directly
        const content = responseWithContent.content;
        
        // Convert API Content to context Content format
        const contextContent = {
          id: content.id,
          title: content.title,
          subtitle: content.description,
          audioUrl: content.audioUrl,
          duration: content.duration,
          format: content.format,
        };

        // Add to contexts
        contentContext.addContent(contextContent);
        session.addContentId(content.id);
        session.setCurrentContentId(content.id);

        // Load into audio player with auto-play
        audioPlayer.loadContent(contextContent, true);

        setStatus('completed');
        onStatusUpdate?.('completed');
        onSuccess?.(content);

        return content;
      }
      
      // Update status based on response
      if (generationResponse.status === 'processing') {
        setStatus('processing');
        onStatusUpdate?.('processing');
      }

      // Poll until complete (for async generation)
      const content = await contentService.pollUntilComplete(
        generationResponse.generationId,
        {
          pollInterval: 2000,
          maxDuration: 30000,
          onStatusUpdate: (statusResponse) => {
            setStatus(statusResponse.status);
            onStatusUpdate?.(statusResponse.status);
          },
        }
      );

      // Convert API Content to context Content format
      const contextContent = {
        id: content.id,
        title: content.title,
        subtitle: content.description,
        audioUrl: content.audioUrl,
        duration: content.duration,
        format: content.format,
      };

      // Add to contexts
      contentContext.addContent(contextContent);
      session.addContentId(content.id);
      session.setCurrentContentId(content.id);

      // Load into audio player with auto-play
      audioPlayer.loadContent(contextContent, true);

      setStatus('completed');
      onStatusUpdate?.('completed');
      onSuccess?.(content);

      return content;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setStatus('failed');
      onStatusUpdate?.('failed');
      onError?.(error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [session, contentContext, audioPlayer, onSuccess, onError, onStatusUpdate]);

  return {
    generate,
    isGenerating,
    error,
    status,
  };
};
