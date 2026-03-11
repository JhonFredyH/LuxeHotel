@echo off
setlocal enabledelayedexpansion
cd /d %~dp0\..\Backend

echo.
echo [LuxeHotel] Stopping Docker stack (data preserved)...

docker compose down
if errorlevel 1 (
  echo.
  echo ERROR: docker compose down failed.
  exit /b 1
)

echo.
echo [LuxeHotel] Done.
endlocal
