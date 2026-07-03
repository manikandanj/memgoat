$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$backendRoot = Join-Path $root "backend"
$uiRoot = Join-Path $root "ui"
$artifactRoot = Join-Path $root "output\playwright"
New-Item -ItemType Directory -Force -Path $artifactRoot | Out-Null

$dbPath = [System.IO.Path]::GetTempFileName()
$backend = $null
$frontend = $null

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

try {
  $backend = Start-Job -ScriptBlock {
    param($backendRoot, $dbPath)
    Set-Location $backendRoot
    $env:MEMGOAT_MEMORY_PROVIDER = "mock"
    $env:MEMGOAT_DEMO_MODE = "false"
    $env:MEMGOAT_DB_PATH = $dbPath
    .\.venv\Scripts\python.exe -B -m uvicorn app.main:app --host 127.0.0.1 --port 8000
  } -ArgumentList $backendRoot, $dbPath

  $frontend = Start-Job -ScriptBlock {
    param($uiRoot)
    Set-Location $uiRoot
    npm.cmd run dev -- --port 5173
  } -ArgumentList $uiRoot

  Wait-ForUrl "http://127.0.0.1:8000/api/health" | Out-Null
  Wait-ForUrl "http://127.0.0.1:5173" | Out-Null

  $npxArgs = @("--yes", "--package", "@playwright/cli", "playwright-cli")
  & npx.cmd @npxArgs "open" "http://127.0.0.1:5173"
  & npx.cmd @npxArgs "snapshot" | Out-File -Encoding utf8 (Join-Path $artifactRoot "snapshot.txt")

  $code = @'
async function(page) {
  async function clickChoice(objectText, choiceText) {
    await page.getByRole('button', { name: new RegExp(objectText, 'i') }).first().click();
    await page.getByRole('button', { name: new RegExp(choiceText, 'i') }).click();
  }

  await page.getByRole('heading', { name: 'MemGoat' }).waitFor();
  await clickChoice('Split Locket', 'Nara is tied to the goat');
  await clickChoice('Dead Lantern', 'The lantern needs a remembered name');
  await page.getByRole('button', { name: /Enter the Bell Gallery/i }).click();
  await clickChoice('Bronze Echo Bell', "The bell needs Nara's name");
  await clickChoice('Ring of Names', 'Nara kept the Last Lantern');
  await clickChoice('Broken Lantern Hook', 'Lantern light belongs at the Root Gate');
  await page.getByRole('button', { name: /Follow the bell tone to the Root Gate/i }).click();
  await clickChoice('Knotted Root Gate', 'The gate opens from linked memories');
  await clickChoice('Black Mirror Pool', 'The true escape is from forgetfulness');
  await page.getByLabel('Ask the Cave Echo').fill('Who am I?');
  await page.getByRole('button', { name: /Ask Echo/i }).click();
  await page.getByText('I was not escaping the cave. I was escaping forgetfulness.').waitFor();
  await page.screenshot({ path: 'output/playwright/e2e.png', fullPage: true });

  return {
    room: await page.locator('.echo-header p').innerText(),
    memories: await page.locator('.section-title span').innerText(),
    finalLine: await page.locator('.final-line strong').innerText(),
    canvasCount: await page.locator('canvas').count(),
    status: await page.locator('.status-strip').innerText()
  };
}
'@

  $codePath = Join-Path $artifactRoot "e2e-run.js"
  Set-Content -LiteralPath $codePath -Value $code -Encoding utf8
  & npx.cmd @npxArgs "run-code" "--filename" $codePath "--json" | Tee-Object -FilePath (Join-Path $artifactRoot "e2e.json")
  & npx.cmd @npxArgs "close"
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
