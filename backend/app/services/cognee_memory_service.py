from __future__ import annotations

import json
from typing import Any
from uuid import uuid4

import httpx

from app.config import Settings
from app.services.memory_service import MemoryService


class CogneeMemoryService(MemoryService):
    def __init__(self, settings: Settings):
        self.settings = settings
        self.base_url = settings.cognee_api_base_url.rstrip("/")

    def _headers(self) -> dict[str, str]:
        headers = {"X-Api-Key": self.settings.cognee_api_key}
        if self.settings.cognee_tenant_id:
            headers["X-Tenant-Id"] = self.settings.cognee_tenant_id
        return headers

    def _api_url(self, path: str) -> str:
        base = self.base_url
        if base.endswith("/api/v1"):
            base = base[: -len("/api/v1")]
        return f"{base}{path}"

    async def remember(
        self,
        session_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
        metadata: dict[str, Any],
    ) -> dict[str, Any]:
        trace_id = f"cognee-remember-{uuid4()}"
        body = {
            "memory": memory,
            "nodes": nodes,
            "edges": edges,
            "metadata": metadata,
            "trace_id": trace_id,
        }
        dataset = f"memgoat-{session_id}"
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                self._api_url("/api/v1/remember"),
                headers=self._headers(),
                data={
                    "datasetName": dataset,
                    "session_id": session_id,
                    "node_set": json.dumps([f"memgoat:{session_id}"]),
                    "run_in_background": "false",
                    "custom_prompt": "Extract only authored MemGoat memories, cave objects, relationships, source, confidence, and trust status.",
                },
                files={"data": ("memgoat-memory.json", json.dumps(body), "application/json")},
            )
        response.raise_for_status()
        return {"ok": True, "trace_id": trace_id, "provider_response": response.json()}

    async def recall(self, session_id: str, question: str, graph_snapshot: dict[str, Any]) -> dict[str, Any]:
        trace_id = f"cognee-recall-{uuid4()}"
        dataset = f"memgoat-{session_id}"
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                self._api_url("/api/v1/recall"),
                headers={**self._headers(), "Content-Type": "application/json"},
                json={
                    "searchType": "GRAPH_COMPLETION",
                    "datasets": [dataset],
                    "query": question,
                    "systemPrompt": "Answer from MemGoat memories only. Be concise. Do not invent cave facts.",
                    "nodeName": [f"memgoat:{session_id}"],
                    "topK": 15,
                    "includeReferences": True,
                    "sessionId": session_id,
                    "scope": "all",
                },
            )
        response.raise_for_status()
        payload = response.json()
        answer = ""
        path_nodes: list[str] = []
        path_edges: list[str] = []
        if isinstance(payload, list) and payload:
            first = payload[0]
            answer = first.get("answer") or first.get("context") or ""
            used = first.get("used_graph_element_ids") or {}
            path_nodes = list(used.get("nodes", []) or used.get("node_ids", []) or [])
            path_edges = list(used.get("edges", []) or used.get("edge_ids", []) or [])
        elif isinstance(payload, dict):
            answer = str(payload.get("answer") or payload.get("response") or payload)
        return {
            "answer": answer or "The Cave Echo heard the question, but returned no usable answer.",
            "certainty": 0.75 if answer else 0.25,
            "path_nodes": path_nodes,
            "path_edges": path_edges,
            "supporting_memories": [memory["id"] for memory in graph_snapshot.get("memories", [])],
            "trace_id": trace_id,
        }

    async def dismiss(self, session_id: str, memory_id: str) -> dict[str, Any]:
        return {"ok": True, "trace_id": f"cognee-dismiss-{uuid4()}"}

    async def refine(
        self,
        session_id: str,
        existing_memory_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
    ) -> dict[str, Any]:
        return await self.remember(session_id, memory, nodes, edges, {"operation": "refine", "existing_memory_id": existing_memory_id})

    async def graph(self, session_id: str) -> dict[str, Any]:
        return {"ok": True}

    async def healthcheck(self) -> dict[str, Any]:
        if not self.base_url or not self.settings.cognee_api_key:
            return {"ok": False, "detail": "Cognee base URL or API key is missing"}
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(self._api_url("/health"), headers=self._headers())
            return {"ok": response.is_success, "detail": f"Cognee health returned HTTP {response.status_code}"}
        except httpx.HTTPError as exc:
            return {"ok": False, "detail": f"Cognee health failed: {exc.__class__.__name__}"}
