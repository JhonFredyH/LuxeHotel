#!/bin/sh
set -e

echo "[render] Repairing database schema if needed..."
python fix_alembic.py

echo "[render] Seeding admin user..."
python scripts/seed_admin.py

echo "[render] Starting API on port ${PORT:-8000}..."
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
