#!/usr/bin/env bash
# Smoke-test the Worker 755 image against a fake OpenAI-compatible model server. No real API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t worker755-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-worker755-on-vercel}
GAME_PORT=${GAME_PORT:-8080}
DEFAULT_PORT_HOST=${DEFAULT_PORT_HOST:-8081}
MOCK_PORT=${MOCK_PORT:-9999}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$GAME_PORT
TMP=$(mktemp -d)

python3 "$HERE/mock_llm.py" "$MOCK_PORT" >"$TMP/mock.log" &
MOCK_PID=$!
NAME=worker755-smoke-$$
cleanup() { docker rm -f "$NAME" "$NAME-port" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; rm -rf "$TMP"; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); LLM=http://127.0.0.1:$MOCK_PORT/v1
else
  NET=(-p "$GAME_PORT:$GAME_PORT"); LLM=http://host.docker.internal:$MOCK_PORT/v1
fi

# The game's "local model server" setting points the manager at the mock.
docker run -d --name "$NAME" "${NET[@]}" -e PORT="$GAME_PORT" -e LOCAL_LLM_URL="$LLM" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$BASE/" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$TMP/body" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; cat "$TMP/body"; echo; fi
}
JSON=(-H 'content-type: application/json')

check "web app" 200 "$BASE/"
grep -qi '<html' "$TMP/body" && pass "serves the built web app" || bad "no HTML in /"
check "game config" 200 "$BASE/api/models"
check "rejects a shift with no key" 400 "${JSON[@]}" -d '{}' "$BASE/api/sessions"
check "lists the model server's models" 200 "$BASE/api/models?provider=local"
grep -q '"mock-manager"' "$TMP/body" && pass "mock model offered" || bad "mock model not offered"
check "starts a shift" 201 "${JSON[@]}" \
  -d '{"provider":"local","apiKey":"","model":"mock-manager"}' "$BASE/api/sessions"
ID=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["id"])' "$TMP/body" 2>/dev/null || true)
[ -n "$ID" ] && pass "shift has an id" || bad "no shift id"

# The event stream should carry the manager's instruction from the mock to the player.
curl -s -N --max-time 15 "$BASE/api/sessions/$ID/events" >"$TMP/events" || true
grep -q '^data: ' "$TMP/events" && pass "event stream (text/event-stream)" || bad "no events streamed"
grep -q 'MOCK-755' "$TMP/events" && pass "manager instruction streamed to the player" || bad "instruction not streamed"
grep -q 'tools=Agent' "$TMP/mock.log" && pass "manager called the model with its tools" || bad "model server not called with tools"

# Vercel routes to port 80 unless PORT is set: run once more with the image's defaults.
docker run -d --name "$NAME-port" -p "$DEFAULT_PORT_HOST:80" "$IMAGE" >/dev/null
ok=; for _ in $(seq 1 60); do curl -sf "http://localhost:$DEFAULT_PORT_HOST/" >/dev/null && ok=1 && break; sleep 0.5; done
[ -n "$ok" ] && pass "default PORT 80" || bad "nothing on default port 80"

# Vercel sends SIGTERM on scale-in with a 30 second grace period.
start=$(date +%s); docker stop -t 30 "$NAME-port" >/dev/null; secs=$(( $(date +%s) - start ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME-port")
[ "$code" = 0 ] && [ "$secs" -lt 30 ] && pass "clean SIGTERM shutdown (exit $code in ${secs}s)" || bad "SIGTERM shutdown (exit $code in ${secs}s)"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
