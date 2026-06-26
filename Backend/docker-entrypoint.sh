#!/bin/sh
set -e

echo "[backend] Waiting for database..."
RETRIES=30
until PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -eq 0 ]; then
    echo "[backend] Could not connect to database, starting anyway..."
    break
  fi
  echo "[backend] Waiting... ($RETRIES retries left)"
  sleep 2
done

ROOMS_TABLE_EXISTS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -tAc \
  "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rooms' LIMIT 1")

if [ "$ROOMS_TABLE_EXISTS" != "1" ]; then
  echo "[backend] Fresh database detected. Restoring backup.utf8.sql..."
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f /app/backup.utf8.sql
fi

echo "[backend] Repairing schema if needed..."
python /app/fix_alembic.py

echo "[backend] Seeding admin user..."
python /app/scripts/seed_admin.py

echo "[backend] Starting API..."
exec uvicorn main:app --host 0.0.0.0 --port 8000