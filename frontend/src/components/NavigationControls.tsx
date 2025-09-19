import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface NavigationControlsProps {
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function NavigationControls({ 
  currentIndex, 
  onPrevious, 
  onNext, 
  onRefresh, 
  isLoading 
}: NavigationControlsProps) {
  return (
    <Card className="voice-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex <= 0 || isLoading}
            className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="px-6 py-3 bg-ai-gradient rounded-lg text-white font-semibold min-w-[120px] text-center">
            Email #{currentIndex}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={isLoading}
            className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </Card>
  );
}