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
    <div className="relative">
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-elevated p-2 flex gap-1">
            {percentageOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200
                  ${percentage === option 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-foreground'
                  }`}
              >
                {option}%
              </button>
            ))}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-card rotate-45 shadow-sm" />
        </div>
      )}
    </div>
  );
};

export default ComprehensionButton;
