#!/bin/sh
set -e

echo "[frontend] Installing dependencies..."
mkdir -p /app/node_modules
find /app/node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +
npm ci
npm install @rollup/rollup-linux-x64-gnu --no-save

echo "[frontend] Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0 --port 5173
