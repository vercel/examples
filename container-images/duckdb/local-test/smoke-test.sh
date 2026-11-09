#!/usr/bin/env bash
# Smoke-test the DuckDB image against a fake object store. No real data or keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t duckdb-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-duckdb-on-vercel}
APP_PORT=${APP_PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
KEY=test-api-key
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$APP_PORT
BODY=$(mktemp)

python3 "$HERE/mock_storage.py" "$MOCK_PORT" &
MOCK_PID=$!
NAME=duckdb-smoke-$$
cleanup() { docker rm -f "$NAME" "$NAME-default" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; rm -f "$BODY"; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); STORAGE=http://127.0.0.1:$MOCK_PORT
else
  NET=(-p "$APP_PORT:$APP_PORT"); STORAGE=http://host.docker.internal:$MOCK_PORT
fi

docker run -d --name "$NAME" "${NET[@]}" \
  -e PORT="$APP_PORT" -e API_KEY="$KEY" -e DATA_URL="$STORAGE/sales.csv" \
  "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$BASE/health" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; cat "$BODY"; echo; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; fi
}
contains() { grep -q -- "$2" "$BODY" && pass "$1" || bad "$1"; }
AUTH=(-H "Authorization: Bearer $KEY")
q() { curl -s -o "$BODY" -w '%{http_code}' "${AUTH[@]}" -H 'content-type: application/json' -d "{\"sql\":\"$1\"}" "$BASE/query"; }
checkq() { local got; got=$(q "$3"); [ "$got" = "$2" ] && pass "$1 ($got)" || bad "$1 (got $got, want $2)"; }

check "health" 200 "$BASE/health"
contains "health reports 6 loaded rows" '"rows":6'
contains "health reports DuckDB 2.0.0" '"duckdb":"2.0.0"'
check "rejects missing API key" 401 -X POST -H 'content-type: application/json' -d '{"sql":"SELECT 1"}' "$BASE/query"
check "rejects wrong API key" 401 -H "Authorization: Bearer nope" "$BASE/schema"
check "schema" 200 "${AUTH[@]}" "$BASE/schema"
contains "schema lists columns" '"name":"units"'
checkq "aggregate query" 200 "SELECT region, sum(units * price) AS revenue FROM data GROUP BY region ORDER BY region"
contains "aggregate result" '\["amer",993.0\],\["apac",1158.0\],\["emea",970.0\]'
checkq "rejects non-SELECT statements" 400 "CREATE TABLE t AS SELECT 1"
checkq "blocks network reads" 400 "SELECT * FROM read_csv('$STORAGE/sales.csv')"
contains "network read blocked by configuration" "disabled by configuration"
checkq "blocks local file reads" 400 "SELECT * FROM read_text('/etc/passwd')"
checkq "caps rows at MAX_ROWS" 200 "SELECT * FROM range(5000)"
contains "result marked truncated" '"truncated":true'

# Default PORT: no PORT override, so the image must listen on 80 like it does on Vercel.
docker run -d --name "$NAME-default" -p 18080:80 --add-host=host.docker.internal:host-gateway \
  -e API_KEY="$KEY" -e DATA_URL="http://host.docker.internal:$MOCK_PORT/sales.csv" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf http://localhost:18080/health >/dev/null && break; sleep 0.5; done
check "listens on default port 80" 200 http://localhost:18080/health

# Clean shutdown: Vercel sends SIGTERM with a 30s grace period.
start=$(date +%s)
docker stop -t 30 "$NAME" >/dev/null
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
[ "$code" = 0 ] && pass "SIGTERM exits cleanly (code 0 in $(( $(date +%s) - start ))s)" || { echo "FAIL  SIGTERM exit code $code"; fail=1; }

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
