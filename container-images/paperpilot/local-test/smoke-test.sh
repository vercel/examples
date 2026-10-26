#!/usr/bin/env bash
# Smoke-test the PaperPilot gateway image. No external services or API keys are needed.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t paperpilot-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-paperpilot-on-vercel}
PORT_UNDER_TEST=${PORT_UNDER_TEST:-8080}
HERE=$(cd "$(dirname "$0")" && pwd)
WORK=$(mktemp -d)
NAME=paperpilot-smoke-$$
cleanup() { docker rm -f "$NAME" "$NAME-default" >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT

python3 "$HERE/make_pdf.py" "Hello from PaperPilot on Vercel" > "$WORK/sample.pdf"
python3 "$HERE/make_pdf.py" "Contact jane.doe@example.com or 555-123-4567" > "$WORK/pii.pdf"

# Linux: share the host network. macOS/Windows: publish the port instead.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); DEFAULT_URL=http://localhost:80
else
  NET=(-p "$PORT_UNDER_TEST:$PORT_UNDER_TEST"); DEFAULT_URL=http://localhost:8081
fi
BASE=http://localhost:$PORT_UNDER_TEST

wait_for() { for _ in $(seq 1 40); do curl -sf "$1/health" >/dev/null && return 0; sleep 0.25; done; return 1; }

fail=0
pass() { echo "PASS  $1"; }
bad()  { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, expected body substring, curl args...
  local name=$1 want=$2 needle=$3; shift 3
  local got; got=$(curl -s -o "$WORK/body" -w '%{http_code}' "$@" || true)
  if [ "$got" = "$want" ] && grep -qF -- "$needle" "$WORK/body"; then pass "$name ($got)"
  else bad "$name (got $got, want $want with '$needle')"; head -c 400 "$WORK/body"; echo; fi
}

# 1. Start the image the way Vercel does: PORT set by the platform.
docker run -d --name "$NAME" "${NET[@]}" -e PORT="$PORT_UNDER_TEST" "$IMAGE" >/dev/null
wait_for "$BASE" || { echo "FAIL  gateway did not start"; docker logs "$NAME"; exit 1; }

JSON=(-H 'content-type: application/json')
check "health"                       200 '"status":"ok"'            "$BASE/health"
check "lists tools"                  200 '"success":true'           "$BASE/api/v1/tools"
check "PDF metadata (upload)"        200 '"success":true'           -F "file=@$WORK/sample.pdf" "$BASE/api/v1/pdf/info"
check "PII scan finds email (upload)" 200 'j***e@example.com'        -F "file=@$WORK/pii.pdf" "$BASE/api/v1/pdf/pii-scan"
check "extract text (upload)"        200 'Text extracted successfully' -F "file=@$WORK/sample.pdf" -F output=/tmp/smoke.txt "$BASE/api/v1/pdf/extract-text"
docker exec "$NAME" cat /tmp/smoke.txt 2>/dev/null | grep -q 'Hello from PaperPilot on Vercel' \
  && pass "extracted text matches the PDF" || bad "extracted text does not match the PDF"
check "MCP initialize"               200 '"protocolVersion"'        "${JSON[@]}" -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' "$BASE/mcp/messages"
check "MCP tools/list"               200 'pdf_merge'                "${JSON[@]}" -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' "$BASE/mcp/messages"

# 2. MCP over SSE: the stream must open and announce its message endpoint.
curl -s -N --max-time 2 -H 'accept: text/event-stream' "$BASE/mcp/sse" > "$WORK/sse" || true
grep -q '^event: endpoint' "$WORK/sse" && pass "MCP SSE stream announces endpoint" || { bad "MCP SSE stream"; cat "$WORK/sse"; }

# 3. Clean shutdown: Vercel sends SIGTERM on scale-down. The container must exit well within the 30s grace period.
start=$(date +%s); docker stop -t 20 "$NAME" >/dev/null; secs=$(( $(date +%s) - start ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
[ "$secs" -lt 5 ] && pass "SIGTERM shutdown in ${secs}s (exit $code)" || bad "SIGTERM shutdown took ${secs}s (exit $code)"

# 4. Default port: without PORT, the image listens on 80, Vercel's default.
if [ "$(uname)" = Linux ]; then docker run -d --name "$NAME-default" --network host "$IMAGE" >/dev/null
else docker run -d --name "$NAME-default" -p 8081:80 "$IMAGE" >/dev/null; fi
wait_for "$DEFAULT_URL" && pass "default PORT 80" || bad "default PORT 80"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
