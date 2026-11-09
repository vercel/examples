#!/usr/bin/env bash
# Smoke-test the static build in ./public by serving it the way a CDN would.
# Usage (from this example's folder, after the build has produced ./public):
#   bash local-test/smoke-test.sh
set -euo pipefail

PORT=${PORT:-4173}
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT="$HERE/../public"
BASE=http://127.0.0.1:$PORT
TMP=$(mktemp -d)

[ -f "$ROOT/index.html" ] || { echo "FAIL  public/index.html missing; run the build first"; exit 1; }

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/dev/null 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; rm -rf "$TMP"; }
trap cleanup EXIT
for _ in $(seq 1 30); do curl -sf "$BASE/" >/dev/null && break; sleep 0.2; done

fail=0
pass() { echo "PASS  $1"; }
bad()  { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, path, output file
  local got; got=$(curl -s -o "$4" -w '%{http_code}' "$BASE$3")
  if [ "$got" = "$2" ]; then pass "$1 ($got)"; else bad "$1 (got $got, want $2)"; fi
}

check "index.html" 200 / "$TMP/index.html"
grep -q 'id="benchup-canvas"' "$TMP/index.html" && pass "editor canvas in page" || bad "editor canvas missing from page"

JS=$(grep -oE 'benchup-app-[0-9a-f]+\.js' "$TMP/index.html" | head -1 || true)
WASM=$(grep -oE 'benchup-app-[0-9a-f]+_bg\.wasm' "$TMP/index.html" | head -1 || true)
[ -n "$JS" ] && pass "page references hashed JS loader" || bad "no hashed JS loader referenced"
[ -n "$WASM" ] && pass "page references hashed WebAssembly module" || bad "no hashed WebAssembly module referenced"

check "JS loader" 200 "/$JS" "$TMP/app.js"
grep -q "$WASM" "$TMP/app.js" "$TMP/index.html" && pass "loader wired to module" || bad "loader does not reference module"

check "WebAssembly module" 200 "/$WASM" "$TMP/app.wasm"
[ "$(head -c 4 "$TMP/app.wasm" | od -An -tx1 | tr -d ' \n')" = "0061736d" ] && pass "module has WebAssembly magic bytes" || bad "module is not WebAssembly"
SIZE=$(wc -c < "$TMP/app.wasm"); echo "INFO  module size: $((SIZE / 1024 / 1024)) MB"

check "English message catalog" 200 /assets/i18n/en.json "$TMP/en.json"
python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$TMP/en.json" && pass "catalog is valid JSON" || bad "catalog is not valid JSON"
check "logo" 200 /assets/branding/logo.svg "$TMP/logo.svg"
check "web manifest" 200 /assets/branding/site.webmanifest "$TMP/manifest"
check "missing path" 404 /does-not-exist "$TMP/missing"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
