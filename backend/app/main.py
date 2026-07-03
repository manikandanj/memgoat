from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.db.database import init_db
from app.schemas.api import AskEchoRequest, CommitMemoryRequest
from app.services.cognee_memory_service import CogneeMemoryService
from app.services.event_service import list_events
from app.services.mock_memory_service import MockMemoryService
from app.services.session_service import SessionService


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="MemGoat", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_session_service() -> SessionService:
    settings = get_settings()
    provider = settings.memgoat_memory_provider.lower()
    memory_service = MockMemoryService() if provider == "mock" else CogneeMemoryService(settings)
    return SessionService(memory_service)


@app.post("/api/sessions")
def create_session(service: SessionService = Depends(get_session_service)):
    return service.create_session()


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str, service: SessionService = Depends(get_session_service)):
    return service.get_session(session_id)


@app.post("/api/sessions/{session_id}/reset")
def reset_session(session_id: str, service: SessionService = Depends(get_session_service)):
    return service.reset_session(session_id)


@app.post("/api/sessions/{session_id}/demo/fast-forward")
def fast_forward(session_id: str, service: SessionService = Depends(get_session_service)):
    return service.fast_forward(session_id)


@app.get("/api/sessions/{session_id}/room")
def get_room(session_id: str, service: SessionService = Depends(get_session_service)):
    return service.current_room(session_id)


@app.post("/api/sessions/{session_id}/objects/{object_id}/inspect")
def inspect_object(session_id: str, object_id: str, service: SessionService = Depends(get_session_service)):
    return service.inspect_object(session_id, object_id)


@app.post("/api/sessions/{session_id}/memories/commit")
async def commit_memory(session_id: str, request: CommitMemoryRequest, service: SessionService = Depends(get_session_service)):
    return await service.commit_memory(session_id, request.object_id, request.candidate_id)


@app.post("/api/sessions/{session_id}/rooms/{room_id}/exit")
async def exit_room(session_id: str, room_id: str, service: SessionService = Depends(get_session_service)):
    return await service.exit_room(session_id, room_id)


@app.post("/api/sessions/{session_id}/echo/ask")
async def ask_echo(session_id: str, request: AskEchoRequest, service: SessionService = Depends(get_session_service)):
    return await service.ask_echo(session_id, request.question)


@app.get("/api/sessions/{session_id}/echo/graph")
def graph(session_id: str, service: SessionService = Depends(get_session_service)):
    return service.graph_snapshot(session_id)


@app.get("/api/sessions/{session_id}/echo/memories/{memory_id}")
def memory_details(session_id: str, memory_id: str, service: SessionService = Depends(get_session_service)):
    return service.memory_details(session_id, memory_id)


@app.post("/api/sessions/{session_id}/echo/memories/{memory_id}/dismiss")
async def dismiss_memory(session_id: str, memory_id: str, service: SessionService = Depends(get_session_service)):
    return await service.dismiss_memory(session_id, memory_id)


@app.get("/api/sessions/{session_id}/events")
def events(session_id: str):
    return list_events(session_id)


@app.get("/api/health")
async def health(service: SessionService = Depends(get_session_service)):
    settings = get_settings()
    provider = settings.memgoat_memory_provider.lower()
    provider_health = await service.memory_service.healthcheck()
    provider_ok = bool(provider_health.get("ok"))
    demo_ready = provider_ok if provider == "cognee" else not settings.memgoat_demo_mode
    return {
        "ok": True,
        "provider": provider,
        "provider_ok": provider_ok,
        "demo_ready": demo_ready,
        "detail": provider_health.get("detail", ""),
    }
