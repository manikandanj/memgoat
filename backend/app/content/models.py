from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator


MemoryStatus = Literal["correct", "incomplete", "misleading", "false", "refined", "dismissed"]


class MemoryNode(BaseModel):
    id: str
    label: str
    type: str = "memory"
    status: MemoryStatus = "correct"
    metadata: dict[str, Any] = Field(default_factory=dict)


class MemoryEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    status: MemoryStatus = "correct"
    metadata: dict[str, Any] = Field(default_factory=dict)


class CandidateMemory(BaseModel):
    id: str
    title: str
    text: str
    status: MemoryStatus
    category: str
    confidence: float = Field(ge=0, le=1)
    nodes: list[MemoryNode] = Field(default_factory=list)
    edges: list[MemoryEdge] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class Inspection(BaseModel):
    prompt: str
    observation: str
    candidates: list[CandidateMemory] = Field(min_length=2, max_length=3)


class Hotspot(BaseModel):
    id: str
    label: str
    kind: str
    position: tuple[float, float, float] = (0, 0, 0)
    inspection: Inspection


class RoomExit(BaseModel):
    id: str
    label: str
    to_room_id: str | None = None
    requires_memory_ids: list[str] = Field(default_factory=list)
    seals_current_room: bool = True


class Room(BaseModel):
    id: str
    title: str
    summary: str
    goat_context: str
    hotspots: list[Hotspot] = Field(min_length=1)
    exits: list[RoomExit] = Field(default_factory=list)


class FalseMemoryTrigger(BaseModel):
    id: str
    room_id: str
    object_id: str
    event: str
    memory: CandidateMemory


class RefinementRule(BaseModel):
    id: str
    trigger_memory_id: str
    existing_node_id: str
    refined_memory_id: str
    title: str
    text: str
    status: MemoryStatus = "refined"


class FinalRecallCondition(BaseModel):
    question_contains: list[str]
    required_memory_ids: list[str]
    path_node_ids: list[str]
    path_edge_ids: list[str]
    success_answer: str
    missing_answer: str
    final_line: str


class DemoCheckpoint(BaseModel):
    id: str
    label: str
    room_id: str
    memory_ids: list[str] = Field(default_factory=list)


class Chain(BaseModel):
    id: str
    title: str
    start_room_id: str
    rooms: list[Room]
    false_memory_triggers: list[FalseMemoryTrigger] = Field(default_factory=list)
    refinement_rules: list[RefinementRule] = Field(default_factory=list)
    final_recall: FinalRecallCondition
    demo_checkpoints: list[DemoCheckpoint] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_references(self) -> "Chain":
        room_ids = {room.id for room in self.rooms}
        if self.start_room_id not in room_ids:
            raise ValueError("start_room_id must reference a room")
        candidate_ids: set[str] = set()
        node_ids: set[str] = set()
        edge_ids: set[str] = set()
        hotspot_ids: set[str] = set()
        for room in self.rooms:
            for exit_ in room.exits:
                if exit_.to_room_id is not None and exit_.to_room_id not in room_ids:
                    raise ValueError(f"exit {exit_.id} references unknown room {exit_.to_room_id}")
            for hotspot in room.hotspots:
                hotspot_ids.add(hotspot.id)
                for candidate in hotspot.inspection.candidates:
                    if candidate.id in candidate_ids:
                        raise ValueError(f"duplicate candidate memory id {candidate.id}")
                    candidate_ids.add(candidate.id)
                    node_ids.update(node.id for node in candidate.nodes)
                    edge_ids.update(edge.id for edge in candidate.edges)
        for trigger in self.false_memory_triggers:
            if trigger.room_id not in room_ids:
                raise ValueError(f"false trigger {trigger.id} references unknown room")
            if trigger.object_id not in hotspot_ids:
                raise ValueError(f"false trigger {trigger.id} references unknown hotspot")
            candidate_ids.add(trigger.memory.id)
            node_ids.update(node.id for node in trigger.memory.nodes)
            edge_ids.update(edge.id for edge in trigger.memory.edges)
        for edge_id in self.final_recall.path_edge_ids:
            if edge_id not in edge_ids:
                raise ValueError(f"final recall references unknown edge {edge_id}")
        for node_id in self.final_recall.path_node_ids:
            if node_id not in node_ids:
                raise ValueError(f"final recall references unknown node {node_id}")
        for memory_id in self.final_recall.required_memory_ids:
            if memory_id not in candidate_ids:
                raise ValueError(f"final recall references unknown memory {memory_id}")
        for rule in self.refinement_rules:
            if rule.trigger_memory_id not in candidate_ids:
                raise ValueError(f"refinement rule {rule.id} references unknown trigger memory")
            if rule.existing_node_id not in node_ids:
                raise ValueError(f"refinement rule {rule.id} references unknown node")
        return self
