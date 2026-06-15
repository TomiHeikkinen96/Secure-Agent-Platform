[CmdletBinding()]
param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "Stopping services and deleting local Docker volumes..."
Write-Host "This removes the SQL Server data volume and the frontend node_modules volume."

if (-not $Force) {
    $answer = Read-Host "Type RESET to continue"
    if ($answer -ne "RESET") {
        Write-Host "Reset cancelled."
        return
    }
}

docker compose down -v --remove-orphans

if ($LASTEXITCODE -ne 0) {
    throw "docker compose down -v --remove-orphans failed with exit code $LASTEXITCODE."
}

Write-Host "Local Docker data has been reset."
