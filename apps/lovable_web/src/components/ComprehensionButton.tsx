import { useState } from "react";
import { Brain } from "lucide-react";

interface ComprehensionButtonProps {
  onSelect?: (percentage: number) => void;
  initialPercentage?: number | null;
}

const ComprehensionButton = ({ onSelect, initialPercentage = null }: ComprehensionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(initialPercentage);

  const percentageOptions = [0, 25, 50, 75, 100];

  const handleSelect = (value: number) => {
    setPercentage(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 h-12 px-4 rounded-full transition-all duration-200 
          ${percentage !== null ? 'bg-primary/10 text-primary' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
        aria-label="Rate your comprehension"
      >
        <Brain className="w-5 h-5" />
        {percentage !== null ? (
          <span className="text-sm font-medium">{percentage}%</span>
        ) : (
          <span className="text-sm">Capito?</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 animate-fade-in z-50">
          <div className="bg-card rounded-lg shadow-elevated p-2 flex gap-1 border border-border">
            {percentageOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200
                  ${percentage === option 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-foreground'
                  }`}
              >
                {option}%
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensionButton;
