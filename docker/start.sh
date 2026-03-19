#!/usr/bin/env bash
set -euo pipefail

# Railway provides PORT env var - must use it
if [ -z "${PORT:-}" ]; then
  echo "[start] ERROR: PORT environment variable is not set!"
  exit 1
fi

echo "[start] Using PORT=$PORT"

export BACKEND_PORT="${BACKEND_PORT:-5555}"
export FRONTEND_PORT="${FRONTEND_PORT:-3000}"

# Setup nginx config
mkdir -p /etc/nginx/conf.d
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "[start] Starting services..."

# Start backend
cd /app/server && node app.js &
BACKEND_PID=$!

# Start frontend (force port 3000, ignore PORT env)
cd /app/client && PORT=3000 npm start &
FRONTEND_PID=$!

# Wait for services to be ready
echo "[start] Waiting for services..."
sleep 3

check_port() {
  local port=$1
  local name=$2
  local max_attempts=30
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    if nc -z localhost $port 2>/dev/null; then
      echo "[start] $name ready on port $port"
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done

  echo "[start] WARNING: $name not responding on port $port"
  return 1
}

check_port 5555 "backend" || true
check_port 3000 "frontend" || true

echo "[start] Starting nginx..."

trap 'kill $FRONTEND_PID $BACKEND_PID $NGINX_PID 2>/dev/null || true' TERM INT EXIT

nginx -g 'daemon off;' &
NGINX_PID=$!

wait $NGINX_PID
