import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Bot } from "lucide-react";

interface EmailCardProps {
  index: number;
  subject: string;
  summary: string;
  isLoading: boolean;
  hasError: boolean;
}

export function EmailCard({ index, subject, summary, isLoading, hasError }: EmailCardProps) {
  const getStatusColor = () => {
    if (hasError) return "destructive";
    if (isLoading) return "secondary";
    return "success";
  };

  const getStatusText = () => {
    if (hasError) return "Error";
    if (isLoading) return "Loading...";
    return "Ready";
  };

  return (
    <Card className="voice-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-ai-gradient">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Email #{index}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>AI Processed</span>
            </div>
          </div>
        </div>
        <Badge variant={getStatusColor() as any} className="flex items-center gap-1">
          <Bot className="h-3 w-3" />
          {getStatusText()}
        </Badge>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Subject
        </label>
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="font-semibold text-foreground">
            {isLoading ? "Loading subject..." : subject || "(No Subject)"}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI Summary
        </label>
        <div className="p-4 rounded-lg border-2 border-primary/10 bg-subtle-gradient">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {isLoading ? "Generating AI summary..." : summary || "(No summary available)"}
          </p>
        </div>
      </div>
    </Card>
  );
}