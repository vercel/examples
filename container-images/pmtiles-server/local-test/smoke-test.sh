#!/usr/bin/env bash
# Smoke-test the tile server image against a fake bucket that serves a tiny PMTiles archive.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t pmtiles-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-pmtiles-on-vercel}
SERVER_PORT=${SERVER_PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$SERVER_PORT
PUBLIC_URL=https://tiles.example.com
TMP=$(mktemp -d)

python3 "$HERE/mock_bucket.py" "$MOCK_PORT" > "$TMP/bucket.log" &
MOCK_PID=$!
NAME=pmtiles-smoke-$$
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; rm -rf "$TMP"; }
trap cleanup EXIT
sleep 0.5
kill -0 "$MOCK_PID" 2>/dev/null || { echo "FAIL  mock bucket did not start (is port $MOCK_PORT free?)"; exit 1; }

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); BUCKET=http://127.0.0.1:$MOCK_PORT/tiles
else
  NET=(-p "$SERVER_PORT:$SERVER_PORT"); BUCKET=http://host.docker.internal:$MOCK_PORT/tiles
fi

docker run -d --name "$NAME" "${NET[@]}" \
  -e PORT="$SERVER_PORT" \
  -e PMTILES_BUCKET="$BUCKET" \
  -e PMTILES_PUBLIC_URL="$PUBLIC_URL" \
  "$IMAGE" >/dev/null

for _ in $(seq 1 30); do curl -s -o /dev/null "$BASE/" && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -D "$TMP/headers" -o "$TMP/body" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; head -c 300 "$TMP/body"; echo; fi
}
tile_matches() { # z/x/y: the served bytes equal the tile stored in the archive
  local want; want=$(python3 "$HERE/mock_bucket.py" --tile "$1")
  [ "$(sha256sum < "$TMP/body" | cut -d' ' -f1)" = "$want" ] && pass "tile $1 bytes match the archive" || bad "tile $1 bytes differ from the archive"
}

check "health" 204 "$BASE/"
check "TileJSON" 200 "$BASE/world.json"
grep -q "\"$PUBLIC_URL/world/{z}/{x}/{y}.png\"" "$TMP/body" && pass "TileJSON uses the public URL" || { bad "TileJSON tile URL"; cat "$TMP/body"; echo; }
check "metadata" 200 "$BASE/world/metadata"
check "tile 0/0/0" 200 "$BASE/world/0/0/0.png"
grep -qi '^content-type: image/png' "$TMP/headers" && pass "tile content-type image/png" || bad "tile content-type"
tile_matches 0/0/0
check "tile 1/1/0" 200 "$BASE/world/1/1/0.png"
tile_matches 1/1/0
check "tile 1/0/1" 200 "$BASE/world/1/0/1.png"
tile_matches 1/0/1
ETAG=$(grep -i '^etag:' "$TMP/headers" | cut -d' ' -f2- | tr -d '\r')
check "conditional request (If-None-Match)" 304 -H "If-None-Match: $ETAG" "$BASE/world/1/0/1.png"
check "zoom outside the archive" 404 "$BASE/world/5/0/0.png"
check "unknown archive" 404 "$BASE/nope/0/0/0.png"
check "CORS request" 200 -H "Origin: https://app.example.com" "$BASE/world/0/0/0.png"
grep -qi '^access-control-allow-origin: \*' "$TMP/headers" && pass "CORS header (*)" || bad "CORS header missing"
grep -q 'range=bytes=' "$TMP/bucket.log" && pass "archive read with HTTP Range requests ($(grep -c 'range=bytes=' "$TMP/bucket.log") requests)" || bad "no Range requests reached the bucket"

start=$(date +%s%N); docker stop -t 10 "$NAME" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
[ "$ms" -lt 5000 ] && pass "stops on SIGTERM (${ms} ms)" || bad "slow SIGTERM shutdown (${ms} ms)"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
