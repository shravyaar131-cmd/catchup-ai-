@echo off
title CatchUp AI - Push to GitHub
color 0A
echo ============================================================
echo   CatchUp AI - Pushing to GitHub:
echo   https://github.com/shravyaar131-cmd/catchup-ai-
echo ============================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo Checking repository status...
git add .
git commit -m "Update CatchUp AI project files" 2>nul

echo.
echo Pushing to origin main...
echo (If this is your first push, a GitHub browser login window will appear.)
echo.
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ============================================================
    echo   SUCCESS! CatchUp AI is now live on your GitHub repo:
    echo   https://github.com/shravyaar131-cmd/catchup-ai-
    echo ============================================================
) else (
    echo ============================================================
    echo   Push encountered an error. Please make sure you are logged
    echo   in to GitHub and have write access to the repository.
    echo ============================================================
)
echo.
pause
