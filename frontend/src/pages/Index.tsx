import { useState, useEffect } from "react";
import { Bot, Mail, Sparkles } from "lucide-react";
import { EmailCard } from "@/components/EmailCard";
import { AudioPlayer } from "@/components/AudioPlayer";
import { NavigationControls } from "@/components/NavigationControls";
import { toast } from "@/hooks/use-toast";
import { getEmail, summarizeEmail as apiSummarizeEmail, speakSummary } from "@/lib/api";

interface Email {
  subject: string;
  body: string;
}

interface Summary {
  summary: string;
}

const Index = () => {
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState<Email | null>(null);
  const [summary, setSummary] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchEmail = async (emailIndex: number): Promise<Email> => {
    return getEmail(emailIndex);
  };

  const summarizeEmail = async (subject: string, body: string): Promise<Summary> => {
    return apiSummarizeEmail(subject, body);
  };

  const speakText = async (text: string): Promise<void> => {
    setIsGeneratingAudio(true);
    try {
      await speakSummary(text);
      toast({
        title: "Audio Playing",
        description: "Summary playback started",
      });
    } catch (error) {
      console.error('Failed to play speech:', error);
      toast({
        title: "Playback Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const loadEmailAtIndex = async (emailIndex: number) => {
    setHasError(false);
    setIsLoadingEmail(true);
    setIsLoadingSummary(false);
    setSummary("");
    
    try {
      const emailData = await fetchEmail(emailIndex);
      setEmail(emailData);
      
      const subject = emailData.subject || '(No Subject)';
      
      // Check if this is the "no more messages" state
      if (subject === 'No more messages') {
        setSummary('You have no more messages in your inbox.');
        return;
      }
      
      // Generate summary
      setIsLoadingSummary(true);
      const summaryData = await summarizeEmail(subject, emailData.body || '');
      setSummary(summaryData.summary || '(No summary)');
      
    } catch (error) {
      console.error('Error loading email:', error);
      setHasError(true);
      setEmail({ subject: 'Error', body: '' });
      setSummary('Failed to load email or generate summary. Please try again.');
      
      toast({
        title: "Error Loading Email",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmail(false);
      setIsLoadingSummary(false);
    }
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, index - 1);
    setIndex(newIndex);
    loadEmailAtIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    loadEmailAtIndex(newIndex);
  };

  const handleRefresh = () => {
    loadEmailAtIndex(index);
  };

  // Load initial email
  useEffect(() => {
    loadEmailAtIndex(index);
  }, []);

  const isLoading = isLoadingEmail || isLoadingSummary;
  const currentSubject = email?.subject || "";
  const currentSummary = summary;

  return (
    <div className="min-h-screen bg-subtle-gradient">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ai-gradient float-animation">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                AI Voice Inbox
                <Sparkles className="h-5 w-5 text-accent" />
              </h1>
              <p className="text-muted-foreground">Smart email summarization with voice synthesis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Navigation Controls */}
        <NavigationControls
          currentIndex={index}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Email Display */}
        <EmailCard
          index={index}
          subject={currentSubject}
          summary={currentSummary}
          isLoading={isLoading}
          hasError={hasError}
        />

        {/* Audio Player */}
        <AudioPlayer
          onSpeak={speakText}
          currentSummary={currentSummary}
          isGenerating={isGeneratingAudio}
        />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Mail className="h-4 w-4" />
            <span>Powered by AI • Beautiful voice synthesis</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;