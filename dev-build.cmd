@echo off
setlocal

cd /d "%~dp0"
start "AI Community Board Checks" powershell.exe -NoExit -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-dev.ps1" -ChecksOnly %*
