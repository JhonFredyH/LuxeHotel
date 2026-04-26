# LuxeHotel Docker Quick Start

## Start / Stop (safe)
- Start: scripts\docker-up.cmd
- Stop (keeps data): scripts\docker-down.cmd

You can also run everything directly from the project root:
- `docker compose up --build`
- `docker compose down`

## Backup / Restore
- Backup: scripts\docker-backup.cmd
  Output: Backend\backups\luxeHotel_YYYY-MM-DD_HH-MM-SS.sql

- Restore: scripts\docker-restore.cmd "C:\path\to\backup.sql"

## Important
- Do NOT run: `docker compose down -v` unless you want to delete the database.
- Data persists in Docker volume: `postgres_data`.
- Frontend runs on `http://localhost:5173`.
- Backend runs on `http://localhost:8000`.
