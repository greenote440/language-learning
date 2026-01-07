import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, RotateCw, AlertCircle } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

interface AudioPlayerProps {
  audioUrl?: string; // Optional prop for backward compatibility
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({ audioUrl: propAudioUrl, onTimeUpdate, onEnded }: AudioPlayerProps) => {
  // Determine if we're using props (independent mode) or context (shared mode)
  const isIndependentMode = !!propAudioUrl;
  
  // Try to use context, but fall back to props for backward compatibility
  let audioPlayerContext;
  if (!isIndependentMode) {
    try {
      audioPlayerContext = useAudioPlayer();
    } catch {
      audioPlayerContext = null;
    }
  } else {
    audioPlayerContext = null; // Don't use context in independent mode
  }

  // Prioritize prop if explicitly provided, otherwise use context
  const audioUrl = propAudioUrl || audioPlayerContext?.getCurrentAudioUrl();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(false);
  const actionTimestampRef = useRef<number>(0);

  // Only sync with context state if NOT in independent mode
  useEffect(() => {
    if (!isIndependentMode && audioPlayerContext) {
      setIsPlaying(audioPlayerContext.state.isPlaying);
      setCurrentTime(audioPlayerContext.state.currentTime);
      setDuration(audioPlayerContext.state.duration);
    }
  }, [isIndependentMode, audioPlayerContext?.state.isPlaying, audioPlayerContext?.state.currentTime, audioPlayerContext?.state.duration]);

  // Reset state when audioUrl changes
  useEffect(() => {
    if (!audioUrl) {
      setIsLoading(true);
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Reset error state when new URL is set
    setError(null);
    setIsLoading(true);
    setBuffering(false);

    // Load new audio source
    audio.load();
  }, [audioUrl]);

  // Sync audio element with context playback state (only if not in independent mode)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isIndependentMode || !audioPlayerContext) return;

    if (audioPlayerContext.state.isPlaying && !isPlaying) {
      audio.play().catch((err: Error) => {
        console.error('Failed to play audio:', err);
        // Handle browser auto-play policy rejection
        if (err.name === 'NotAllowedError' || err.message?.includes('play')) {
          audioPlayerContext.setAutoPlayBlocked(true);
          // Update context state to reflect that play failed
          audioPlayerContext.pause();
        }
      });
    } else if (!audioPlayerContext.state.isPlaying && isPlaying) {
      audio.pause();
    }
  }, [isIndependentMode, audioPlayerContext?.state.isPlaying, isPlaying, audioPlayerContext]);

  // Sync audio element currentTime with context (only if not in independent mode)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isIndependentMode || !audioPlayerContext) return;

    const contextTime = audioPlayerContext.state.currentTime;
    if (Math.abs(audio.currentTime - contextTime) > 0.5) {
      audio.currentTime = contextTime;
    }
  }, [isIndependentMode, audioPlayerContext?.state.currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      const dur = audio.duration;
      if (isFinite(time) && !isNaN(time)) {
        setCurrentTime(time);
        // Update context if available and not in independent mode
        if (!isIndependentMode && audioPlayerContext) {
          audioPlayerContext.updateTime(time, dur);
        }
        onTimeUpdate?.(time, dur);
      }
    };

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (isFinite(dur) && !isNaN(dur)) {
        setDuration(dur);
      }
      setIsLoading(false);
      setBuffering(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      setBuffering(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setBuffering(false);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setBuffering(false);
    };

    const handleWaiting = () => {
      if (isPlaying) {
        setBuffering(true);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setBuffering(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlaying = () => {
      setBuffering(false);
      // Ensure isPlaying is true when actually playing
      if (!isPlaying) {
        setIsPlaying(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Update context if available and not in independent mode
      if (!isIndependentMode && audioPlayerContext) {
        audioPlayerContext.handleEnded();
      }
      onEnded?.();
    };

    const handleError = () => {
      const audioError = audio.error;
      if (audioError) {
        console.error('Audio error occurred:', {
          code: audioError.code,
          message: audioError.message,
          url: audioUrl,
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
        
        let errorMessage = "Errore di riproduzione";
        switch (audioError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Riproduzione interrotta";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Errore di rete - verifica la connessione";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Errore di decodifica del file audio";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Formato audio non supportato o URL non valido";
            console.error('URL non supportato:', audioUrl);
            break;
        }
        setError(errorMessage);
        setIsPlaying(false);
        setIsLoading(false);
        setBuffering(false);
      }
    };

    const handleStalled = () => {
      if (isPlaying) {
        setBuffering(true);
      }
    };

    const handleSuspend = () => {
      setBuffering(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('suspend', handleSuspend);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('suspend', handleSuspend);
    };
  }, [audioUrl, isIndependentMode, audioPlayerContext, onTimeUpdate, onEnded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    // Use context method if available and not in independent mode, otherwise manage locally
    if (!isIndependentMode && audioPlayerContext) {
      // Clear auto-play blocked state when user manually interacts
      if (audioPlayerContext.autoPlayBlocked) {
        audioPlayerContext.setAutoPlayBlocked(false);
      }
      audioPlayerContext.togglePlay();
      return;
    }

    // Track action timestamp for responsiveness check
    actionTimestampRef.current = performance.now();

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setError(null);
        await audio.play();
        setIsPlaying(true);
        const responseTime = performance.now() - actionTimestampRef.current;
        // Log if response time exceeds 100ms (for debugging)
        if (responseTime > 100) {
          console.warn(`Play action took ${responseTime.toFixed(2)}ms (target: <100ms)`);
        }
      }
    } catch (error) {
      const err = error as Error;
      console.error('Playback error:', err);
      setError("Impossibile riprodurre l'audio");
      setIsPlaying(false);
      // Handle autoplay policy violations
      if (err.name === 'NotAllowedError') {
        setError("Riproduzione automatica non consentita. Clicca Play.");
      }
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    // Use context method if available and not in independent mode
    if (!isIndependentMode && audioPlayerContext) {
      if (seconds > 0) {
        audioPlayerContext.skipForward(seconds);
      } else {
        audioPlayerContext.skipBackward(Math.abs(seconds));
      }
      // Still update audio element directly for immediate feedback
      const newTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
      audio.currentTime = newTime;
      return;
    }
    
    // Track action timestamp for responsiveness check
    actionTimestampRef.current = performance.now();
    
    const newTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
    audio.currentTime = newTime;
    
    const responseTime = performance.now() - actionTimestampRef.current;
    // Log if response time exceeds 100ms (for debugging)
    if (responseTime > 100) {
      console.warn(`Skip action took ${responseTime.toFixed(2)}ms (target: <100ms)`);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || error) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
    const seekTime = percentage * duration;
    
    // Use context method if available and not in independent mode
    if (!isIndependentMode && audioPlayerContext) {
      audioPlayerContext.seek(seekTime);
    }
    
    // Update audio element directly for immediate feedback
    audio.currentTime = seekTime;
    
    // Track action timestamp for responsiveness check
    actionTimestampRef.current = performance.now();
    const responseTime = performance.now() - actionTimestampRef.current;
    // Log if response time exceeds 100ms (for debugging)
    if (responseTime > 100) {
      console.warn(`Seek action took ${responseTime.toFixed(2)}ms (target: <100ms)`);
    }
  };

  const progress = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  // Check if auto-play was blocked (only in context mode)
  const autoPlayBlocked = (!isIndependentMode && audioPlayerContext?.autoPlayBlocked) || false;

  return (
    <div className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onError={(e) => {
          console.error('Audio loading error:', e);
          const audio = e.currentTarget;
          if (audio.error) {
            console.error('Audio error code:', audio.error.code);
            console.error('Audio error message:', audio.error.message);
            console.error('Audio URL:', audioUrl);
          }
        }}
        onLoadedMetadata={() => {
          console.log('Audio metadata loaded successfully for:', audioUrl);
        }}
      />

      {/* Auto-play Blocked Message */}
      {autoPlayBlocked && !isPlaying && (
        <div className="mb-4 px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-primary">Clicca Play per iniziare</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              La riproduzione automatica è stata bloccata dal browser
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {/* Skip Back */}
        <button
          onClick={() => skip(-15)}
          disabled={!audioUrl || error !== null || duration === 0}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Skip back 15 seconds"
        >
          <RotateCcw className="w-6 h-6 text-foreground" />
          <span className="absolute text-[10px] font-medium text-foreground">15</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading || !audioUrl || error !== null}
          className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full 
            bg-primary text-primary-foreground shadow-elevated
            hover:shadow-elevated-hover transition-all duration-200 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {buffering && isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : isPlaying ? (
            <Pause className="w-8 h-8 md:w-10 md:h-10" />
          ) : (
            <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
          )}
          {isLoading && !buffering && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Skip Forward */}
        <button
          onClick={() => skip(15)}
          disabled={!audioUrl || error !== null || duration === 0}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Skip forward 15 seconds"
        >
          <RotateCw className="w-6 h-6 text-foreground" />
          <span className="absolute text-[10px] font-medium text-foreground">15</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div
          className={`relative h-1.5 bg-muted rounded-full group ${
            !error && audioUrl ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleProgressClick}
        >
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          {buffering && (
            <div className="absolute inset-0 bg-muted/50 animate-pulse" />
          )}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between mt-3 text-sm text-muted-foreground font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
