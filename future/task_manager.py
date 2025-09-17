from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from utils.logger import get_logger


logger = get_logger(__name__)


@dataclass
class Task:
    id: str
    title: str
    note: Optional[str] = None


class TaskManagerClient:
    def __init__(self, provider: str = "todoist") -> None:
        self.provider = provider

    def add_task(self, title: str, note: Optional[str] = None) -> Task | None:
        logger.info("Adding task via provider=%s", self.provider)
        return None


