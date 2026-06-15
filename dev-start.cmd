@echo off
setlocal

cd /d "%~dp0"
start "AI Community Board" powershell.exe -NoExit -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-dev.ps1" %*
