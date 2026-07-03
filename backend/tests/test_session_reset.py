def test_reset_clears_uncommitted_inspection_and_preserves_graph(client):
    session = client.post("/api/sessions").json()
    session_id = session["id"]

    client.post(f"/api/sessions/{session_id}/objects/locket/inspect")
    client.post(f"/api/sessions/{session_id}/objects/dead_lantern/inspect")
    client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": "dead_lantern", "candidate_id": "mem_lantern_needs_name"},
    )

    reset = client.post(f"/api/sessions/{session_id}/reset").json()
    graph = client.get(f"/api/sessions/{session_id}/echo/graph").json()

    assert reset["reset_count"] == 1
    assert any(memory["id"] == "mem_lantern_needs_name" for memory in graph["memories"])
    room = client.get(f"/api/sessions/{session_id}/room").json()
    locket = next(item for item in room["hotspots"] if item["id"] == "locket")
    lantern = next(item for item in room["hotspots"] if item["id"] == "dead_lantern")
    assert not locket["examined"]
    assert lantern["examined"]
