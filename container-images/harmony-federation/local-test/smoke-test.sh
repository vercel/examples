#!/usr/bin/env bash
# Runs the already-built image against the local Supabase mock.
#   docker build -f Dockerfile.vercel -t harmony-federation:local .
#   bash local-test/smoke-test.sh
set -u
IMAGE="${IMAGE:-harmony-federation:local}"
HOST_PORT="${HOST_PORT:-8080}"
MOCK_PORT="${MOCK_PORT:-54321}"
DOMAIN="harmony.test"
SERVICE_KEY="test-service-role-key"
NAME="harmony-federation-smoke"
DIR="$(cd "$(dirname "$0")" && pwd)"
export MOCK_LOG="$(mktemp)"
FAILED=0

pass() { echo "PASS  $1"; }
fail() { echo "FAIL  $1"; FAILED=1; }
check() { if eval "$2"; then pass "$1"; else fail "$1"; fi; }

MOCK_PORT=$MOCK_PORT MOCK_SERVICE_KEY=$SERVICE_KEY python3 "$DIR/mock_supabase.py" &
MOCK_PID=$!
cleanup() { docker rm -f "$NAME" >/dev/null 2>&1; kill "$MOCK_PID" 2>/dev/null; rm -f "$MOCK_LOG"; }
trap cleanup EXIT

# No PORT is passed: the image must listen on Vercel's default port 80.
docker run -d --name "$NAME" -p "$HOST_PORT:80" \
  --add-host=host.docker.internal:host-gateway \
  -e SUPABASE_URL="http://host.docker.internal:$MOCK_PORT" \
  -e SUPABASE_PUBLISHABLE_KEY="test-publishable-key" \
  -e SUPABASE_SECRET_KEY="$SERVICE_KEY" \
  -e INSTANCE_DOMAIN="$DOMAIN" \
  "$IMAGE" >/dev/null

BASE="http://127.0.0.1:$HOST_PORT"
for _ in $(seq 1 40); do curl -fs "$BASE/health" >/dev/null 2>&1 && break; sleep 0.5; done

code=$(curl -s -o /tmp/h.json -w '%{http_code}' "$BASE/health")
check "health on default port 80 ($code)" '[ "$code" = 200 ]'
check "health reports database connected" 'grep -q "\"database\":\"connected\"" /tmp/h.json'
check "health reports instance domain" 'grep -q "\"domain\":\"$DOMAIN\"" /tmp/h.json'

code=$(curl -s -o /tmp/w.json -w '%{http_code}' "$BASE/.well-known/webfinger?resource=acct:alice@$DOMAIN")
check "webfinger finds local user ($code)" '[ "$code" = 200 ]'
check "webfinger self link points at actor" 'grep -q "https://$DOMAIN/users/alice" /tmp/w.json'

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/.well-known/webfinger?resource=acct:nobody@$DOMAIN")
check "webfinger unknown user ($code)" '[ "$code" = 404 ]'

code=$(curl -s -o /tmp/n.json -w '%{http_code}' "$BASE/.well-known/nodeinfo")
check "nodeinfo discovery ($code)" '[ "$code" = 200 ] && grep -q "/nodeinfo/2.1" /tmp/n.json'

code=$(curl -s -o /tmp/n21.json -w '%{http_code}' "$BASE/nodeinfo/2.1")
check "nodeinfo 2.1 ($code)" '[ "$code" = 200 ]'
check "nodeinfo usage comes from the database" 'grep -q "\"total\":3" /tmp/n21.json && grep -q "\"localPosts\":42" /tmp/n21.json'

code=$(curl -s -o /tmp/hm.xml -w '%{http_code}' "$BASE/.well-known/host-meta")
check "host-meta ($code)" '[ "$code" = 200 ] && grep -q "webfinger" /tmp/hm.xml'

check "Marketplace SUPABASE_SECRET_KEY used as service role key" \
  '[ -s "$MOCK_LOG" ] && ! grep -q "\"apikey_ok\": false" "$MOCK_LOG"'

start=$(date +%s%N)
docker stop -t 10 "$NAME" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
status=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
check "SIGTERM clean shutdown (exit $status, ${ms} ms)" '[ "$status" = 0 ] && [ "$ms" -lt 10000 ]'

if [ "$FAILED" = 0 ]; then echo "All checks passed."; else echo "Some checks failed."; exit 1; fi
