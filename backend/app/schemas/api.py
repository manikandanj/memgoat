from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class CommitMemoryRequest(BaseModel):
    object_id: str
    candidate_id: str


class AskEchoRequest(BaseModel):
    question: str


class SessionResponse(BaseModel):
    id: str
    chain_id: str
    current_room_id: str
    sealed_rooms: list[str]
    reset_count: int
    timer_seconds: int
    goat_context: str


class RoomResponse(BaseModel):
    id: str
    title: str
    summary: str
    goat_context: str
    hotspots: list[dict[str, Any]]
    exits: list[dict[str, Any]]
    sealed_rooms: list[str]


class InspectionResponse(BaseModel):
    object_id: str
    label: str
    prompt: str
    observation: str
    candidates: list[dict[str, Any]]


class GraphResponse(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]
    highlighted_path: dict[str, list[str]] | None = None


class RecallResponse(BaseModel):
    answer: str
    certainty: float
    path_nodes: list[str]
    path_edges: list[str]
    supporting_memories: list[str]
    trace_id: str
    final_open: bool = False
    final_line: str | None = None


class HealthResponse(BaseModel):
    ok: bool
    provider: str
    provider_ok: bool
    demo_ready: bool
    detail: str
