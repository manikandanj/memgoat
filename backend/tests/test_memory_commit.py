def test_commit_persists_memory_and_graph(client):
    session_id = client.post("/api/sessions").json()["id"]

    client.post(f"/api/sessions/{session_id}/objects/locket/inspect")
    response = client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": "locket", "candidate_id": "mem_nara_unknown"},
    )
    graph = client.get(f"/api/sessions/{session_id}/echo/graph").json()

    assert response.status_code == 200
    assert any(memory["id"] == "mem_nara_unknown" for memory in graph["memories"])
    assert any(node["id"] == "n_nara" for node in graph["nodes"])
    assert any(edge["id"] == "e_locket_names_nara" for edge in graph["edges"])


def test_invalid_candidate_is_rejected(client):
    session_id = client.post("/api/sessions").json()["id"]
    client.post(f"/api/sessions/{session_id}/objects/locket/inspect")

    response = client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": "locket", "candidate_id": "mem_lantern_needs_name"},
    )

    assert response.status_code == 400
