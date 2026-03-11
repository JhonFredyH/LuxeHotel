@echo off
setlocal enabledelayedexpansion
cd /d %~dp0\..\Backend

set BACKUP_DIR=%~dp0\..\backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
  set dd=%%a
  set mm=%%b
  set yy=%%c
)
for /f "tokens=1-3 delims=: " %%a in ("%time%") do (
  set hh=%%a
  set mi=%%b
  set ss=%%c
)
set hh=!hh: =0!

set TS=!yy!-!mm!-!dd!_!hh!-!mi!-!ss!
set OUT=%BACKUP_DIR%\luxeHotel_!TS!.sql

echo.
echo [LuxeHotel] Creating DB backup...

docker exec -i luxehotel_db pg_dump -U luxe_user -d luxeHotel > "%OUT%"
if errorlevel 1 (
  echo.
  echo ERROR: backup failed.
  exit /b 1
)

echo.
echo [LuxeHotel] Backup saved: %OUT%
endlocal
