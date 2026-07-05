$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$backendRoot = Join-Path $root "backend"
$uiRoot = Join-Path $root "ui"
$artifactRoot = Join-Path $root "output\local-smoke"
New-Item -ItemType Directory -Force -Path $artifactRoot | Out-Null

$python = Join-Path $backendRoot ".venv\Scripts\python.exe"
$dbPath = [System.IO.Path]::GetTempFileName()
$backend = $null
$frontend = $null
$api = "http://127.0.0.1:8000"
$ui = "http://127.0.0.1:5173"

function Wait-ForUrl($url) {
  $lastError = $null
  for ($i = 0; $i -lt 60; $i++) {
    try {
      return Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    } catch {
      $lastError = $_
      Start-Sleep -Seconds 1
    }
  }
  throw $lastError
}

function Api-Post($path, $body = $null) {
  $params = @{
    Uri = "$api$path"
    Method = "POST"
  }
  if ($null -ne $body) {
    $params.ContentType = "application/json"
    $params.Body = ($body | ConvertTo-Json -Depth 20)
  }
  Invoke-RestMethod @params
}

function Api-Get($path) {
  Invoke-RestMethod -Uri "$api$path" -Method "GET"
}

function Commit-Memory($sessionId, $objectId, $memoryId) {
  Api-Post "/api/sessions/$sessionId/objects/$objectId/inspect" | Out-Null
  Api-Post "/api/sessions/$sessionId/memories/commit" @{
    object_id = $objectId
    candidate_id = $memoryId
  } | Out-Null
}

try {
  if (!(Test-Path $python)) {
    throw "Backend virtualenv was not found at $python. Run backend setup first."
  }

  $backend = Start-Job -ScriptBlock {
    param($backendRoot, $dbPath, $python)
    Set-Location $backendRoot
    $env:MEMGOAT_MEMORY_PROVIDER = "mock"
    $env:MEMGOAT_DEMO_MODE = "false"
    $env:MEMGOAT_DB_PATH = $dbPath
    & $python -B -m uvicorn app.main:app --host 127.0.0.1 --port 8000
  } -ArgumentList $backendRoot, $dbPath, $python

  $frontend = Start-Job -ScriptBlock {
    param($uiRoot, $python)
    Set-Location $uiRoot
    & $python -m http.server 5173 --bind 127.0.0.1
  } -ArgumentList $uiRoot, $python

  Wait-ForUrl "$api/api/health" | Out-Null
  $uiResponse = Wait-ForUrl $ui
  if ($uiResponse.Content -notmatch "script.js" -or $uiResponse.Content -notmatch "MemGoat") {
    throw "Static UI did not serve the expected integrated app shell."
  }

  $session = Api-Post "/api/sessions"
  $sessionId = $session.id
  $room = Api-Get "/api/sessions/$sessionId/room"
  if ($room.id -ne "waking-chamber") {
    throw "Expected waking-chamber, got $($room.id)."
  }

  Commit-Memory $sessionId "locket" "mem_nara_unknown"
  Commit-Memory $sessionId "dead_lantern" "mem_lantern_needs_name"
  $room = Api-Post "/api/sessions/$sessionId/rooms/waking-chamber/exit"
  if ($room.id -ne "bell-gallery") {
    throw "Expected bell-gallery, got $($room.id)."
  }

  Commit-Memory $sessionId "echo_bell" "mem_bell_needs_nara"
  Commit-Memory $sessionId "ring_of_names" "mem_nara_keeper"
  Commit-Memory $sessionId "lantern_hook" "mem_lantern_points_gate"
  $room = Api-Post "/api/sessions/$sessionId/rooms/bell-gallery/exit"
  if ($room.id -ne "root-gate") {
    throw "Expected root-gate, got $($room.id)."
  }

  Commit-Memory $sessionId "root_gate" "mem_gate_needs_chain"
  Commit-Memory $sessionId "mirror_pool" "mem_escape_forgetfulness"
  $recall = Api-Post "/api/sessions/$sessionId/echo/ask" @{ question = "Who am I?" }
  if (!$recall.final_open) {
    throw "Final recall did not open."
  }

  $graph = Api-Get "/api/sessions/$sessionId/echo/graph"
  $result = @{
    ui = $ui
    api = $api
    session_id = $sessionId
    final_room = $room.id
    memory_count = $graph.memories.Count
    final_line = $recall.final_line
  }
  $result | ConvertTo-Json -Depth 20 | Set-Content -Encoding utf8 (Join-Path $artifactRoot "smoke-result.json")
  $result
} finally {
  if ($backend) {
    Stop-Job $backend -ErrorAction SilentlyContinue
    Remove-Job $backend -Force -ErrorAction SilentlyContinue
  }
  if ($frontend) {
    Stop-Job $frontend -ErrorAction SilentlyContinue
    Remove-Job $frontend -Force -ErrorAction SilentlyContinue
  }
}
