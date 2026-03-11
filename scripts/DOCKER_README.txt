# LuxeHotel Docker Quick Start

## Start / Stop (safe)
- Start: scripts\docker-up.cmd
- Stop (keeps data): scripts\docker-down.cmd

## Backup / Restore
- Backup: scripts\docker-backup.cmd
  Output: ..\backups\luxeHotel_YYYY-MM-DD_HH-MM-SS.sql

- Restore: scripts\docker-restore.cmd "C:\path\to\backup.sql"

## Important
- Do NOT run: `docker compose down -v` unless you want to delete the database.
- Data persists in Docker volume: `postgres_data`.
