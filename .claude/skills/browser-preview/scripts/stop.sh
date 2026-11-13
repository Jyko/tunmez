#!/usr/bin/env bash
# Stops the processes started by start.sh.
set -uo pipefail

dir=${TUNMEZ_PREVIEW_DIR:-${TMPDIR:-/tmp}/tunmez-preview}
for port in "${TUNMEZ_PREVIEW_PORT:-8765}" "${TUNMEZ_PREVIEW_VITE_PORT:-9246}"; do
  lsof -ti:"$port" -sTCP:LISTEN 2>/dev/null | xargs -r kill
done
rm -f "$dir"/*.pid
echo "tunmez preview stopped"
