@echo off
setlocal enabledelayedexpansion
cd /d %~dp0\..

if "%~1"=="" (
  echo Usage: scripts\docker-restore.cmd "C:\path\to\backup.sql"
  exit /b 1
)

set FILE=%~1
if not exist "%FILE%" (
  echo ERROR: File not found: %FILE%
  exit /b 1
)

echo.
echo [LuxeHotel] Restoring DB from: %FILE%

docker compose exec -T db psql -U luxe_user -d luxeHotel < "%FILE%"
if errorlevel 1 (
  echo.
  echo ERROR: restore failed.
  exit /b 1
)

echo.
echo [LuxeHotel] Restore completed.
endlocal
