@echo off
setlocal

cd /d "%~dp0"
start "AI Community Board Reset" powershell.exe -NoExit -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\reset-local-data.ps1" %*
