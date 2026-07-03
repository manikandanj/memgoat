from __future__ import annotations

import json
from typing import Any
from uuid import uuid4

from fastapi import HTTPException

from app.config import get_settings
from app.content.loader import get_candidate, get_hotspot, get_room, load_chain
from app.content.models import CandidateMemory
from app.db.database import connect
from app.services.event_service import log_event, now_iso
from app.services.memory_service import MemoryService


def _json(value: Any) -> str:
    return json.dumps(value, separators=(",", ":"))


def _row_to_session(row: Any) -> dict[str, Any]:
    return {
        "id": row["id"],
        "chain_id": row["chain_id"],
        "current_room_id": row["current_room_id"],
        "sealed_rooms": json.loads(row["sealed_rooms"]),
        "reset_count": row["reset_count"],
        "timer_seconds": row["timer_seconds"],
        "goat_context": row["goat_context"],
    }


class SessionService:
    def __init__(self, memory_service: MemoryService):
        self.memory_service = memory_service

    def create_session(self) -> dict[str, Any]:
        chain = load_chain()
        room = get_room(chain, chain.start_room_id)
        session_id = str(uuid4())
        now = now_iso()
        with connect() as db:
            db.execute(
                """
                INSERT INTO sessions
                (id, chain_id, current_room_id, sealed_rooms, reset_count, timer_seconds, goat_context, started_at, updated_at)
                VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
                """,
                (session_id, chain.id, room.id, _json([]), get_settings().memgoat_timer_seconds, room.goat_context, now, now),
            )
        log_event(session_id, "session.created", "The goat wakes with a short memory window.", {"room_id": room.id})
        return self.get_session(session_id)

    def get_session(self, session_id: str) -> dict[str, Any]:
        with connect() as db:
            row = db.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Session not found")
        return _row_to_session(row)

    def reset_session(self, session_id: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        chain = load_chain(session["chain_id"])
        room = get_room(chain, session["current_room_id"])
        with connect() as db:
            db.execute("DELETE FROM inspected_objects WHERE session_id = ? AND committed_memory_id IS NULL", (session_id,))
            db.execute(
                """
                UPDATE sessions
                SET reset_count = reset_count + 1,
                    goat_context = ?,
                    timer_seconds = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (
                    f"The goat blinks. {room.goat_context} The Cave Echo still remembers what was committed.",
                    get_settings().memgoat_timer_seconds,
                    now_iso(),
                    session_id,
                ),
            )
        log_event(session_id, "session.reset", "The goat forgets, but committed Echo memories remain.", {})
        return self.get_session(session_id)

    def fast_forward(self, session_id: str) -> dict[str, Any]:
        session = self.reset_session(session_id)
        log_event(session_id, "demo.fast_forward", "Presenter fast-forward triggered a memory reset.", {})
        return session

    def current_room(self, session_id: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        chain = load_chain(session["chain_id"])
        room = get_room(chain, session["current_room_id"])
        examined = self.examined_object_ids(session_id)
        return {
            "id": room.id,
            "title": room.title,
            "summary": room.summary,
            "goat_context": session["goat_context"],
            "hotspots": [
                {
                    "id": hotspot.id,
                    "label": hotspot.label,
                    "kind": hotspot.kind,
                    "position": hotspot.position,
                    "examined": hotspot.id in examined,
                }
                for hotspot in room.hotspots
            ],
            "exits": [exit_.model_dump() for exit_ in room.exits],
            "sealed_rooms": session["sealed_rooms"],
        }

    def examined_object_ids(self, session_id: str) -> set[str]:
        with connect() as db:
            rows = db.execute("SELECT object_id FROM inspected_objects WHERE session_id = ?", (session_id,)).fetchall()
        return {row["object_id"] for row in rows}

    def inspect_object(self, session_id: str, object_id: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        chain = load_chain(session["chain_id"])
        room, hotspot = get_hotspot(chain, object_id)
        if room.id != session["current_room_id"] or room.id in session["sealed_rooms"]:
            raise HTTPException(status_code=403, detail="That object is no longer reachable")
        with connect() as db:
            db.execute(
                """
                INSERT OR REPLACE INTO inspected_objects
                (session_id, object_id, room_id, candidates_json, committed_memory_id, created_at)
                VALUES (?, ?, ?, ?, COALESCE((SELECT committed_memory_id FROM inspected_objects WHERE session_id = ? AND object_id = ?), NULL), ?)
                """,
                (
                    session_id,
                    object_id,
                    room.id,
                    _json([candidate.model_dump() for candidate in hotspot.inspection.candidates]),
                    session_id,
                    object_id,
                    now_iso(),
                ),
            )
        log_event(session_id, "object.inspected", f"Inspected {hotspot.label}.", {"object_id": object_id})
        return {
            "object_id": hotspot.id,
            "label": hotspot.label,
            "prompt": hotspot.inspection.prompt,
            "observation": hotspot.inspection.observation,
            "candidates": [candidate.model_dump() for candidate in hotspot.inspection.candidates],
        }

    async def commit_memory(self, session_id: str, object_id: str, candidate_id: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        chain = load_chain(session["chain_id"])
        room, hotspot = get_hotspot(chain, object_id)
        if room.id != session["current_room_id"] or room.id in session["sealed_rooms"]:
            raise HTTPException(status_code=403, detail="That room is sealed")
        candidate = get_candidate(chain, candidate_id)
        if candidate.id not in {item.id for item in hotspot.inspection.candidates}:
            raise HTTPException(status_code=400, detail="Candidate does not belong to inspected object")
        result = await self._persist_candidate(session_id, object_id, room.id, candidate)
        for rule in chain.refinement_rules:
            if rule.trigger_memory_id == candidate.id:
                self._apply_refinement(session_id, rule)
                await self.memory_service.refine(
                    session_id,
                    rule.existing_node_id,
                    {"id": rule.refined_memory_id, "title": rule.title, "text": rule.text, "status": rule.status},
                    self.graph_snapshot(session_id)["nodes"],
                    self.graph_snapshot(session_id)["edges"],
                )
        return result

    async def _persist_candidate(self, session_id: str, object_id: str, room_id: str, candidate: CandidateMemory) -> dict[str, Any]:
        now = now_iso()
        with connect() as db:
            db.execute(
                """
                INSERT OR REPLACE INTO committed_memories
                (session_id, memory_id, object_id, room_id, title, text, status, confidence, category, metadata_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    session_id,
                    candidate.id,
                    object_id,
                    room_id,
                    candidate.title,
                    candidate.text,
                    candidate.status,
                    candidate.confidence,
                    candidate.category,
                    _json(candidate.metadata),
                    now,
                ),
            )
            db.execute(
                "UPDATE inspected_objects SET committed_memory_id = ? WHERE session_id = ? AND object_id = ?",
                (candidate.id, session_id, object_id),
            )
            for node in candidate.nodes:
                db.execute(
                    """
                    INSERT INTO memory_nodes (session_id, node_id, label, type, status, metadata_json)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(session_id, node_id) DO UPDATE SET
                        label = excluded.label,
                        type = excluded.type,
                        status = excluded.status,
                        metadata_json = excluded.metadata_json
                    """,
                    (session_id, node.id, node.label, node.type, node.status, _json(node.metadata)),
                )
            for edge in candidate.edges:
                db.execute(
                    """
                    INSERT INTO memory_edges (session_id, edge_id, source, target, label, status, metadata_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(session_id, edge_id) DO UPDATE SET
                        source = excluded.source,
                        target = excluded.target,
                        label = excluded.label,
                        status = excluded.status,
                        metadata_json = excluded.metadata_json
                    """,
                    (session_id, edge.id, edge.source, edge.target, edge.label, edge.status, _json(edge.metadata)),
                )
        provider = await self.memory_service.remember(
            session_id,
            candidate.model_dump(),
            [node.model_dump() for node in candidate.nodes],
            [edge.model_dump() for edge in candidate.edges],
            {"object_id": object_id, "room_id": room_id},
        )
        log_event(session_id, "memory.committed", f"Committed memory: {candidate.title}.", {"memory_id": candidate.id})
        return {"memory": candidate.model_dump(), "provider": {"ok": provider.get("ok", False), "trace_id": provider.get("trace_id")}}

    def _apply_refinement(self, session_id: str, rule: Any) -> None:
        with connect() as db:
            db.execute(
                "UPDATE memory_nodes SET status = ?, label = ?, metadata_json = ? WHERE session_id = ? AND node_id = ?",
                (
                    rule.status,
                    "Nara, keeper of the Last Lantern",
                    _json({"history": "refined by Bell Gallery clue", "refined_memory_id": rule.refined_memory_id}),
                    session_id,
                    rule.existing_node_id,
                ),
            )
        log_event(session_id, "memory.refined", rule.text, {"memory_id": rule.refined_memory_id})

    async def exit_room(self, session_id: str, room_id: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        if session["current_room_id"] != room_id:
            raise HTTPException(status_code=400, detail="Session is not in that room")
        chain = load_chain(session["chain_id"])
        room = get_room(chain, room_id)
        if not room.exits:
            return self.current_room(session_id)
        exit_ = room.exits[0]
        if not exit_.to_room_id:
            return self.current_room(session_id)
        committed = {memory["id"] for memory in self.graph_snapshot(session_id)["memories"]}
        missing = [memory_id for memory_id in exit_.requires_memory_ids if memory_id not in committed]
        if missing:
            raise HTTPException(status_code=409, detail=f"Missing required memories: {', '.join(missing)}")
        sealed = set(session["sealed_rooms"])
        if exit_.seals_current_room:
            sealed.add(room_id)
        next_room = get_room(chain, exit_.to_room_id)
        with connect() as db:
            db.execute(
                "UPDATE sessions SET current_room_id = ?, sealed_rooms = ?, goat_context = ?, updated_at = ? WHERE id = ?",
                (next_room.id, _json(sorted(sealed)), next_room.goat_context, now_iso(), session_id),
            )
        log_event(session_id, "room.exited", f"Left {room.title}; it sealed behind the goat.", {"to_room_id": next_room.id})
        await self._inject_false_memories(session_id, next_room.id)
        return self.current_room(session_id)

    async def _inject_false_memories(self, session_id: str, room_id: str) -> None:
        chain = load_chain()
        existing = {memory["id"] for memory in self.graph_snapshot(session_id)["memories"]}
        for trigger in chain.false_memory_triggers:
            if trigger.room_id == room_id and trigger.memory.id not in existing:
                await self._persist_candidate(session_id, trigger.object_id, room_id, trigger.memory)
                log_event(session_id, "memory.false_injected", "A suspicious Thorn memory surfaced near the Witch mark.", {"memory_id": trigger.memory.id})

    def graph_snapshot(self, session_id: str) -> dict[str, Any]:
        with connect() as db:
            nodes = db.execute(
                """
                SELECT node_id, label, type, status, metadata_json
                FROM memory_nodes
                WHERE session_id = ?
                  AND node_id NOT IN (
                    SELECT memory_id FROM dismissed_memories WHERE session_id = ?
                  )
                ORDER BY node_id
                """,
                (session_id, session_id),
            ).fetchall()
            edges = db.execute(
                "SELECT edge_id, source, target, label, status, metadata_json FROM memory_edges WHERE session_id = ? ORDER BY edge_id",
                (session_id,),
            ).fetchall()
            memories = db.execute(
                """
                SELECT memory_id, object_id, room_id, title, text, status, confidence, category, metadata_json, created_at
                FROM committed_memories
                WHERE session_id = ?
                  AND memory_id NOT IN (SELECT memory_id FROM dismissed_memories WHERE session_id = ?)
                ORDER BY created_at
                """,
                (session_id, session_id),
            ).fetchall()
        return {
            "nodes": [
                {
                    "id": row["node_id"],
                    "label": row["label"],
                    "type": row["type"],
                    "status": row["status"],
                    "metadata": json.loads(row["metadata_json"]),
                }
                for row in nodes
            ],
            "edges": [
                {
                    "id": row["edge_id"],
                    "source": row["source"],
                    "target": row["target"],
                    "label": row["label"],
                    "status": row["status"],
                    "metadata": json.loads(row["metadata_json"]),
                }
                for row in edges
            ],
            "memories": [
                {
                    "id": row["memory_id"],
                    "object_id": row["object_id"],
                    "room_id": row["room_id"],
                    "title": row["title"],
                    "text": row["text"],
                    "status": row["status"],
                    "confidence": row["confidence"],
                    "category": row["category"],
                    "metadata": json.loads(row["metadata_json"]),
                    "created_at": row["created_at"],
                }
                for row in memories
            ],
        }

    async def ask_echo(self, session_id: str, question: str) -> dict[str, Any]:
        self.get_session(session_id)
        snapshot = self.graph_snapshot(session_id)
        try:
            result = await self.memory_service.recall(session_id, question, snapshot)
        except Exception:
            raise HTTPException(status_code=503, detail="The Cave Echo cannot reach its memory provider right now")
        chain = load_chain()
        memory_ids = {memory["id"] for memory in snapshot["memories"]}
        lower = question.lower()
        if all(term in lower for term in chain.final_recall.question_contains) and all(mid in memory_ids for mid in chain.final_recall.required_memory_ids):
            result.update(
                {
                    "answer": chain.final_recall.success_answer,
                    "certainty": max(float(result.get("certainty", 0.8)), 0.95),
                    "path_nodes": chain.final_recall.path_node_ids,
                    "path_edges": chain.final_recall.path_edge_ids,
                    "supporting_memories": chain.final_recall.required_memory_ids,
                    "final_open": True,
                    "final_line": chain.final_recall.final_line,
                }
            )
        log_event(session_id, "echo.recall", result["answer"], {"question": question, "trace_id": result.get("trace_id")})
        return result

    async def dismiss_memory(self, session_id: str, memory_id: str) -> dict[str, Any]:
        snapshot = self.graph_snapshot(session_id)
        if memory_id not in {memory["id"] for memory in snapshot["memories"]}:
            raise HTTPException(status_code=404, detail="Memory not found")
        with connect() as db:
            db.execute(
                "INSERT OR IGNORE INTO dismissed_memories (session_id, memory_id, created_at) VALUES (?, ?, ?)",
                (session_id, memory_id, now_iso()),
            )
            db.execute("UPDATE committed_memories SET status = 'dismissed' WHERE session_id = ? AND memory_id = ?", (session_id, memory_id))
            db.execute("UPDATE memory_nodes SET status = 'dismissed' WHERE session_id = ? AND node_id = ?", (session_id, memory_id))
        provider = await self.memory_service.dismiss(session_id, memory_id)
        log_event(session_id, "memory.dismissed", f"Dismissed suspicious memory {memory_id}.", {"trace_id": provider.get("trace_id")})
        return self.graph_snapshot(session_id)

    def memory_details(self, session_id: str, memory_id: str) -> dict[str, Any]:
        snapshot = self.graph_snapshot(session_id)
        for memory in snapshot["memories"]:
            if memory["id"] == memory_id:
                return memory
        raise HTTPException(status_code=404, detail="Memory not found")
