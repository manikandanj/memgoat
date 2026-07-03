# MemGoat Implementation Plan

Status: finalized for first implementation pass  
Source documents:

- `reference/MemGoat UX Requirements.md`
- `reference/MemGoat Tech Spec.md`

## 1. Finalized Decisions

1. Frontend: React + Vite + TypeScript.
2. Cave rendering: constrained Three.js diorama.
3. Three.js integration: React Three Fiber plus Drei, embedded inside the React app as the left-side cave view.
4. Backend: FastAPI.
5. Memory architecture: Cognee-primary recall behind a `MemoryService` adapter.
6. Cognee configuration: backend `.env` provides `COGNEE_API_BASE_URL`, `COGNEE_TENANT_ID`, and `COGNEE_API_KEY`.
7. LLM provider: OpenRouter via `OPEN_ROUTER_KEY` and `OPEN_ROUTER_MODEL`, used only for bounded phrasing/summarization if needed.
8. Session persistence: SQLite.
9. Graph visualization: React Flow.
10. Content format: authored JSON modules validated by Pydantic.
11. Asset approach: generated placeholder art/sound is acceptable for the first pass, but all assets must be isolated and easy to replace.
12. Demo controls: support both a hidden keyboard shortcut and a hidden-by-default demo panel.

## 2. Implementation Principles

The vertical slice should optimize for a reliable 5-7 minute judge demo. The main product claim is that the goat forgets while the Cave Echo remembers, so every major implementation choice should preserve that contrast.

The first pass should not become a full 3D navigation game. The Three.js layer is a constrained visual interaction layer:

- Locked or lightly drifting first-person camera.
- Three authored chambers only: Waking Chamber, Bell Gallery, Root Gate.
- Clickable meshes, billboards, or simple props for inspectable objects.
- Scene swaps for room transitions.
- Close inspection handled by camera tween or modal overlay, not free movement.
- No collision, combat, inventory, procedural generation, or open exploration.

Cognee must be part of the playable demo path. Deterministic graph logic may support UI state and tests, but the judge-demo recall flow should call Cognee and should report unhealthy state if Cognee is unavailable instead of silently substituting deterministic answers.

## 3. Target Repo Structure

```text
backend/
  .env
  app/
    main.py
    config.py
    api/
      sessions.py
      rooms.py
      echo.py
      demo.py
    content/
      loader.py
      models.py
    db/
      database.py
      models.py
      migrations.py
    services/
      session_service.py
      content_service.py
      memory_service.py
      cognee_memory_service.py
      mock_memory_service.py
      narration_service.py
      event_service.py
    schemas/
      api.py
  content/
    chains/
      last-lantern.json
    assets-manifest.json
  data/
    memgoat.sqlite
  tests/
    test_content_schema.py
    test_session_reset.py
    test_room_progression.py
    test_memory_commit.py
    test_false_memory.py
    test_recall_contract.py

ui/
  src/
    api/
      client.ts
      types.ts
    assets/
      scenes/
      objects/
      audio/
      textures/
    components/
      AppShell.tsx
      CaveEchoPanel.tsx
      CountdownTimer.tsx
      DemoControls.tsx
      InspectionPanel.tsx
      MemoryDetails.tsx
      MemoryGraph.tsx
      RecallBox.tsx
    game/
      CaveDiorama.tsx
      chambers/
        WakingChamber.tsx
        BellGallery.tsx
        RootGate.tsx
      hotspots.ts
      sceneAssets.ts
    state/
      gameStore.ts
    styles/
      tokens.css
      app.css
    tests/
  public/
```

## 4. Backend Plan

### 4.1 Configuration

Implement typed settings in `backend/app/config.py`.

Required environment variables:

- `COGNEE_API_BASE_URL`
- `COGNEE_TENANT_ID`
- `COGNEE_API_KEY`
- `OPEN_ROUTER_KEY`

Recommended additional variables:

- `MEMGOAT_ENV=development`
- `MEMGOAT_DEMO_MODE=true`
- `MEMGOAT_TIMER_SECONDS=120`
- `MEMGOAT_DB_PATH=backend/data/memgoat.sqlite`
- `MEMGOAT_MEMORY_PROVIDER=cognee`
- `MEMGOAT_CONTENT_ROOT=backend/content/chains`

Do not expose secrets through frontend build variables.

### 4.2 Content Model

Create Pydantic models for:

- Chain
- Room
- Room exit
- Hotspot
- Inspection
- Candidate memory
- Memory node
- Memory edge
- False memory trigger
- Refinement rule
- Final recall condition
- Demo checkpoint

`last-lantern.json` must define:

- Waking Chamber
- Bell Gallery
- Root Gate
- One-way transitions
- All inspectable objects
- Candidate memory choices
- Correct, incomplete, misleading, and false memories
- Expected graph nodes and edges
- Witch false-memory trigger
- Nara refinement rule
- Root Gate final recall requirements

### 4.3 API Surface

Implement these routes:

```http
POST /api/sessions
GET /api/sessions/{session_id}
POST /api/sessions/{session_id}/reset
POST /api/sessions/{session_id}/demo/fast-forward
GET /api/sessions/{session_id}/room
POST /api/sessions/{session_id}/objects/{object_id}/inspect
POST /api/sessions/{session_id}/memories/commit
POST /api/sessions/{session_id}/rooms/{room_id}/exit
POST /api/sessions/{session_id}/echo/ask
GET /api/sessions/{session_id}/echo/graph
GET /api/sessions/{session_id}/echo/memories/{memory_id}
POST /api/sessions/{session_id}/echo/memories/{memory_id}/dismiss
GET /api/sessions/{session_id}/events
GET /api/health
```

### 4.4 SQLite State

Persist:

- Sessions
- Current room
- Sealed rooms
- Examined objects
- Committed memories
- Memory nodes
- Memory edges
- Dismissed memories
- Goat short-term context
- Event log
- Cognee provider traces

Reset behavior:

- Clear goat short-term context.
- Increment reset count.
- Start a fresh memory window.
- Preserve committed Cave Echo memories.
- Preserve graph nodes/edges unless explicitly dismissed.
- Discard uncommitted inspection state.

### 4.5 MemoryService

Define a stable interface:

```python
class MemoryService:
    async def remember(self, session_id, memory, nodes, edges, metadata): ...
    async def recall(self, session_id, question, graph_snapshot): ...
    async def dismiss(self, session_id, memory_id): ...
    async def refine(self, session_id, existing_memory_id, memory, nodes, edges): ...
    async def graph(self, session_id): ...
    async def healthcheck(self): ...
```

Cognee provider requirements:

- Send `X-Api-Key` and `X-Tenant-Id` headers.
- Scope memories by MemGoat session ID.
- Store source object, room, confidence, status, category, and relationships as metadata.
- Return normalized recall results with answer, certainty, path nodes, path edges, supporting memories, and trace ID.
- Hide raw Cognee/API errors from the player.

Mock provider requirements:

- Use only in tests and local contract checks.
- Never silently replace Cognee in demo mode.

### 4.6 OpenRouter Usage

Use OpenRouter only for bounded tasks:

- Tight recall phrasing if Cognee returns structured evidence but weak prose.
- Goat/Cave Echo narration shaping from authored facts.

Do not use OpenRouter to invent puzzle-critical facts, object clues, or final answers.

## 5. Frontend Plan

### 5.1 App Layout

Build a two-zone app:

- Left: constrained Three.js cave diorama.
- Right: Cave Echo panel.

Desktop is primary. On narrow screens, stack cave over Echo panel while keeping timer and graph readable.

### 5.2 Three.js Diorama

Use React Three Fiber and Drei.

Each room component should own:

- Room geometry.
- Lighting.
- Fog/atmosphere.
- Clickable object meshes or billboards.
- Examined-state visuals.
- Transition animation hooks.

Suggested chamber implementation:

- `WakingChamber`: locket, dead lantern, scratched wall, sealing threshold.
- `BellGallery`: bronze echo bell, ring of names, broken lantern hook.
- `RootGate`: root gate, black mirror pool, Witch mark.

Hotspots should support:

- Mouse hover.
- Keyboard focus via mirrored DOM controls or accessible overlay list.
- Selected state.
- Examined state.
- Disabled state if room/object is unavailable.

Do not rely on the 3D scene alone for accessibility. Provide equivalent focusable controls and text state in the UI layer.

### 5.3 Cave Echo Panel

Required sections:

- Prominent countdown timer.
- Session/reset indicator.
- React Flow memory graph.
- Natural-language query input.
- Last recall result.
- Selected memory details.
- Suspicious/false-memory action area.
- Hidden-by-default demo controls.

Graph requirements:

- Meaningful nodes, not raw log lines.
- Edge labels for relationships.
- Distinct but not giveaway styling for suspicious memories.
- Dismissed memories removed or visibly marked according to UX choice.
- Highlighted path after recall.
- Refined memory uses same node identity with changed status/history.

### 5.4 Timer and Reset

The frontend owns the visible countdown but backend remains authoritative for reset state.

Requirements:

- Default `2:00`.
- Prominent display.
- Warning state near expiration.
- Presenter fast-forward.
- Presenter reset.
- On expiry, call backend reset.
- Show goat confusion and preserved Cave Echo graph.

### 5.5 Demo Controls

Support both:

- Keyboard shortcut, for example `Ctrl+Shift+D`, to reveal/hide demo panel.
- Hidden-by-default panel with:
  - Reset now.
  - Fast-forward timer.
  - Restart session.
  - Run health/preflight.
  - Optional checkpoint display in development mode only.

Do not show demo controls by default during judge play.

## 6. Asset Plan

Put all replaceable assets in:

```text
ui/src/assets/
  scenes/
  objects/
  audio/
  textures/
```

Also maintain:

```text
backend/content/assets-manifest.json
ui/src/game/sceneAssets.ts
```

The manifest should map semantic asset IDs to files, not hard-code filenames throughout components.

First-pass asset requirements:

- Three chamber environment textures or generated painterly backdrops.
- Distinct object textures/props for the nine key objects.
- Sound cues for all required UX events.
- Visual captions/state changes for each sound cue.

Licensing:

- Generated original assets are acceptable.
- Public assets must be unrestricted or compatible with project use.
- Record source/license notes in `ui/src/assets/ASSET_NOTES.md`.

## 7. Vertical Slice Build Order

### Milestone 1: Playable Skeleton

- Scaffold React/Vite/TypeScript app.
- Scaffold FastAPI app.
- Add session creation.
- Load and validate `last-lantern.json`.
- Render app shell with empty Cave Echo panel.
- Render Waking Chamber diorama with placeholder geometry.
- Inspect one object and display candidate memory choices.

Exit criteria:

- User can start a session, click the locket, inspect it, and see candidate memories.

### Milestone 2: Commit and Graph Loop

- Add SQLite persistence.
- Add commit endpoint.
- Add MemoryService interface.
- Add Cognee provider healthcheck.
- Render React Flow graph.
- Commit locket/dead lantern/scratched wall memories.

Exit criteria:

- Committing memory creates backend records, calls MemoryService, and updates graph.

### Milestone 3: Recall Loop

- Implement `/echo/ask`.
- Add Cognee recall normalization.
- Add query normalization.
- Highlight graph path.
- Add missing-memory states.

Exit criteria:

- "What do I know?" and "What does the bell need?" return structured answers with path IDs after required memories exist.

### Milestone 4: Timer, Reset, and One-Way Rooms

- Add visible timer.
- Add reset endpoint and reset UI.
- Add presenter reset/fast-forward.
- Add room exit confirmation.
- Seal prior room after transition.
- Build Bell Gallery scene.

Exit criteria:

- Reset clears goat context but graph remains; Waking Chamber cannot be re-entered after sealing.

### Milestone 5: Refinement and False Memory

- Implement Nara refinement.
- Build suspicious memory styling.
- Inject Witch false memory in Root Gate.
- Add inspect/dismiss memory flow.
- Exclude dismissed memory from recall.

Exit criteria:

- Nara refines instead of duplicating; Thorn can be dismissed and no longer affects future answers.

### Milestone 6: Final Recall and Ending

- Build Root Gate scene.
- Add final recall condition.
- Add final reconstruction animation.
- Add required final line.
- Add door opening success state.

Exit criteria:

- Player can complete The Last Lantern from opening through Root Gate.

### Milestone 7: Polish and Demo Hardening

- Add generated placeholder art/sound pass.
- Add accessibility pass.
- Add responsive layout pass.
- Add Cognee preflight.
- Add complete demo rehearsal script.
- Fix pacing to complete in 5-7 minutes.

Exit criteria:

- Full demo path succeeds twice in a row from a fresh session.

## 8. Validation Plan

This section is intended for the development agent to run before handing the build to user testing.

### 8.1 Backend Automated Tests

Content validation:

- `last-lantern.json` loads successfully.
- Every room has at least one hotspot.
- Every hotspot has 2-3 candidate memories.
- Candidate memory IDs are unique.
- Node and edge references are valid.
- Final recall path references valid graph entities.
- False memory trigger references a valid room/object/event.
- Refinement rule references an existing memory concept.

Session behavior:

- New session starts in Waking Chamber.
- Timer duration defaults to 120 seconds.
- Reset increments reset count.
- Reset clears goat short-term context.
- Reset preserves committed memories.
- Reset discards uncommitted inspection state.

Room progression:

- Current-room objects can be inspected.
- Exiting Waking Chamber seals it.
- Exiting Bell Gallery seals it.
- Sealed-room objects cannot be inspected.
- Prior-room memories remain available through Cave Echo.

Memory commit:

- Invalid candidate IDs are rejected.
- Commit persists memory in SQLite.
- Commit creates expected graph node/edge records.
- Commit calls MemoryService.
- Object becomes examined after commit.

Recall:

- "What do I know?" works after reset.
- "What does the bell need?" uses earlier Waking Chamber memory.
- "Who am I?" is partial before Root Gate evidence.
- "Who am I?" resolves to Nara after final evidence.
- Unknown or underspecified questions return missing-memory hints.
- Raw provider errors are not returned to the frontend.

False memory:

- Witch memory is injected at Root Gate.
- Thorn memory is marked suspicious/false.
- False memory has weak/untrusted source metadata.
- Dismissal requires a valid inspected memory.
- Dismissed memory is excluded from future recall.

Refinement:

- Bell Gallery clue refines Nara instead of creating a duplicate Nara node.
- Refined node preserves source/history.
- Graph snapshot marks the memory as refined.

Cognee integration:

- Healthcheck succeeds with configured `.env`.
- Required headers are sent.
- Provider traces are logged.
- Demo preflight fails loudly if Cognee is unavailable.

### 8.2 Frontend Automated Tests

Component tests:

- App shell renders two-zone layout.
- Timer is visible on initial session.
- Cave Echo panel renders graph, query input, recall result area, and memory details.
- Hotspot selection opens inspection UI.
- Candidate memory choice triggers commit request.
- Examined object visual state changes after commit.
- Selected graph node opens memory details.
- Suspicious memory shows dismiss action.
- Dismiss action asks for confirmation.
- Demo panel is hidden by default.
- Keyboard shortcut toggles demo panel.

Three.js smoke tests:

- Canvas mounts without WebGL errors.
- Each room renders at least one visible object.
- Hotspot click triggers object selection.
- Room transition swaps scene.
- Camera is constrained; no free navigation mode appears.

End-to-end tests:

- Start a new session.
- Inspect and commit locket memory.
- Verify graph node appears.
- Inspect and commit dead lantern or scratched wall.
- Exit Waking Chamber and verify it seals.
- Ask a Bell Gallery question using Waking Chamber memory.
- Trigger reset and verify graph persists.
- Ask "What do I know?" and recover context.
- Commit Bell Gallery refinement.
- Reach Root Gate.
- Verify Witch false memory appears.
- Inspect and dismiss Thorn memory.
- Ask final recall question.
- Verify Root Gate opens and final line appears.

Responsive/accessibility tests:

- Desktop layout has no overlapping UI at demo resolution.
- Narrow layout stacks cave and Echo panel.
- Timer remains visible on narrow screens.
- Keyboard can reach hotspots or equivalent controls.
- Critical state changes are represented in text/visual UI, not sound alone.
- Color is not the only indicator for warning, suspicious, dismissed, or refined state.

### 8.3 Manual Acceptance Checklist

Run the full demo from a clean session and confirm:

- Opening hook completes in under 30 seconds.
- First memory can be committed within 60 seconds.
- The timer feels prominent and urgent.
- The player actively chooses what to remember.
- The graph visibly changes after each commit.
- One-way transition is clear and consequential.
- After reset, goat narration/context is confused again.
- After reset, the Cave Echo graph remains.
- "What do I know?" reconstructs useful prior context.
- A Bell Gallery question depends on Waking Chamber memory.
- Nara refinement is visible as an evolution of the same memory.
- Thorn false memory is plausible but suspicious.
- Dismissing Thorn visibly cleans or corrects the graph.
- Later recall no longer trusts Thorn.
- Final recall uses memories from multiple rooms.
- The Root Gate opens only after correct reconstruction.
- Final line appears exactly: "I was not escaping the cave. I was escaping forgetfulness."
- Muted playback remains understandable.
- No raw Cognee, OpenRouter, Python, JavaScript, or network errors appear in the UI.

### 8.4 Demo Preflight Checklist

Before a live demo:

- Backend starts successfully.
- Frontend starts successfully.
- `.env` is present in `backend/`.
- Cognee healthcheck succeeds.
- OpenRouter healthcheck succeeds if enabled for phrasing.
- Fresh session can be created.
- Required preflight recall questions return usable structured responses.
- Demo panel can be shown and hidden.
- Fast-forward and reset controls work.
- Full path has been completed once from a fresh session.

## 9. Remaining Inputs Needed

All previously open implementation inputs are closed.

The backend `.env` contains:

- `COGNEE_API_BASE_URL`
- `COGNEE_TENANT_ID`
- `COGNEE_API_KEY`
- `OPEN_ROUTER_KEY`
- `OPEN_ROUTER_MODEL`

The Cognee base URL should be treated as the endpoint base. If the implementation agent needs exact REST routes, request/response schemas, or SDK method names for `CogneeMemoryService`, use the official Cognee documentation at `https://docs.cognee.ai/`.

Generated image and audio assets may be committed to the repo for the first implementation pass. Keep them isolated under `ui/src/assets/`, reference them through the asset manifest, and record generated/public asset provenance in `ui/src/assets/ASSET_NOTES.md`.

No additional API tokens or product decisions are currently needed before implementation starts.
