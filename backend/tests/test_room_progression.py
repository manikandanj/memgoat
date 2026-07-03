def test_room_exit_seals_prior_room_and_blocks_inspection(client):
    session_id = client.post("/api/sessions").json()["id"]

    client.post(f"/api/sessions/{session_id}/objects/dead_lantern/inspect")
    client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": "dead_lantern", "candidate_id": "mem_lantern_needs_name"},
    )
    room = client.post(f"/api/sessions/{session_id}/rooms/waking-chamber/exit").json()

    assert room["id"] == "bell-gallery"
    assert "waking-chamber" in room["sealed_rooms"]
    blocked = client.post(f"/api/sessions/{session_id}/objects/locket/inspect")
    assert blocked.status_code == 403
