#!/usr/bin/env bash
# Smoke-test the image built from Dockerfile.vercel. The app calls no external APIs, so no mock is needed.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t lasm-on-vercel .`):
#   ./local-test/smoke-test.sh
set -uo pipefail

IMAGE=${IMAGE:-lasm-on-vercel}
APP_PORT=${APP_PORT:-8080}
NAME=lasm-smoke-$$
BODY=$(mktemp)
cleanup() { docker rm -f "$NAME" "$NAME-default" >/dev/null 2>&1 || true; rm -f "$BODY"; }
trap cleanup EXIT

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
wait_for() { for _ in $(seq 1 60); do curl -sf "$1" >/dev/null && return 0; sleep 0.5; done; return 1; }
check() { # name, expected status, expected body substring, curl args...
  local name=$1 want=$2 needle=$3; shift 3
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ] && grep -qF -- "$needle" "$BODY"; then pass "$name ($got)"
  else bad "$name (got $got, want $want with $needle)"; cat "$BODY"; echo; fi
}

# Run like Vercel does: PORT is set, the process listens on 0.0.0.0.
docker run -d --name "$NAME" -p "$APP_PORT:$APP_PORT" -e PORT="$APP_PORT" "$IMAGE" >/dev/null
BASE=http://localhost:$APP_PORT
wait_for "$BASE/health" || bad "server did not start on PORT=$APP_PORT"

check "health"                 200 '"ok":true'                        "$BASE/health"
check "root"                   200 'Hello from Lean on Vercel!'       "$BASE/"
check "Lean handler with param" 200 'Hello, Ada, from Lean on Vercel!' "$BASE/hello/Ada"
check "proved clamp (upper)"   200 '"limit":100'                      "$BASE/limit/5000"
check "proved clamp (lower)"   200 '"limit":1'                        "$BASE/limit/0"
check "proved clamp (in range)" 200 '"limit":42'                      "$BASE/limit/42"
check "JSON echo"              200 '"echo":{"lean":4,"proofs":true}'  -H 'content-type: application/json' \
  -d '{"lean":4,"proofs":true}' "$BASE/echo"
check "unknown route"          404 ''                                 "$BASE/nope"

# Clean shutdown: Vercel sends SIGTERM before stopping an instance.
start=$(date +%s%N)
docker stop -t 10 "$NAME" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
[ "$code" = 0 ] && [ "$ms" -lt 10000 ] && pass "SIGTERM exits cleanly (code $code, ${ms} ms)" || bad "SIGTERM (exit code $code after ${ms} ms)"

# Default port: with no PORT override the image listens on 80, Vercel's default.
docker run -d --name "$NAME-default" -p "$APP_PORT:80" "$IMAGE" >/dev/null
wait_for "$BASE/health" && pass "default PORT=80" || bad "default PORT=80"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
