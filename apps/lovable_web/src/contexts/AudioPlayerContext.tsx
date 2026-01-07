import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { eventService } from '@/services/eventService';

// Simplified Content interface for MVP
interface Content {
  id: string;
  title: string;
  audioUrl?: string; // Optional for mock mode
  duration?: number;
  format?: 'narrative' | 'podcast' | 'educational';
}

interface AudioPlayerState {
  currentContent: Content | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackPosition: Record<string, number>; // Track position for each content ID
}

interface AudioPlayerContextType {
  state: AudioPlayerState;
  // Content control
  loadContent: (content: Content, autoPlay?: boolean) => void;
  switchContent: (content: Content) => void;
  // Playback control
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  seek: (time: number) => void;
  // State updates from AudioPlayer component
  updateTime: (currentTime: number, duration: number) => void;
  handleEnded: () => void;
  // Auto-play state
  autoPlayBlocked: boolean;
  setAutoPlayBlocked: (blocked: boolean) => void;
  // Getters
  getCurrentAudioUrl: () => string | undefined;
  getPlaybackPosition: (contentId: string) => number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const [state, setState] = useState<AudioPlayerState>({
    currentContent: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackPosition: {},
  });

  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);

  // Store previous content when switching to restore position later
  const previousContentRef = useRef<Content | null>(null);

  // Note: savePlaybackPosition is now inline in each function to avoid dependency issues

  // Playback controls - defined before loadContent to avoid dependency issues
  const play = useCallback(async () => {
    // This is a placeholder - actual play() is handled by AudioPlayer component
    // We just update the state here
    setState((prev) => {
      if (prev.currentContent) {
        // Track play event
        eventService.trackEvent(
          prev.currentContent.id,
          'play',
          prev.currentTime,
          prev.duration,
          {
            format: prev.currentContent.format,
            title: prev.currentContent.title,
          }
        );
      }
      return { ...prev, isPlaying: true };
    });
    
    // Clear auto-play blocked state when user manually plays
    setAutoPlayBlocked(false);
  }, []);

  // Load new content
  const loadContent = useCallback((content: Content, autoPlay: boolean = false) => {
    setState((prev) => {
      // Save position of previous content if it exists
      const prevContent = prev.currentContent;
      if (prevContent && prev.currentTime > 0) {
        const updatedPositions = {
          ...prev.playbackPosition,
          [prevContent.id]: prev.currentTime,
        };
        // Update positions in the return object
        return {
          ...prev,
          playbackPosition: updatedPositions,
          currentContent: content,
          currentTime: prev.playbackPosition[content.id] || 0, // Restore saved position
          isPlaying: false,
          duration: content.duration || 0,
        };
      }

      previousContentRef.current = prevContent;

      return {
        ...prev,
        currentContent: content,
        currentTime: prev.playbackPosition[content.id] || 0, // Restore saved position
        isPlaying: false,
        duration: content.duration || 0,
      };
    });

    // Attempt auto-play if requested
    if (autoPlay) {
      // Small delay to ensure audio element is ready
      setTimeout(() => {
        play().catch((error: Error) => {
          // Browser blocked auto-play - this is expected
          if (error.name === 'NotAllowedError' || error.message?.includes('play')) {
            setAutoPlayBlocked(true);
          }
        });
      }, 100);
    }
  }, [play]);

  // Switch content (for scroll-triggered changes)
  const switchContent = useCallback((content: Content) => {
    setState((prev) => {
      // Save position of current content before switching
      const prevContent = prev.currentContent;
      const updatedPositions = { ...prev.playbackPosition };
      
      if (prevContent && prev.currentTime > 0) {
        updatedPositions[prevContent.id] = prev.currentTime;
        
        // Track content switch event for previous content
        eventService.trackEvent(
          prevContent.id,
          'content-switch',
          prev.currentTime,
          prev.duration,
          {
            format: prevContent.format,
            title: prevContent.title,
          }
        );
      }

      // Get saved position for new content
      const savedPosition = updatedPositions[content.id] || 0;

      previousContentRef.current = prevContent;

      return {
        ...prev,
        playbackPosition: updatedPositions,
        currentContent: content,
        currentTime: savedPosition,
        isPlaying: false, // Pause current, will start new after load
        duration: content.duration || 0,
      };
    });
  }, []);


  const pause = useCallback(() => {
    setState((prev) => {
      // Save position when pausing
      if (prev.currentContent && prev.currentTime > 0) {
        // Track pause event
        eventService.trackEvent(
          prev.currentContent.id,
          'pause',
          prev.currentTime,
          prev.duration,
          {
            format: prev.currentContent.format,
            title: prev.currentContent.title,
          }
        );

        return {
          ...prev,
          isPlaying: false,
          playbackPosition: {
            ...prev.playbackPosition,
            [prev.currentContent.id]: prev.currentTime,
          },
        };
      }
      return { ...prev, isPlaying: false };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState((prev) => {
      const newIsPlaying = !prev.isPlaying;
      if (prev.currentContent) {
        // Track play/pause event
        eventService.trackEvent(
          prev.currentContent.id,
          newIsPlaying ? 'play' : 'pause',
          prev.currentTime,
          prev.duration,
          {
            format: prev.currentContent.format,
            title: prev.currentContent.title,
          }
        );
      }
      // Save position when pausing
      if (!newIsPlaying && prev.currentContent && prev.currentTime > 0) {
        return {
          ...prev,
          isPlaying: newIsPlaying,
          playbackPosition: {
            ...prev.playbackPosition,
            [prev.currentContent.id]: prev.currentTime,
          },
        };
      }
      return { ...prev, isPlaying: newIsPlaying };
    });
  }, []);

  const skipForward = useCallback((seconds: number = 15) => {
    setState((prev) => {
      if (!prev.duration || !prev.currentContent) return prev;
      const newTime = Math.min(prev.currentTime + seconds, prev.duration);
      
      // Track skip-forward event
      eventService.trackEvent(
        prev.currentContent.id,
        'skip-forward',
        prev.currentTime,
        prev.duration,
        {
          format: prev.currentContent.format,
          title: prev.currentContent.title,
        }
      );

      return { ...prev, currentTime: newTime };
    });
  }, []);

  const skipBackward = useCallback((seconds: number = 15) => {
    setState((prev) => {
      if (!prev.currentContent) return prev;
      const newTime = Math.max(prev.currentTime - seconds, 0);
      
      // Track skip-backward event
      eventService.trackEvent(
        prev.currentContent.id,
        'skip-backward',
        prev.currentTime,
        prev.duration,
        {
          format: prev.currentContent.format,
          title: prev.currentContent.title,
        }
      );

      return { ...prev, currentTime: newTime };
    });
  }, []);

  const seek = useCallback((time: number) => {
    setState((prev) => {
      if (!prev.duration) return prev;
      const newTime = Math.max(0, Math.min(time, prev.duration));
      return { ...prev, currentTime: newTime };
    });
  }, []);

  // Update time from AudioPlayer component
  const updateTime = useCallback((currentTime: number, duration: number) => {
    setState((prev) => ({
      ...prev,
      currentTime,
      duration: duration || prev.duration,
    }));
  }, []);

  // Handle audio ended
  const handleEnded = useCallback(() => {
    setState((prev) => {
      // Save position when content ends (at duration)
      if (prev.currentContent && prev.duration > 0) {
        // Track completion event
        eventService.trackEvent(
          prev.currentContent.id,
          'complete',
          prev.duration,
          prev.duration,
          {
            format: prev.currentContent.format,
            title: prev.currentContent.title,
          }
        );

        return {
          ...prev,
          isPlaying: false,
          currentTime: 0,
          playbackPosition: {
            ...prev.playbackPosition,
            [prev.currentContent.id]: prev.duration,
          },
        };
      }
      return {
        ...prev,
        isPlaying: false,
        currentTime: 0,
      };
    });
  }, []);

  // Get current audio URL
  const getCurrentAudioUrl = useCallback(() => {
    return state.currentContent?.audioUrl;
  }, [state.currentContent]);

  // Get saved playback position for content
  const getPlaybackPosition = useCallback((contentId: string) => {
    return state.playbackPosition[contentId] || 0;
  }, [state.playbackPosition]);

  const value: AudioPlayerContextType = {
    state,
    loadContent,
    switchContent,
    play,
    pause,
    togglePlay,
    skipForward,
    skipBackward,
    seek,
    updateTime,
    handleEnded,
    autoPlayBlocked,
    setAutoPlayBlocked,
    getCurrentAudioUrl,
    getPlaybackPosition,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
