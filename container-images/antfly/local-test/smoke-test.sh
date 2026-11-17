#!/usr/bin/env bash
# Smoke-test the Antfly image: auth, tables, full-text search, and a streamed RAG answer
# generated through a fake OpenAI-compatible upstream. No real API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t antfly-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-antfly-on-vercel}
ANTFLY_PORT=${ANTFLY_PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
PASSWORD=local-test-password
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$ANTFLY_PORT
BODY=$(mktemp)

python3 "$HERE/mock_ai_gateway.py" "$MOCK_PORT" &
MOCK_PID=$!
NAME=antfly-smoke-$$
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; kill "$MOCK_PID" 2>/dev/null || true; rm -f "$BODY"; }
trap cleanup EXIT

# Linux: share the host network. macOS/Windows: reach the host through host.docker.internal.
if [ "$(uname)" = Linux ]; then
  NET=(--network host); UPSTREAM=http://127.0.0.1:$MOCK_PORT/v1
else
  NET=(-p "$ANTFLY_PORT:$ANTFLY_PORT"); UPSTREAM=http://host.docker.internal:$MOCK_PORT/v1
fi

docker run -d --name "$NAME" "${NET[@]}" \
  -e PORT="$ANTFLY_PORT" \
  -e ANTFLY_BOOTSTRAP_ADMIN_PASSWORD="$PASSWORD" \
  -e AI_GATEWAY_API_KEY=sk-mock-gateway \
  "$IMAGE" >/dev/null

for _ in $(seq 1 60); do curl -sf "$BASE/readyz" >/dev/null && break; sleep 0.5; done

fail=0
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then echo "PASS  $name ($got)"; else echo "FAIL  $name (got $got, want $want)"; cat "$BODY"; echo; fail=1; fi
}
expect() { # name, pattern in the last response body
  if grep -q "$2" "$BODY"; then echo "PASS  $1"; else echo "FAIL  $1"; cat "$BODY"; echo; fail=1; fi
}
AUTH=(-u "admin:$PASSWORD")
JSON=(-H 'content-type: application/json')

check  "health"                          200 "$BASE/healthz"
check  "ready"                           200 "$BASE/readyz"
check  "rejects missing credentials"     401 "$BASE/db/v1/status"
check  "rejects wrong password"          401 -u admin:wrong-password-123 "$BASE/db/v1/status"
check  "status as admin"                 200 "${AUTH[@]}" "$BASE/db/v1/status"
check  "create table"                    200 "${AUTH[@]}" "${JSON[@]}" -d '{}' "$BASE/db/v1/tables/docs"
check  "insert documents"                201 "${AUTH[@]}" "${JSON[@]}" -d '{
  "inserts": {
    "functions": {"title": "Vercel Functions", "body": "Antfly runs as a container image on Vercel Functions with Fluid compute."},
    "gateway":   {"title": "AI Gateway",       "body": "Antfly sends generation requests to an OpenAI-compatible endpoint such as AI Gateway."}
  },
  "sync_level": "full_text"}' "$BASE/db/v1/tables/docs/batch"
check  "full-text search"                200 "${AUTH[@]}" "${JSON[@]}" -d '{
  "table": "docs", "full_text_search": {"query": "body:container"}, "fields": ["title"], "limit": 5}' "$BASE/db/v1/query"
expect "search finds the right document" '"_id":"functions"'
check  "RAG answer, streamed (SSE)"      200 -N "${AUTH[@]}" "${JSON[@]}" -H 'accept: text/event-stream' -d '{
  "query": "How does Antfly call a model?",
  "queries": [{"table": "docs", "full_text_search": {"query": "body:gateway"}, "fields": ["title", "body"], "limit": 3}],
  "generator": {"provider": "openai", "model": "openai/gpt-mock", "url": "'"$UPSTREAM"'", "api_key": "${secret:ai_gateway.api_key}"},
  "stream": true, "steps": {"generation": {"enabled": true}}}' "$BASE/db/v1/agents/retrieval"
expect "answer comes from the upstream"  'Antfly answered from the retrieved documents'
expect "stream ends with event: done"    'event: done'
check  "Antfarm dashboard"               200 "$BASE/"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
