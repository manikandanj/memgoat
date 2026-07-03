from __future__ import annotations

import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.db.database import init_db
from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch: pytest.MonkeyPatch) -> Iterator[TestClient]:
    db_path = tmp_path / "memgoat-test.sqlite"
    monkeypatch.setenv("MEMGOAT_DB_PATH", str(db_path))
    monkeypatch.setenv("MEMGOAT_MEMORY_PROVIDER", "mock")
    monkeypatch.setenv("MEMGOAT_DEMO_MODE", "false")
    monkeypatch.setenv("MEMGOAT_CONTENT_ROOT", os.path.abspath("content/chains"))
    get_settings.cache_clear()
    init_db()
    with TestClient(app) as test_client:
        yield test_client
