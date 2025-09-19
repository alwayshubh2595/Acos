import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { VoiceWaveform } from "./VoiceWaveform";

interface AudioPlayerProps {
  onSpeak: (text: string) => Promise<void>;
  currentSummary: string;
  isGenerating: boolean;
}

export function AudioPlayer({ onSpeak, currentSummary, isGenerating }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSpeak = async () => {
    if (!currentSummary || currentSummary === "(Loading...)" || currentSummary === "Loading...") return;
    
    try {
      await onSpeak(currentSummary);
    } catch (error) {
      console.error('Failed to generate speech:', error);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="voice-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-voice-gradient">
            <Volume2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Voice Assistant</h3>
            <p className="text-sm text-muted-foreground">Text-to-Speech Engine</p>
          </div>
        </div>
        
        {isPlaying && <VoiceWaveform />}
      </div>

      {/* Audio Controls */}
      <div className="space-y-4">
        <audio ref={audioRef} className="hidden" />
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-voice-gradient transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMute}
            className="rounded-full"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={!audioRef.current?.src}
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button
            onClick={handleSpeak}
            disabled={isGenerating || !currentSummary || currentSummary === "(Loading...)" || currentSummary === "Loading..."}
            className="bg-voice-gradient hover:bg-voice-gradient/90 text-white px-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Speak Summary
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}