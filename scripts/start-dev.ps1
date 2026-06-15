[CmdletBinding()]
param(
    [switch]$ResetData,
    [switch]$NoBrowser,
    [switch]$FollowLogs,
    [switch]$RunChecks,
    [switch]$ChecksOnly
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# Keep launcher output readable in both the console and saved log files.
$env:COMPOSE_PROGRESS = "plain"
$env:COMPOSE_MENU = "false"

function Get-LocalSetting {
    param(
        [string]$Name,
        [string]$DefaultValue
    )

    foreach ($path in @(".env", ".env.example")) {
        if (-not (Test-Path $path)) {
            continue
        }

        foreach ($line in Get-Content $path) {
            $trimmed = $line.Trim()
            if ($trimmed -eq "" -or $trimmed.StartsWith("#")) {
                continue
            }

            $parts = $trimmed.Split("=", 2)
            if ($parts.Count -ne 2) {
                continue
            }

            if ($parts[0].Trim() -eq $Name) {
                return $parts[1].Trim().Trim('"').Trim("'")
            }
        }
    }

    return $DefaultValue
}

function Invoke-Compose {
    $Arguments = $args

    & docker compose --ansi never @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Invoke-ComposeCaptured {
    param(
        [string[]]$Arguments
    )

    $stdoutFile = New-TemporaryFile
    $stderrFile = New-TemporaryFile

    try {
        $process = Start-Process `
            -FilePath "docker" `
            -ArgumentList (@("compose", "--ansi", "never") + $Arguments) `
            -NoNewWindow `
            -Wait `
            -PassThru `
            -RedirectStandardOutput $stdoutFile.FullName `
            -RedirectStandardError $stderrFile.FullName

        return [pscustomobject]@{
            ExitCode = $process.ExitCode
            Output = @(
                Get-Content $stdoutFile.FullName
                Get-Content $stderrFile.FullName
            )
        }
    }
    finally {
        Remove-Item -LiteralPath $stdoutFile.FullName -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath $stderrFile.FullName -Force -ErrorAction SilentlyContinue
    }
}

function Invoke-ComposeWithRetry {
    param(
        [string]$Label,
        [string[]]$Arguments,
        [int]$Attempts = 12,
        [int]$DelaySeconds = 5
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        Write-Host "$Label (attempt $attempt/$Attempts)..."
        $result = Invoke-ComposeCaptured -Arguments $Arguments

        if ($result.ExitCode -eq 0) {
            $result.Output | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
                Write-Host $_
            }
            return
        }

        if ($attempt -eq $Attempts) {
            $result.Output | ForEach-Object {
                Write-Host $_
            }
            throw "$Label failed after $Attempts attempts."
        }

        Write-Host "$Label is not ready yet. Retrying in $DelaySeconds seconds..."
        Start-Sleep -Seconds $DelaySeconds
    }
}

function Wait-HttpEndpoint {
    param(
        [string]$Label,
        [string]$Url,
        [int]$Attempts = 30,
        [int]$DelaySeconds = 2
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                Write-Host "$Label is ready: $Url"
                return
            }
        }
        catch {
            if ($attempt -eq $Attempts) {
                throw "$Label did not become ready at $Url."
            }
        }

        Write-Host "Waiting for $Label (attempt $attempt/$Attempts)..."
        Start-Sleep -Seconds $DelaySeconds
    }
}

function Open-LocalUrl {
    param(
        [string]$Url
    )

    if ($NoBrowser) {
        return
    }

    Start-Process $Url
}

function Invoke-FrontendChecks {
    Write-Host "Running frontend dependency, lint, and build checks in Docker..."
    Write-Host "This uses the Compose frontend service and the frontend-node-modules volume."
    Invoke-Compose run --rm --no-deps frontend sh -c "npm install && npm run lint && npm run build"
}

function Show-ReadyScreen {
    param(
        [string]$FrontendUrl,
        [string]$BackendDocsUrl,
        [string]$BackendHealthUrl,
        [string]$FrontendPort,
        [string]$BackendPort
    )

    Write-Host ""
    Write-Host "============================================================"
    Write-Host " AI Community Board is running"
    Write-Host "============================================================"
    Write-Host ""
    Write-Host "Open these in your browser:"
    Write-Host "  Frontend:       $FrontendUrl"
    Write-Host "  Backend docs:   $BackendDocsUrl"
    Write-Host "  Backend health: $BackendHealthUrl"
    Write-Host ""
    Write-Host "What is running:"
    Write-Host "  db        SQL Server local development database"
    Write-Host "  backend   FastAPI app on host port $BackendPort"
    Write-Host "  frontend  Vite React app on host port $FrontendPort"
    Write-Host ""
    Write-Host "Keep this window open while developing."
    Write-Host "Press Ctrl+C here to stop the stack gracefully."
    Write-Host "Pasting text into this window will not stop the stack."
    Write-Host ""
    Write-Host "For logs in another terminal:"
    Write-Host "  docker compose logs --follow frontend backend"
    Write-Host ""
    Write-Host "For containerized frontend checks:"
    Write-Host "  .\dev-build.cmd"
    Write-Host ""
}

try {
    if (-not (Test-Path ".env")) {
        throw "Missing .env. Copy .env.example to .env and set the local SQL Server passwords first."
    }

    $frontendPort = Get-LocalSetting -Name "FRONTEND_HOST_PORT" -DefaultValue "5173"
    $backendPort = Get-LocalSetting -Name "BACKEND_HOST_PORT" -DefaultValue "8000"
    $frontendUrl = "http://localhost:$frontendPort/"
    $backendDocsUrl = "http://localhost:$backendPort/docs"
    $backendHealthUrl = "http://localhost:$backendPort/health"

    Write-Host "Starting local AI Community Board stack..."
    Write-Host "This window will open local URLs and then wait on a ready screen."
    Write-Host "Cleanup runs automatically when you stop the script."
    Write-Host ""

    if ($ResetData) {
        Write-Host "ResetData was requested. Removing containers and named volumes..."
        Invoke-Compose down -v --remove-orphans
    }

    if ($ChecksOnly) {
        Invoke-FrontendChecks
        Write-Host "Checks completed. Not starting the development stack because ChecksOnly was requested."
        return
    }

    Write-Host "Building the backend image used by setup helpers..."
    Invoke-Compose build backend

    Write-Host "Starting SQL Server..."
    Invoke-Compose up -d db

    Invoke-ComposeWithRetry `
        -Label "Creating the application database if it is missing" `
        -Arguments @("run", "--rm", "backend", "python", "-m", "app.db.create_database")

    Write-Host "Applying database migrations..."
    Invoke-Compose run --rm backend alembic upgrade head

    Write-Host "Loading development seed data..."
    Invoke-Compose run --rm backend python -m app.seed_dev

    if ($RunChecks) {
        Invoke-FrontendChecks
    }

    Write-Host "Starting frontend, backend, and database..."
    Invoke-Compose up -d --build frontend

    Write-Host ""
    Wait-HttpEndpoint -Label "Backend health endpoint" -Url $backendHealthUrl
    Wait-HttpEndpoint -Label "Frontend development server" -Url $frontendUrl

    Open-LocalUrl $frontendUrl
    # Uncomment if you want to see the docs too
    # Open-LocalUrl $backendDocsUrl

    Show-ReadyScreen `
        -FrontendUrl $frontendUrl `
        -BackendDocsUrl $backendDocsUrl `
        -BackendHealthUrl $backendHealthUrl `
        -FrontendPort $frontendPort `
        -BackendPort $backendPort

    if ($FollowLogs) {
        Write-Host "Following logs. Press Ctrl+C to stop the local stack."
        & docker compose logs --follow --tail=40 frontend backend
    }
    else {
        while ($true) {
            Start-Sleep -Seconds 3600
        }
    }
}
finally {
    Write-Host ""
    Write-Host "Stopping local containers and network..."
    & docker compose down
}
