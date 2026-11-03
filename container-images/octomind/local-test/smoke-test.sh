#!/usr/bin/env bash
# Smoke-test the Octomind image against a fake AI Gateway. No real API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t octomind-on-vercel .`):
#   bash local-test/smoke-test.sh
set -uo pipefail

IMAGE=${IMAGE:-octomind-on-vercel}
PORT=${PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
TOKEN=test-server-token
GATEWAY_KEY=test-gateway-key
MODEL=anthropic/claude-sonnet-5
HERE=$(cd "$(dirname "$0")" && pwd)
URL=ws://127.0.0.1:$PORT/
NAME=octomind-smoke-$$
TMP=$(mktemp -d)

python3 "$HERE/mock_llm.py" "$MOCK_PORT" >"$TMP/upstream.log" 2>&1 &
MOCK_PID=$!
cleanup() { docker rm -f "$NAME" "$NAME-noauth" "$NAME-port80" >/dev/null 2>&1; kill "$MOCK_PID" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); UPSTREAM=http://127.0.0.1:$MOCK_PORT/v1/chat/completions
else
  NET=(-p "$PORT:$PORT"); UPSTREAM=http://host.docker.internal:$MOCK_PORT/v1/chat/completions
fi

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; fail=1; }
wait_for_start() { # container name
  for _ in $(seq 1 60); do docker logs "$1" 2>&1 | grep -q 'WebSocket server started' && return 0; sleep 0.5; done; return 1
}

docker run -d --name "$NAME" "${NET[@]}" \
  -e PORT="$PORT" \
  -e OCTOMIND_SERVER_TOKEN="$TOKEN" \
  -e AI_GATEWAY_API_KEY="$GATEWAY_KEY" \
  -e LOCAL_API_URL="$UPSTREAM" \
  "$IMAGE" >/dev/null

wait_for_start "$NAME" && pass "server listening on \$PORT ($PORT)" || { flunk "server did not start"; docker logs "$NAME"; exit 1; }

grep -q '"handshake": 401' <<<"$(python3 "$HERE/ws_client.py" "$URL")" \
  && pass "rejects missing token (401)" || flunk "missing token was not rejected"
grep -q '"handshake": 401' <<<"$(python3 "$HERE/ws_client.py" "$URL" wrong-token)" \
  && pass "rejects wrong token (401)" || flunk "wrong token was not rejected"

python3 "$HERE/ws_client.py" "$URL" "$TOKEN" \
  '{"type":"session","request_id":"s1","session_id":"smoke"}' \
  '{"type":"message","request_id":"m1","session_id":"smoke","content":"Say hello"}' >"$TMP/frames.jsonl"
grep -q '"handshake": 101' "$TMP/frames.jsonl" && grep -q 'Connected to Octomind WebSocket server' "$TMP/frames.jsonl" \
  && pass "accepts token, sends welcome frame" || flunk "no welcome frame"
grep -q 'Session created: smoke' "$TMP/frames.jsonl" \
  && pass "creates a session" || flunk "session was not created"
grep -q '"type": "assistant", "content": "Hello from the mock model"' "$TMP/frames.jsonl" \
  && pass "streams the agent reply over the WebSocket" || flunk "no assistant reply"
grep -q '"type": "cost"' "$TMP/frames.jsonl" \
  && pass "ends the turn with a cost frame" || flunk "turn did not finish"
grep -q "auth=Bearer $GATEWAY_KEY model=$MODEL stream=True" "$TMP/upstream.log" \
  && pass "model calls use the AI Gateway key and model id" || { flunk "upstream did not see the expected key and model"; cat "$TMP/upstream.log"; }
grep -q "$TOKEN" "$TMP/upstream.log" && flunk "server token leaked upstream" || pass "server token never sent upstream"

start=$(date +%s%N)
docker stop -t 10 "$NAME" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
[ "$ms" -lt 5000 ] && pass "SIGTERM stops the container (exit $code, ${ms} ms)" || flunk "SIGTERM took ${ms} ms (exit $code)"

docker run -d --name "$NAME-noauth" -e AI_GATEWAY_API_KEY="$GATEWAY_KEY" "$IMAGE" >/dev/null
sleep 2
[ "$(docker inspect -f '{{.State.Running}}' "$NAME-noauth")" = false ] && docker logs "$NAME-noauth" 2>&1 | grep -q OCTOMIND_SERVER_TOKEN \
  && pass "refuses to start without OCTOMIND_SERVER_TOKEN" || flunk "started without OCTOMIND_SERVER_TOKEN"

docker run -d --name "$NAME-port80" -p 18080:80 -e OCTOMIND_SERVER_TOKEN="$TOKEN" -e AI_GATEWAY_API_KEY="$GATEWAY_KEY" "$IMAGE" >/dev/null
wait_for_start "$NAME-port80" && docker logs "$NAME-port80" 2>&1 | grep -q 'ws://0.0.0.0:80' \
  && grep -q '"handshake": 101' <<<"$(python3 "$HERE/ws_client.py" ws://127.0.0.1:18080/ "$TOKEN")" \
  && pass "default PORT=80 as non-root user" || flunk "default port 80 did not work"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
