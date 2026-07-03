from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.config import get_settings
from app.content.models import CandidateMemory, Chain, Hotspot, Room


@lru_cache
def load_chain(chain_id: str = "last-lantern") -> Chain:
    path = get_settings().memgoat_content_root / f"{chain_id}.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    return Chain.model_validate(payload)


def get_room(chain: Chain, room_id: str) -> Room:
    for room in chain.rooms:
        if room.id == room_id:
            return room
    raise KeyError(room_id)


def get_hotspot(chain: Chain, object_id: str) -> tuple[Room, Hotspot]:
    for room in chain.rooms:
        for hotspot in room.hotspots:
            if hotspot.id == object_id:
                return room, hotspot
    raise KeyError(object_id)


def get_candidate(chain: Chain, candidate_id: str) -> CandidateMemory:
    for room in chain.rooms:
        for hotspot in room.hotspots:
            for candidate in hotspot.inspection.candidates:
                if candidate.id == candidate_id:
                    return candidate
    for trigger in chain.false_memory_triggers:
        if trigger.memory.id == candidate_id:
            return trigger.memory
    raise KeyError(candidate_id)


def clear_chain_cache() -> None:
    load_chain.cache_clear()
