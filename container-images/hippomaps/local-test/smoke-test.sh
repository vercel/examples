#!/usr/bin/env bash
# Smoke-test the hippomaps image against a fake search upstream. No real keys or map services are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t hippomaps-on-vercel .`):
#   bash local-test/smoke-test.sh
set -uo pipefail

IMAGE=${IMAGE:-hippomaps-on-vercel}
APP_PORT=${APP_PORT:-8080}       # PORT given to the container, as set in Vercel project settings
DEFAULT_PORT=${DEFAULT_PORT:-18080} # host port mapped to the image's default port 80
MOCK_PORT=${MOCK_PORT:-9998}
KEY=test-maps-key
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$APP_PORT
BODY=$(mktemp)

python3 "$HERE/mock_search.py" "$MOCK_PORT" &
MOCK_PID=$!
NAME=hippomaps-smoke-$$
cleanup() { docker rm -f "$NAME" "$NAME-default" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; rm -f "$BODY"; }
trap cleanup EXIT

# The container reaches the mock on the host through host.docker.internal (Linux, macOS and Windows).
docker run -d --name "$NAME" --add-host host.docker.internal:host-gateway -p "$APP_PORT:$APP_PORT" \
  -e PORT="$APP_PORT" \
  -e MAPS_KEY="$KEY" \
  -e SEARCH_UPSTREAM="http://host.docker.internal:$MOCK_PORT" \
  "$IMAGE" >/dev/null

for _ in $(seq 1 30); do curl -sf "$BASE/healthz" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; head -c 300 "$BODY"; echo; fi
}

check "health on PORT=$APP_PORT"      200 "$BASE/healthz"
check "map page at /"                 200 "$BASE/"
grep -q "data-key=\"$KEY\"" "$BODY" && pass "page carries MAPS_KEY" || bad "page does not carry MAPS_KEY"
grep -q 'data-api="/api/search"' "$BODY" && pass "page uses the relayed search" || bad "page does not use /api/search"
check "embedded script /static/app.js" 200 "$BASE/static/app.js"
check "service worker /sw.js"         200 "$BASE/sw.js"
check "search relayed to upstream"    200 -H 'X-Forwarded-For: 203.0.113.7' "$BASE/api/search/search?q=cafes+by+the+Limmat"
grep -q '"Mock Caf' "$BODY" && pass "search answer comes from upstream" || bad "search answer is not from upstream"
grep -q '"forwardedFor": "203.0.113.7"' "$BODY" && pass "visitor address forwarded" || bad "visitor address not forwarded"
check "unknown search path refused"   404 "$BASE/api/search/admin"
check "directions off without ROUTING_URL" 404 "$BASE/api/route?from=47.37,8.54&to=47.36,8.53&mode=walk"

# The image's default port: no PORT set, Vercel routes to 80.
docker run -d --name "$NAME-default" -p "$DEFAULT_PORT:80" "$IMAGE" >/dev/null
for _ in $(seq 1 30); do curl -sf "http://localhost:$DEFAULT_PORT/healthz" >/dev/null && break; sleep 0.5; done
check "health on default port 80"     200 "http://localhost:$DEFAULT_PORT/healthz"

# Clean shutdown on SIGTERM, as when Vercel scales an instance down.
start=$(date +%s)
docker stop -t 30 "$NAME" >/dev/null
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
secs=$(( $(date +%s) - start ))
if [ "$code" = 0 ] && [ "$secs" -lt 15 ]; then pass "clean exit on SIGTERM (code $code, ${secs}s)"; else bad "SIGTERM exit (code $code, ${secs}s)"; fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
