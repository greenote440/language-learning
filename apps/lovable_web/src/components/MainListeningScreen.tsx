import { useState, useEffect, useCallback } from "react";
import { Settings, ChevronDown } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import LikeButton from "./LikeButton";
import ComprehensionButton from "./ComprehensionButton";

interface AudioClip {
  id: string;
  title: string;
  subtitle?: string;
  format: 'narrative' | 'podcast' | 'educational';
  audioUrl?: string;
  duration?: number;
}

interface MainListeningScreenProps {
  initialClip?: AudioClip;
  onContentChange?: (direction: 'forward' | 'backward') => void;
  onLike?: (clipId: string, liked: boolean) => void;
  onComprehensionReport?: (clipId: string, percentage: number) => void;
}

const formatBadge: Record<AudioClip['format'], string> = {
  narrative: 'Racconto',
  podcast: 'Podcast',
  educational: 'Lezione',
};

const MainListeningScreen = ({
  initialClip,
  onContentChange,
  onLike,
  onComprehensionReport,
}: MainListeningScreenProps) => {
  const [currentClip, setCurrentClip] = useState<AudioClip>(
    initialClip || {
      id: '1',
      title: 'Una Passeggiata per Roma',
      subtitle: 'Discovering the Eternal City through sound',
      format: 'narrative',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const handleScroll = useCallback((e: WheelEvent) => {
    if (isLoading) return;
    
    const direction = e.deltaY > 0 ? 'forward' : 'backward';
    setShowScrollHint(false);
    
    // Placeholder for content change
    console.log('Scroll direction:', direction);
    onContentChange?.(direction);
  }, [isLoading, onContentChange]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  // Hide scroll hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (liked: boolean) => {
    onLike?.(currentClip.id, liked);
  };

  const handleComprehension = (percentage: number) => {
    onComprehensionReport?.(currentClip.id, percentage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="w-12" /> {/* Spacer for balance */}
        <h1 className="font-serif text-lg text-muted-foreground tracking-wide">
          Italiano
        </h1>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-safe">
        {/* Episode Info */}
        <div className="text-center mb-10 md:mb-14 max-w-lg animate-fade-in">
          {/* Format Badge */}
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase bg-secondary text-secondary-foreground rounded-full">
            {formatBadge[currentClip.format]}
          </span>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-3">
            {currentClip.title}
          </h2>

          {/* Subtitle */}
          {currentClip.subtitle && (
            <p className="text-muted-foreground text-base md:text-lg">
              {currentClip.subtitle}
            </p>
          )}
        </div>

        {/* Audio Player */}
        <div className="w-full max-w-md mb-10 md:mb-14">
          <AudioPlayer audioUrl={currentClip.audioUrl} />
        </div>

        {/* Feedback Controls */}
        <div className="flex items-center gap-4">
          <LikeButton onLike={handleLike} />
          <ComprehensionButton onSelect={handleComprehension} />
        </div>
      </main>

      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fade-in">
          <span className="text-xs text-muted-foreground mb-2">Scroll for more</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Preparando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainListeningScreen;
