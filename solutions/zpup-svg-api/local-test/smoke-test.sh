#!/usr/bin/env bash
# Smoke-test the Zpup SVG API locally. No network access or API keys are needed.
# Usage (from this example's folder, after `pnpm install`):
#   bash local-test/smoke-test.sh
set -euo pipefail

PORT=${PORT:-3999}
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(dirname "$HERE")
BASE=http://localhost:$PORT
TMP=$(mktemp -d)

cd "$ROOT"
PORT=$PORT APP_ENTRY=${APP_ENTRY:-} node "$HERE/serve.ts" >"$TMP/server.log" 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; rm -rf "$TMP"; }
trap cleanup EXIT
for _ in $(seq 1 30); do curl -sf "$BASE/health" >/dev/null && break; sleep 0.2; done

SCENE='{"width":120,"height":120,"rotate":{"x":-20,"y":30},"children":[{"type":"dot","stroke":40,"color":"#e62"},{"type":"ellipse","diameter":70,"stroke":5,"color":"#636","rotate":{"x":90}}]}'
BAD='{"width":120,"height":120,"children":[{"type":"box","colour":"#e62"}]}'
ENC=$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$SCENE")

fail=0
pass() { echo "PASS  $1"; }
nope() { echo "FAIL  $1"; [ -f "$TMP/body" ] && head -c 400 "$TMP/body" && echo; fail=1; }
req() { # name, expected status, curl args... (body in $TMP/body, headers in $TMP/headers)
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$TMP/body" -D "$TMP/headers" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else nope "$name (got $got, want $want)"; fi
}
has() { grep -qi -- "$2" "$3" && pass "$1" || nope "$1"; }
JSON=(-H 'content-type: application/json')

req "health" 200 "$BASE/health"
has "health reports zpup 0.3.1" '"zpup":"0.3.1"' "$TMP/body"

req "POST /render" 200 "${JSON[@]}" -d "$SCENE" "$BASE/render"
has "returns image/svg+xml" '^content-type: image/svg+xml' "$TMP/headers"
cp "$TMP/body" "$TMP/api.svg"
node --input-type=module -e "
import { renderSvg } from '@zpup/core'; import { readFileSync } from 'node:fs';
process.exit(renderSvg(JSON.parse(process.argv[1])) === readFileSync('$TMP/api.svg', 'utf8') ? 0 : 1)
" "$SCENE" && pass "SVG matches @zpup/core renderSvg byte for byte" || nope "SVG differs from @zpup/core renderSvg"

req "GET /render.svg (img-friendly URL)" 200 "$BASE/render.svg?scene=$ENC"
has "GET is CDN-cacheable (s-maxage)" '^cache-control:.*s-maxage=' "$TMP/headers"
cmp -s "$TMP/body" "$TMP/api.svg" && pass "GET and POST return the same SVG" || nope "GET and POST differ"

req "view override" 200 "$BASE/render.svg?scene=$ENC&view=-60,30"
cmp -s "$TMP/body" "$TMP/api.svg" && nope "view=-60,30 did not change the picture" || pass "view=-60,30 draws a different angle"

req "POST /spin" 200 "${JSON[@]}" -d "$SCENE" "$BASE/spin?duration=4&keyframes=24"
has "spin SVG is animated" 'animate\|@keyframes' "$TMP/body"

req "POST /check valid scene" 200 "${JSON[@]}" -d "$SCENE" "$BASE/check"
has "check says valid" '"valid":true' "$TMP/body"

req "invalid scene is rejected" 400 "${JSON[@]}" -d "$BAD" "$BASE/render"
has "error names the bad option and suggests color" 'Did you mean \\"color\\"' "$TMP/body"
has "errors are not cached" '^cache-control: no-store' "$TMP/headers"

req "not JSON is rejected" 400 "${JSON[@]}" -d 'not json' "$BASE/render"
req "too many keyframes is rejected" 400 "${JSON[@]}" -d "$SCENE" "$BASE/spin?keyframes=500"
head -c 70000 /dev/zero | tr '\0' ' ' >"$TMP/big"
req "body over 64 KB is rejected" 413 "${JSON[@]}" --data-binary @"$TMP/big" "$BASE/render"
req "unknown path" 404 "$BASE/nope"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; cat "$TMP/server.log"; exit 1; }
