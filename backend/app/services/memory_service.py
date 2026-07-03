from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class MemoryService(ABC):
    @abstractmethod
    async def remember(
        self,
        session_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
        metadata: dict[str, Any],
    ) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def recall(self, session_id: str, question: str, graph_snapshot: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def dismiss(self, session_id: str, memory_id: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def refine(
        self,
        session_id: str,
        existing_memory_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
    ) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def graph(self, session_id: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    async def healthcheck(self) -> dict[str, Any]:
        raise NotImplementedError
