# MemGoat Static UI

This UI keeps the new cave presentation and asset style, but the game state now comes from the FastAPI backend.

## Runtime Contract

- `POST /api/sessions` opens a backend session.
- `GET /api/sessions/{id}/room` drives room title, summary, hotspots, exits, and sealed-room state.
- `POST /api/sessions/{id}/objects/{object_id}/inspect` loads inspection text and candidate memories.
- `POST /api/sessions/{id}/memories/commit` commits the chosen Echo memory.
- `POST /api/sessions/{id}/rooms/{room_id}/exit` advances when required memories are present.
- `POST /api/sessions/{id}/reset` handles the memory tide.
- `POST /api/sessions/{id}/echo/ask` powers Cave Voice answers.

## Local Use

Start the backend on `127.0.0.1:8000`, then serve this folder as static files on `127.0.0.1:5173`.

```powershell
cd backend
$env:MEMGOAT_MEMORY_PROVIDER = "mock"
$env:MEMGOAT_DEMO_MODE = "false"
.\.venv\Scripts\python.exe -B -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

```powershell
cd ui
python -m http.server 5173 --bind 127.0.0.1
```

Open `http://127.0.0.1:5173`.

To point the UI at a different API server, set `window.MEMGOAT_API_BASE` before loading `script.js`.
