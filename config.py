import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass
class Settings:
    # LLM Providers
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    anthropic_api_key: str | None = os.getenv("ANTHROPIC_API_KEY")

    # Google APIs
    google_credentials_path: str | None = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    # Speech
    elevenlabs_api_key: str | None = os.getenv("ELEVENLABS_API_KEY")

    # General
    environment: str = os.getenv("ENV", "dev")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

settings = get_settings()


