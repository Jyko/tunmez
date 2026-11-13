#!/usr/bin/env bash
# Starts tunmez in Wails server mode for the Playwright MCP plugin:
# Vite dev server + Go backend built with -tags server, with isolated data.
set -euo pipefail

root=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
dir=${TUNMEZ_PREVIEW_DIR:-${TMPDIR:-/tmp}/tunmez-preview}
app_port=${TUNMEZ_PREVIEW_PORT:-8765}
vite_port=${TUNMEZ_PREVIEW_VITE_PORT:-9246}
export PATH="$HOME/go/bin:$PATH"
# shellcheck disable=SC1091
. "$HOME/.nvm/nvm.sh" >/dev/null

if [[ ${1:-} == --reset ]]; then rm -rf "$dir/xdg"; fi
mkdir -p "$dir"/xdg/{data,config,state}

"$(dirname "$0")/stop.sh" >/dev/null

cd "$root"
# go:embed needs frontend/dist; the Vite proxy serves the real assets.
[[ -n $(ls -A frontend/dist 2>/dev/null) ]] || { mkdir -p frontend/dist && touch frontend/dist/.keep; }
[[ -d frontend/bindings ]] || wails3 generate bindings -clean=true -ts -i >/dev/null
go build -tags server -o "$dir/tunmez-server" .

(cd frontend; WAILS_VITE_PORT=$vite_port nohup npm run dev >"$dir/vite.log" 2>&1 </dev/null & echo $! >"$dir/vite.pid")
timeout 60 bash -c "until curl -sf http://127.0.0.1:$vite_port/ >/dev/null; do sleep 0.5; done"

(cd "$dir"; FRONTEND_DEVSERVER_URL=http://127.0.0.1:$vite_port WAILS_SERVER_PORT=$app_port \
  XDG_DATA_HOME=$dir/xdg/data XDG_CONFIG_HOME=$dir/xdg/config XDG_STATE_HOME=$dir/xdg/state \
  nohup ./tunmez-server >"$dir/server.log" 2>&1 </dev/null & echo $! >"$dir/server.pid")
timeout 30 bash -c "until curl -sf http://localhost:$app_port/health >/dev/null; do sleep 0.5; done"

echo "tunmez preview: http://localhost:$app_port/ (data and logs in $dir)"
