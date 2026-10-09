@echo off
title CatchUp AI - Hackathon Launcher
color 0A
echo ============================================================
echo   CatchUp AI - "What Did I Miss?"
echo   Starting local application...
echo ============================================================
echo.

REM Try to launch via server.ps1 if PowerShell is available, otherwise open index.html directly
where powershell >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting zero-dependency local server on http://localhost:8000 ...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
) else (
    echo Opening CatchUp AI directly in your default browser...
    start "" "%~dp0index.html"
)
