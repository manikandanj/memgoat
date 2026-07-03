from app.content.loader import load_chain


def test_last_lantern_content_loads_and_references_are_valid():
    chain = load_chain("last-lantern")

    assert chain.start_room_id == "waking-chamber"
    assert len(chain.rooms) == 3
    assert all(room.hotspots for room in chain.rooms)
    for room in chain.rooms:
        for hotspot in room.hotspots:
            assert 2 <= len(hotspot.inspection.candidates) <= 3

    candidate_ids = [
        candidate.id
        for room in chain.rooms
        for hotspot in room.hotspots
        for candidate in hotspot.inspection.candidates
    ]
    assert len(candidate_ids) == len(set(candidate_ids))
    assert "mem_thorn_false" in [trigger.memory.id for trigger in chain.false_memory_triggers]
    assert chain.final_recall.final_line == "I was not escaping the cave. I was escaping forgetfulness."
