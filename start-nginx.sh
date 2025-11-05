#!/bin/sh
set -e

# Set default BACKEND_URL if not provided
BACKEND_URL="${BACKEND_URL:-https://auth-backend-7v5surudzq-uc.a.run.app}"

# Remove trailing slashes
BACKEND_URL=$(echo "$BACKEND_URL" | sed 's|/*$||')

# Validate BACKEND_URL is not empty
if [ -z "$BACKEND_URL" ]; then
  echo "ERROR: BACKEND_URL is empty or invalid"
  exit 1
fi

# Validate BACKEND_URL starts with http:// or https://
if ! echo "$BACKEND_URL" | grep -qE '^https?://'; then
  echo "ERROR: BACKEND_URL must start with http:// or https://"
  echo "Current value: $BACKEND_URL"
  exit 1
fi

# Export for envsubst
export BACKEND_URL

# Extract backend hostname (without protocol) for Host header
BACKEND_HOST=$(echo "$BACKEND_URL" | sed -E 's|^https?://||' | sed 's|/.*$||')
export BACKEND_HOST

# Set default PORT if not provided
PORT="${PORT:-8080}"
export PORT

# Log configuration for debugging
echo "Nginx Configuration:"
echo "  PORT: $PORT"
echo "  BACKEND_URL: $BACKEND_URL"
echo "  BACKEND_HOST: $BACKEND_HOST"

# Generate nginx config from template
envsubst '$PORT $BACKEND_URL $BACKEND_HOST' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Validate generated config
if ! nginx -t; then
  echo "ERROR: Generated nginx config is invalid"
  echo "BACKEND_URL: $BACKEND_URL"
  echo "PORT: $PORT"
  cat /etc/nginx/conf.d/default.conf
  exit 1
fi

# Start nginx
exec nginx -g 'daemon off;'

