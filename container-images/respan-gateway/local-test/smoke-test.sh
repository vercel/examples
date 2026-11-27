#!/usr/bin/env bash
# Smoke-test the gateway image against a fake OpenAI upstream. No real API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t respan-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-respan-on-vercel}
GATEWAY_PORT=${GATEWAY_PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
KEY=test-client-key
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$GATEWAY_PORT

python3 "$HERE/mock_openai.py" "$MOCK_PORT" &
MOCK_PID=$!
NAME=respan-smoke-$$
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); UPSTREAM=http://127.0.0.1:$MOCK_PORT/v1
else
  NET=(-p "$GATEWAY_PORT:$GATEWAY_PORT"); UPSTREAM=http://host.docker.internal:$MOCK_PORT/v1
fi

docker run -d --name "$NAME" "${NET[@]}" \
  -e PORT="$GATEWAY_PORT" \
  -e RESPAN_CLIENT_KEYS="$KEY" \
  -e OPENAI_API_KEY=sk-mock-upstream \
  -e RESPAN_OPENAI_BASE_URL="$UPSTREAM" \
  "$IMAGE" >/dev/null

for _ in $(seq 1 30); do curl -sf "$BASE/healthz" >/dev/null && break; sleep 0.5; done

fail=0
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o /tmp/respan-smoke-body -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then echo "PASS  $name ($got)"; else echo "FAIL  $name (got $got, want $want)"; cat /tmp/respan-smoke-body; echo; fail=1; fi
}
JSON=(-H 'content-type: application/json')

check "health"                      200 "$BASE/healthz"
check "rejects missing client key"  401 "$BASE/v1/models"
check "lists models"                200 -H "Authorization: Bearer $KEY" "$BASE/v1/models"
check "OpenAI chat completion"      200 -H "Authorization: Bearer $KEY" "${JSON[@]}" \
  -d '{"model":"gpt-mock","messages":[{"role":"user","content":"hi"}]}' "$BASE/v1/chat/completions"
check "OpenAI streaming"            200 -H "Authorization: Bearer $KEY" "${JSON[@]}" \
  -d '{"model":"gpt-mock","stream":true,"messages":[{"role":"user","content":"hi"}]}' "$BASE/v1/chat/completions"
grep -q '\[DONE\]' /tmp/respan-smoke-body && echo "PASS  stream ends with [DONE]" || { echo "FAIL  stream did not end with [DONE]"; fail=1; }
check "Anthropic Messages -> OpenAI" 200 -H "x-api-key: $KEY" -H 'anthropic-version: 2023-06-01' "${JSON[@]}" \
  -d '{"model":"gpt-mock","max_tokens":64,"messages":[{"role":"user","content":"hi"}]}' "$BASE/v1/messages"
grep -q '"type":"message"' /tmp/respan-smoke-body && echo "PASS  Anthropic-shaped response" || { echo "FAIL  response is not Anthropic-shaped"; fail=1; }
check "web UI"                      200 -L -H "Authorization: Bearer $KEY" "$BASE/ui/"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
