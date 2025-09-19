# core/text_to_speech.py
import openai
import tempfile
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client with API key
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def speak_text(text: str):
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=text
    )

    audio_data = response.read()

    # Save MP3 to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        f.write(audio_data)
        temp_path = f.name

    # Let Windows play it with default player
    os.startfile(temp_path)


def synthesize_speech_bytes(text: str) -> tuple[bytes, str]:
    """Return synthesized speech bytes and content type for API responses."""
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=text
    )
    audio_data = response.read()
    # OpenAI commonly returns MP3; adjust if needed
    return audio_data, "audio/mpeg"
