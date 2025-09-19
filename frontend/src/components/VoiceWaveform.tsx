export function VoiceWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 bg-voice/10 rounded-lg">
      <div className="audio-wave h-3"></div>
      <div className="audio-wave h-6"></div>
      <div className="audio-wave h-4"></div>
      <div className="audio-wave h-7"></div>
      <div className="audio-wave h-3"></div>
      <div className="audio-wave h-5"></div>
      <div className="audio-wave h-2"></div>
    </div>
  );
}