from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from app.db.database import connect


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


def log_event(session_id: str, event_type: str, message: str, payload: dict[str, Any] | None = None) -> None:
    with connect() as db:
        db.execute(
            """
            INSERT INTO event_log (session_id, type, message, payload_json, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (session_id, event_type, message, json.dumps(payload or {}), now_iso()),
        )


def list_events(session_id: str) -> list[dict[str, Any]]:
    with connect() as db:
        rows = db.execute(
            "SELECT id, type, message, payload_json, created_at FROM event_log WHERE session_id = ? ORDER BY id",
            (session_id,),
        ).fetchall()
    return [
        {
            "id": row["id"],
            "type": row["type"],
            "message": row["message"],
            "payload": json.loads(row["payload_json"]),
            "created_at": row["created_at"],
        }
        for row in rows
    ]
