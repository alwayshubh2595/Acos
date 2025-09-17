from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List

from utils.logger import get_logger


logger = get_logger(__name__)


@dataclass
class CalendarEvent:
    id: str
    title: str
    start: datetime
    end: datetime


class CalendarClient:
    def __init__(self, provider: str = "google") -> None:
        self.provider = provider

    def create_event(self, title: str, start: datetime, end: datetime, attendees: List[str] | None = None) -> CalendarEvent | None:
        logger.info("Creating calendar event via provider=%s", self.provider)
        return None


