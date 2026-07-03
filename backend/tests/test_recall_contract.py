def _commit(client, session_id: str, object_id: str, memory_id: str) -> None:
    client.post(f"/api/sessions/{session_id}/objects/{object_id}/inspect")
    response = client.post(
        f"/api/sessions/{session_id}/memories/commit",
        json={"object_id": object_id, "candidate_id": memory_id},
    )
    assert response.status_code == 200, response.text


def test_recall_survives_reset_and_bell_question_uses_prior_memory(client):
    session_id = client.post("/api/sessions").json()["id"]
    _commit(client, session_id, "locket", "mem_nara_unknown")
    _commit(client, session_id, "dead_lantern", "mem_lantern_needs_name")
    client.post(f"/api/sessions/{session_id}/reset")

    recall = client.post(f"/api/sessions/{session_id}/echo/ask", json={"question": "What do I know?"}).json()
    bell = client.post(f"/api/sessions/{session_id}/echo/ask", json={"question": "What does the bell need?"}).json()

    assert "Echo" in recall["answer"] or "Cave Echo" in recall["answer"]
    assert "Nara" in bell["answer"] or "name" in bell["answer"]


def test_final_recall_opens_root_gate_when_chain_is_complete(client):
    session_id = client.post("/api/sessions").json()["id"]
    _commit(client, session_id, "locket", "mem_nara_unknown")
    _commit(client, session_id, "dead_lantern", "mem_lantern_needs_name")
    client.post(f"/api/sessions/{session_id}/rooms/waking-chamber/exit")
    _commit(client, session_id, "echo_bell", "mem_bell_needs_nara")
    _commit(client, session_id, "ring_of_names", "mem_nara_keeper")
    _commit(client, session_id, "lantern_hook", "mem_lantern_points_gate")
    client.post(f"/api/sessions/{session_id}/rooms/bell-gallery/exit")
    _commit(client, session_id, "root_gate", "mem_gate_needs_chain")
    _commit(client, session_id, "mirror_pool", "mem_escape_forgetfulness")

    recall = client.post(f"/api/sessions/{session_id}/echo/ask", json={"question": "Who am I?"}).json()

    assert recall["final_open"] is True
    assert recall["final_line"] == "I was not escaping the cave. I was escaping forgetfulness."
