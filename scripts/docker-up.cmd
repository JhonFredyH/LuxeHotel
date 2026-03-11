@echo off
setlocal enabledelayedexpansion
cd /d %~dp0\..\Backend

echo.
echo [LuxeHotel] Starting Docker stack...

docker compose up -d
if errorlevel 1 (
  echo.
  echo ERROR: docker compose up failed.
  exit /b 1
)

echo.
echo [LuxeHotel] Done. Backend: http://localhost:8000
endlocal
