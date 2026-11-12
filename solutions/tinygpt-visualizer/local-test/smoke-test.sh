#!/usr/bin/env bash
# Smoke-test the built site in ./dist. Run `sh build.sh` first.
# Usage (from this example's folder): bash local-test/smoke-test.sh
# The model files are public and come from Hugging Face; set OFFLINE=1 to skip those two checks.
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
DIST="$HERE/../dist"
PORT=${PORT:-4173}
BASE=http://localhost:$PORT
BODY=$(mktemp)

[ -f "$DIST/index.html" ] || { echo "FAIL  dist/index.html missing: run 'sh build.sh' first"; exit 1; }

python3 "$HERE/serve.py" "$PORT" >/dev/null &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; rm -f "$BODY"; }
trap cleanup EXIT
for _ in $(seq 1 30); do curl -sf "$BASE/" >/dev/null && break; sleep 0.2; done

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, url
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$3")
  if [ "$got" = "$2" ]; then pass "$1 ($got)"; else flunk "$1 (got $got, want $2)"; fi
}

check "home page" 200 "$BASE/"
grep -q '<title>TinyGPT Visualizer</title>' "$BODY" && pass "home page title" || flunk "home page title"
grep -q 'googletagmanager' "$BODY" && flunk "analytics tag present" || pass "no analytics tag"

assets=$(grep -oE '/assets/[^"]+\.(js|css)' "$DIST/index.html" | sort -u)
n=0; bad=0
for a in $assets; do n=$((n+1)); [ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$a")" = 200 ] || bad=$((bad+1)); done
[ "$n" -gt 0 ] && [ "$bad" = 0 ] && pass "all $n page assets load (200)" || flunk "page assets ($bad of $n failed)"

worker=$(cd "$DIST" && ls assets/worker-*.js 2>/dev/null | head -1)
[ -n "$worker" ] && check "model worker bundle" 200 "$BASE/$worker" || flunk "model worker bundle missing"
check "guide page" 200 "$BASE/guide.html"
check "guide contents (docs/README.md)" 200 "$BASE/docs/README.md"

model_url=$(grep -ohE 'https://[^"`]+/web/bpe-small/' "$DIST"/assets/*.js | head -1)
[ -n "$model_url" ] && pass "in-browser backend with model URL baked in" || flunk "model URL not found in the bundle"

if [ "${OFFLINE:-0}" = 1 ]; then
  echo "SKIP  model files (OFFLINE=1)"
else
  if curl -sfL "${model_url}model.json" -o "$BODY" && python3 -c 'import json,sys; m=json.load(open(sys.argv[1])); assert m["checkpoints"] and m["config"]' "$BODY"; then
    pass "model.json reachable and valid"
  else flunk "model.json at ${model_url}"; fi
  [ "$(curl -sL -o /dev/null -w '%{http_code}' "${model_url}tokenizer.json")" = 200 ] && pass "tokenizer.json reachable (200)" || flunk "tokenizer.json"
fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
