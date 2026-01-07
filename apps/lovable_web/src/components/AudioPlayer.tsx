import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({ audioUrl, onTimeUpdate, onEnded }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, onEnded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Playback error:', error);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        preload="metadata"
      />

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {/* Skip Back */}
        <button
          onClick={() => skip(-15)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 active:scale-95"
          aria-label="Skip back 15 seconds"
        >
          <RotateCcw className="w-6 h-6 text-foreground" />
          <span className="absolute text-[10px] font-medium text-foreground">15</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full 
            bg-primary text-primary-foreground shadow-elevated
            hover:shadow-elevated-hover transition-all duration-200 active:scale-95
            ${isLoading ? 'opacity-50' : ''}`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 md:w-10 md:h-10" />
          ) : (
            <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />
          )}
        </button>

        {/* Skip Forward */}
        <button
          onClick={() => skip(15)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-muted/50 hover:bg-muted transition-all duration-200 active:scale-95"
          aria-label="Skip forward 15 seconds"
        >
          <RotateCw className="w-6 h-6 text-foreground" />
          <span className="absolute text-[10px] font-medium text-foreground">15</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div
          className="relative h-1.5 bg-muted rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
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
