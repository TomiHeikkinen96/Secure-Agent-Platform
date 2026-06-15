@echo off
setlocal

cd /d "%~dp0"
start "AI Community Board Fresh Start" powershell.exe -NoExit -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\fresh-dev.ps1" %*
