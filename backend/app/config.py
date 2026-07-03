from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parents[1]


def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


class Settings(BaseModel):
    memgoat_env: str = Field(default="development")
    memgoat_demo_mode: bool = Field(default=True)
    memgoat_timer_seconds: int = Field(default=120)
    memgoat_db_path: Path = Field(default=ROOT / "data" / "memgoat.sqlite")
    memgoat_memory_provider: str = Field(default="cognee")
    memgoat_content_root: Path = Field(default=ROOT / "content" / "chains")
    cognee_api_base_url: str = Field(default="")
    cognee_tenant_id: str = Field(default="")
    cognee_api_key: str = Field(default="")
    open_router_key: str = Field(default="")
    open_router_model: str = Field(default="")

    @classmethod
    def from_env(cls) -> "Settings":
        _load_dotenv(ROOT / ".env")
        return cls(
            memgoat_env=os.getenv("MEMGOAT_ENV", "development"),
            memgoat_demo_mode=os.getenv("MEMGOAT_DEMO_MODE", "true").lower() == "true",
            memgoat_timer_seconds=int(os.getenv("MEMGOAT_TIMER_SECONDS", "120")),
            memgoat_db_path=Path(os.getenv("MEMGOAT_DB_PATH", str(ROOT / "data" / "memgoat.sqlite"))),
            memgoat_memory_provider=os.getenv("MEMGOAT_MEMORY_PROVIDER", "cognee"),
            memgoat_content_root=Path(os.getenv("MEMGOAT_CONTENT_ROOT", str(ROOT / "content" / "chains"))),
            cognee_api_base_url=os.getenv("COGNEE_API_BASE_URL", ""),
            cognee_tenant_id=os.getenv("COGNEE_TENANT_ID", ""),
            cognee_api_key=os.getenv("COGNEE_API_KEY", ""),
            open_router_key=os.getenv("OPEN_ROUTER_KEY", ""),
            open_router_model=os.getenv("OPEN_ROUTER_MODEL", ""),
        )


@lru_cache
def get_settings() -> Settings:
    return Settings.from_env()
