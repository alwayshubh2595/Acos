import openai
import sounddevice as sd
import numpy as np
import io
import os
from scipy.io.wavfile import write
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client with API key
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-mini-transcribe",
        file=("speech.wav", buffer, "audio/wav")
    )

    return transcript.text
