from __future__ import annotations

from typing import Any
from uuid import uuid4

from app.content.loader import load_chain
from app.services.memory_service import MemoryService


class MockMemoryService(MemoryService):
    async def remember(
        self,
        session_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
        metadata: dict[str, Any],
    ) -> dict[str, Any]:
        return {"ok": True, "trace_id": f"mock-remember-{uuid4()}"}

    async def recall(self, session_id: str, question: str, graph_snapshot: dict[str, Any]) -> dict[str, Any]:
        chain = load_chain()
        lower = question.lower()
        node_ids = {node["id"] for node in graph_snapshot["nodes"]}
        edge_ids = {edge["id"] for edge in graph_snapshot["edges"]}
        supporting = [
            memory["id"]
            for memory in graph_snapshot.get("memories", [])
            if memory.get("status") != "dismissed"
        ]
        final = chain.final_recall
        if all(term in lower for term in final.question_contains):
            missing = [mid for mid in final.required_memory_ids if mid not in supporting]
            if not missing:
                return {
                    "answer": final.success_answer,
                    "certainty": 0.96,
                    "path_nodes": [nid for nid in final.path_node_ids if nid in node_ids],
                    "path_edges": [eid for eid in final.path_edge_ids if eid in edge_ids],
                    "supporting_memories": final.required_memory_ids,
                    "trace_id": f"mock-recall-{uuid4()}",
                    "final_open": True,
                    "final_line": final.final_line,
                }
            return {
                "answer": final.missing_answer,
                "certainty": 0.42,
                "path_nodes": list(node_ids),
                "path_edges": list(edge_ids),
                "supporting_memories": supporting,
                "trace_id": f"mock-recall-{uuid4()}",
            }
        if "bell" in lower:
            needs = "The bell needs a remembered name and a light carried forward from the sealed chamber."
            return {
                "answer": needs,
                "certainty": 0.78,
                "path_nodes": [node["id"] for node in graph_snapshot["nodes"] if node["id"] in {"n_lantern", "n_bell", "n_nara"}],
                "path_edges": [edge["id"] for edge in graph_snapshot["edges"] if "bell" in edge["id"]],
                "supporting_memories": supporting,
                "trace_id": f"mock-recall-{uuid4()}",
            }
        if "what do i know" in lower or "what do we know" in lower:
            answer = "The Cave Echo still holds the locket, the dead lantern, and the room-to-room trail even when the goat forgets."
            return {
                "answer": answer,
                "certainty": 0.82 if supporting else 0.25,
                "path_nodes": list(node_ids),
                "path_edges": list(edge_ids),
                "supporting_memories": supporting,
                "trace_id": f"mock-recall-{uuid4()}",
            }
        return {
            "answer": "The Echo cannot answer that yet. Inspect more cave evidence and commit a stronger memory.",
            "certainty": 0.28,
            "path_nodes": [],
            "path_edges": [],
            "supporting_memories": [],
            "trace_id": f"mock-recall-{uuid4()}",
        }

    async def dismiss(self, session_id: str, memory_id: str) -> dict[str, Any]:
        return {"ok": True, "trace_id": f"mock-dismiss-{uuid4()}"}

    async def refine(
        self,
        session_id: str,
        existing_memory_id: str,
        memory: dict[str, Any],
        nodes: list[dict[str, Any]],
        edges: list[dict[str, Any]],
    ) -> dict[str, Any]:
        return {"ok": True, "trace_id": f"mock-refine-{uuid4()}"}

    async def graph(self, session_id: str) -> dict[str, Any]:
        return {"ok": True}

    async def healthcheck(self) -> dict[str, Any]:
        return {"ok": True, "detail": "mock provider ready"}
