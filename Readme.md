# MemGoat

MemGoat is a local prototype with a FastAPI backend and a static HTML/CSS/JS frontend.

## Prerequisites

- Python 3.11 or newer
- PowerShell, for the provided local verification script

## Project Structure

- `backend/` - FastAPI app, content loader, SQLite persistence, and backend tests
- `ui/` - static frontend integrated with the backend API
- `scripts/verify-local.ps1` - end-to-end local verification script
- `reference/` - design, UX, and implementation notes

## Backend Setup

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

For local development, use the mock memory provider unless you have Cognee credentials configured:

```powershell
$env:MEMGOAT_MEMORY_PROVIDER = "mock"
$env:MEMGOAT_DEMO_MODE = "false"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend health endpoint is available at:

```text
http://127.0.0.1:8000/api/health
```

## Frontend Setup

In a second terminal, from the repository root:

```powershell
cd ui
python -m http.server 5173 --bind 127.0.0.1
```

Open the app at:

```text
http://127.0.0.1:5173
```

The static UI calls `http://127.0.0.1:8000` directly.

## Environment Variables

The backend reads environment variables directly or from `backend/.env`.

Common local settings:

```dotenv
MEMGOAT_ENV=development
MEMGOAT_MEMORY_PROVIDER=mock
MEMGOAT_DEMO_MODE=false
MEMGOAT_TIMER_SECONDS=120
MEMGOAT_DB_PATH=data/memgoat.sqlite
MEMGOAT_CONTENT_ROOT=content/chains
```

Optional external memory/LLM settings:

```dotenv
MEMGOAT_MEMORY_PROVIDER=cognee
COGNEE_API_BASE_URL=
COGNEE_TENANT_ID=
COGNEE_API_KEY=
OPEN_ROUTER_KEY=
OPEN_ROUTER_MODEL=
```

## Tests

Run backend tests:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest
```

Check frontend syntax:

```powershell
cd ui
node --check script.js
```

## Local Verification

After installing backend dependencies, run the local smoke test from the repository root:

```powershell
.\scripts\verify-local.ps1
```

The script starts the backend and static UI server, verifies the app shell loads, walks the backend room/memory flow, and writes `output/local-smoke/smoke-result.json`.
