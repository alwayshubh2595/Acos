from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class MemoryStore:
    user_preferences: Dict[str, str] = field(default_factory=dict)
    common_replies: List[str] = field(default_factory=list)

    def set_preference(self, key: str, value: str) -> None:
        self.user_preferences[key] = value

    def get_preference(self, key: str, default: str | None = None) -> str | None:
        return self.user_preferences.get(key, default)


