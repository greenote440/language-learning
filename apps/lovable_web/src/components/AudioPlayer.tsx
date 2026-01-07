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
  // Try to use context, but fall back to props for backward compatibility
  let audioPlayerContext;
  try {
    audioPlayerContext = useAudioPlayer();
  } catch {
    audioPlayerContext = null;
  }

  // Use context audioUrl if available, otherwise use prop
  const audioUrl = audioPlayerContext?.getCurrentAudioUrl() || propAudioUrl;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(false);
  const actionTimestampRef = useRef<number>(0);

  // Sync with context state if available
  useEffect(() => {
    if (audioPlayerContext) {
      setIsPlaying(audioPlayerContext.state.isPlaying);
      setCurrentTime(audioPlayerContext.state.currentTime);
      setDuration(audioPlayerContext.state.duration);
    }
  }, [audioPlayerContext?.state.isPlaying, audioPlayerContext?.state.currentTime, audioPlayerContext?.state.duration]);

  // Reset state when audioUrl changes
  useEffect(() => {
    if (!audioUrl) {
      setIsLoading(false); // Don't show loading if no audio URL (mock mode)
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

  // Sync audio element with context playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioPlayerContext) return;

    if (audioPlayerContext.state.isPlaying && !isPlaying) {
      audio.play().catch((err: Error) => {
        // Handle browser auto-play policy rejection (expected behavior)
        if (err.name === 'NotAllowedError' || err.message?.includes('play')) {
          // This is expected - browsers block autoplay without user interaction
          // Only log in development, and as info not error
          if (process.env.NODE_ENV === 'development') {
            console.log('Autoplay blocked by browser policy (expected):', err.message);
          }
          audioPlayerContext.setAutoPlayBlocked(true);
          // Update context state to reflect that play failed
          audioPlayerContext.pause();
        } else {
          // Other errors should still be logged
          console.error('Failed to play audio:', err);
        }
      });
    } else if (!audioPlayerContext.state.isPlaying && isPlaying) {
      audio.pause();
    }
  }, [audioPlayerContext?.state.isPlaying, isPlaying, audioPlayerContext]);

  // Sync audio element currentTime with context
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioPlayerContext) return;

    const contextTime = audioPlayerContext.state.currentTime;
    if (Math.abs(audio.currentTime - contextTime) > 0.5) {
      audio.currentTime = contextTime;
    }
  }, [audioPlayerContext?.state.currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      const dur = audio.duration;
      if (isFinite(time) && !isNaN(time)) {
        setCurrentTime(time);
        // Update context if available
        audioPlayerContext?.updateTime(time, dur);
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

    const handlePlaying = () => {
      setBuffering(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Update context if available
      audioPlayerContext?.handleEnded();
      onEnded?.();
    };

    const handleError = () => {
      const audioError = audio.error;
      if (audioError) {
        let errorMessage = "Errore di riproduzione";
        switch (audioError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Riproduzione interrotta";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Errore di rete";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Errore di decodifica";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            // In mock mode, audio might not be available - show a friendly message
            if (process.env.NODE_ENV === 'development' && audioUrl?.includes('soundhelix')) {
              errorMessage = "Modalità test: audio non disponibile";
            } else {
              errorMessage = "Formato audio non supportato";
            }
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
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('suspend', handleSuspend);
    };
  }, [isPlaying, onTimeUpdate, onEnded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    // Use context method if available, otherwise manage locally
    if (audioPlayerContext) {
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
    
    // Use context method if available
    if (audioPlayerContext) {
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
    
    // Use context method if available
    if (audioPlayerContext) {
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

  // Check if auto-play was blocked
  const autoPlayBlocked = audioPlayerContext?.autoPlayBlocked || false;

  return (
    <div className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
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
