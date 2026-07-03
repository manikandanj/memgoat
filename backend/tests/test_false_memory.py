def _commit(client, session_id: str, object_id: str, memory_id: str) -> None:
    client.post(f"/api/sessions/{session_id}/objects/{object_id}/inspect")
    response = client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": object_id, "candidate_id": memory_id},
    )
    assert response.status_code == 200, response.text


def test_false_memory_injected_and_dismissed(client):
    session_id = client.post("/api/sessions").json()["id"]
    _commit(client, session_id, "dead_lantern", "mem_lantern_needs_name")
    client.post(f"/api/sessions/{session_id}/rooms/waking-chamber/exit")
    _commit(client, session_id, "echo_bell", "mem_bell_needs_nara")
    _commit(client, session_id, "ring_of_names", "mem_nara_keeper")
    client.post(f"/api/sessions/{session_id}/rooms/bell-gallery/exit")

    graph = client.get(f"/api/sessions/{session_id}/echo/graph").json()
    thorn = next(memory for memory in graph["memories"] if memory["id"] == "mem_thorn_false")
    assert thorn["status"] == "false"
    assert thorn["metadata"]["trust"] == "weak/untrusted"

    dismissed = client.post(f"/api/sessions/{session_id}/echo/memories/mem_thorn_false/dismiss").json()
    assert all(memory["id"] != "mem_thorn_false" for memory in dismissed["memories"])
