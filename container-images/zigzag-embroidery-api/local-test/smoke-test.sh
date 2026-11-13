#!/usr/bin/env bash
# Smoke-test the image locally: health, auth, SVG -> PES/DST/PNG, info, input checks,
# the default port (80) and a clean shutdown on SIGTERM. No external services are needed.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t zigzag-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-zigzag-on-vercel}
PORT=${PORT:-8080}
DEFAULT_PORT_HOST=${DEFAULT_PORT_HOST:-18080}
KEY=test-api-key
HERE=$(cd "$(dirname "$0")" && pwd)
SVG="$HERE/design.svg"
BASE=http://localhost:$PORT
NAME=zigzag-smoke-$$
NAME80=zigzag-smoke80-$$
BODY=$(mktemp)
cleanup() { docker rm -f "$NAME" "$NAME80" >/dev/null 2>&1 || true; rm -f "$BODY"; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: publish the port.
if [ "$(uname)" = Linux ]; then NET=(--network host); else NET=(-p "$PORT:$PORT"); fi

docker run -d --name "$NAME" "${NET[@]}" -e PORT="$PORT" -e API_KEY="$KEY" "$IMAGE" >/dev/null
for _ in $(seq 1 30); do curl -sf "$BASE/healthz" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else flunk "$name (got $got, want $want)"; head -c 400 "$BODY"; echo; fi
}
magic() { # name, expected leading bytes (printf format)
  if [ "$(head -c "$(printf "$2" | wc -c)" "$BODY")" = "$(printf "$2")" ]; then pass "$1"; else flunk "$1"; fi
}
AUTH=(-H "Authorization: Bearer $KEY")
SVGBODY=(-H 'content-type: image/svg+xml' --data-binary "@$SVG")

check "health"                    200 "$BASE/healthz"
check "rejects missing API key"   401 -X POST "${SVGBODY[@]}" "$BASE/api/convert?format=pes"
check "lists formats"             200 "${AUTH[@]}" "$BASE/api/formats"
check "SVG -> PES"                200 "${AUTH[@]}" "${SVGBODY[@]}" "$BASE/api/convert?format=pes"
magic "PES file header (#PES)"    '#PES'
check "SVG -> DST"                200 "${AUTH[@]}" "${SVGBODY[@]}" "$BASE/api/convert?format=dst"
magic "DST file header (LA:)"     'LA:'
check "SVG -> PNG preview"        200 "${AUTH[@]}" "${SVGBODY[@]}" "$BASE/api/convert?format=png"
magic "PNG signature"             '\211PNG'
check "design info and checks"    200 "${AUTH[@]}" "${SVGBODY[@]}" "$BASE/api/info"
grep -q 'stitches' "$BODY" && pass "info reports stitch count" || flunk "info has no stitch count"
check "rejects unknown format"    400 "${AUTH[@]}" "${SVGBODY[@]}" "$BASE/api/convert?format=xyz"
check "rejects empty body"        400 "${AUTH[@]}" -X POST "$BASE/api/convert?format=pes"

# Default port: no PORT set, so the image's PORT=80 applies.
docker run -d --name "$NAME80" -p "$DEFAULT_PORT_HOST:80" "$IMAGE" >/dev/null
for _ in $(seq 1 30); do curl -sf "http://localhost:$DEFAULT_PORT_HOST/healthz" >/dev/null && break; sleep 0.5; done
check "default PORT 80"           200 "http://localhost:$DEFAULT_PORT_HOST/healthz"

# Clean shutdown: SIGTERM should stop the container well inside Vercel's 30 s grace period.
start=$(date +%s)
docker kill --signal TERM "$NAME" >/dev/null
code=$(docker wait "$NAME")
took=$(( $(date +%s) - start ))
if [ "$code" = 0 ] && [ "$took" -lt 10 ]; then pass "SIGTERM clean exit (code $code, ${took}s)"; else flunk "SIGTERM (code $code, ${took}s)"; fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
