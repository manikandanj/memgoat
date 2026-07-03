from __future__ import annotations

import sqlite3
from pathlib import Path

from app.config import get_settings


def connect() -> sqlite3.Connection:
    db_path = get_settings().memgoat_db_path
    db_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(path: Path | None = None) -> None:
    if path is not None:
        path.parent.mkdir(parents=True, exist_ok=True)
    with connect() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                chain_id TEXT NOT NULL,
                current_room_id TEXT NOT NULL,
                sealed_rooms TEXT NOT NULL,
                reset_count INTEGER NOT NULL DEFAULT 0,
                timer_seconds INTEGER NOT NULL,
                goat_context TEXT NOT NULL,
                started_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS inspected_objects (
                session_id TEXT NOT NULL,
                object_id TEXT NOT NULL,
                room_id TEXT NOT NULL,
                candidates_json TEXT NOT NULL,
                committed_memory_id TEXT,
                created_at TEXT NOT NULL,
                PRIMARY KEY (session_id, object_id)
            );

            CREATE TABLE IF NOT EXISTS committed_memories (
                session_id TEXT NOT NULL,
                memory_id TEXT NOT NULL,
                object_id TEXT NOT NULL,
                room_id TEXT NOT NULL,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                status TEXT NOT NULL,
                confidence REAL NOT NULL,
                category TEXT NOT NULL,
                metadata_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                PRIMARY KEY (session_id, memory_id)
            );

            CREATE TABLE IF NOT EXISTS memory_nodes (
                session_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                label TEXT NOT NULL,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                metadata_json TEXT NOT NULL,
                PRIMARY KEY (session_id, node_id)
            );

            CREATE TABLE IF NOT EXISTS memory_edges (
                session_id TEXT NOT NULL,
                edge_id TEXT NOT NULL,
                source TEXT NOT NULL,
                target TEXT NOT NULL,
                label TEXT NOT NULL,
                status TEXT NOT NULL,
                metadata_json TEXT NOT NULL,
                PRIMARY KEY (session_id, edge_id)
            );

            CREATE TABLE IF NOT EXISTS dismissed_memories (
                session_id TEXT NOT NULL,
                memory_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                PRIMARY KEY (session_id, memory_id)
            );

            CREATE TABLE IF NOT EXISTS event_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS provider_traces (
                trace_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                operation TEXT NOT NULL,
                status TEXT NOT NULL,
                detail TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )
