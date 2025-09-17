import openai
import sounddevice as sd
import numpy as np
import io
from scipy.io.wavfile import write

def listen_to_speech(duration: int = 5, samplerate: int = 16000) -> str:
    print("🎤 Listening... (speak now)")

    # Record audio
    recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype="int16")
    sd.wait()

    # Save to in-memory WAV
    buffer = io.BytesIO()
    write(buffer, samplerate, recording)
    buffer.seek(0)

    # Send to Whisper API
    transcript = openai.audio.transcriptions.create(
        model="gpt-4o-mini-transcribe",
        file=("speech.wav", buffer, "audio/wav")
    )

    return transcript.text
