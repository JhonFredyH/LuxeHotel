@echo off
setlocal enabledelayedexpansion
cd /d %~dp0\..

echo.
echo [LuxeHotel] Starting Docker stack...

docker compose up --build
if errorlevel 1 (
  echo.
  echo ERROR: docker compose up failed.
  exit /b 1
)

echo.
echo [LuxeHotel] Done. Frontend: http://localhost:5173
echo [LuxeHotel] Done. Backend: http://localhost:8000
endlocal
