from __future__ import annotations

from typing import Optional

from utils.logger import get_logger


logger = get_logger(__name__)


class LLMEngine:
    def __init__(self, provider: str = "openai") -> None:
        self.provider = provider

    def generate(self, prompt: str, system: Optional[str] = None) -> str:
        logger.info("Generating with provider=%s", self.provider)
        # Stub response
        return "This is a placeholder response."


