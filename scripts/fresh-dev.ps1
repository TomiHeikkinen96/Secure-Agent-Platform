[CmdletBinding()]
param(
    [switch]$NoBrowser,
    [switch]$FollowLogs
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "This will delete local Docker volumes, run checks, and start the app."
Write-Host "It removes local SQL Server data and the frontend node_modules volume."
$answer = Read-Host "Type FRESH to continue"

if ($answer -ne "FRESH") {
    Write-Host "Fresh start cancelled."
    return
}

& "$PSScriptRoot\reset-local-data.ps1" -Force

& "$PSScriptRoot\start-dev.ps1" `
    -RunChecks `
    -NoBrowser:$NoBrowser.IsPresent `
    -FollowLogs:$FollowLogs.IsPresent
