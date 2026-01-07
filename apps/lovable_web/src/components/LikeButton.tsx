import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  onLike?: (liked: boolean) => void;
  initialLiked?: boolean;
}

const LikeButton = ({ onLike, initialLiked = false }: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onLike?.(newLiked);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 
        ${liked ? 'bg-accent/20' : 'bg-muted/50 hover:bg-muted'}
        ${isAnimating ? 'scale-125' : 'scale-100'}`}
      aria-label={liked ? "Unlike this episode" : "Like this episode"}
    >
      <Heart
        className={`w-6 h-6 transition-all duration-300 ${
          liked 
            ? 'fill-accent text-accent' 
            : 'text-muted-foreground'
        } ${isAnimating ? 'scale-110' : 'scale-100'}`}
      />
    </button>
  );
};

export default LikeButton;
