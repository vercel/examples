#!/usr/bin/env bash
# Smoke-test the Proton Calendar RO REST API image against a local mock HTTPS calendar server.
# No real Proton Calendar share link or API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t protoncal-on-vercel .`):
#   bash ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-protoncal-on-vercel}
API_PORT=${API_PORT:-8080}
DEFAULT_PORT_HOST=${DEFAULT_PORT_HOST:-8081}
KEY=test-api-key-0123456789
CAL_URL='https://calendar.proton.me/api/calendar/v1/url/mock-calendar/calendar.ics?CacheKey=mock&PassphraseKey=mock'
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://127.0.0.1:$API_PORT

TMPDIR_TEST=$(mktemp -d)
NET_NAME=protoncal-smoke-net-$$
MOCK_NAME=protoncal-mock-$$
API_NAME=protoncal-api-$$
DEFAULT_NAME=protoncal-default-port-$$

cleanup() {
  docker rm -f "$API_NAME" "$DEFAULT_NAME" "$MOCK_NAME" >/dev/null 2>&1 || true
  docker network rm "$NET_NAME" >/dev/null 2>&1 || true
  rm -rf "$TMPDIR_TEST"
}
trap cleanup EXIT

# Generate an ephemeral self-signed certificate for calendar.proton.me (local test only).
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$TMPDIR_TEST/mock.key" \
  -out "$TMPDIR_TEST/mock.crt" \
  -days 1 \
  -subj "/CN=calendar.proton.me" \
  -addext "subjectAltName=DNS:calendar.proton.me" >/dev/null 2>&1
chmod 644 "$TMPDIR_TEST/mock.crt"

docker network create "$NET_NAME" >/dev/null

# Run the stdlib-only mock HTTPS server on the isolated bridge network as calendar.proton.me:443.
docker run -d --name "$MOCK_NAME" \
  --user 0 \
  --network "$NET_NAME" \
  --network-alias calendar.proton.me \
  -v "$HERE/mock_proton.py:/mock_proton.py:ro" \
  -v "$TMPDIR_TEST/mock.crt:/certs/mock.crt:ro" \
  -v "$TMPDIR_TEST/mock.key:/certs/mock.key:ro" \
  --entrypoint python \
  "$IMAGE" /mock_proton.py 443 /certs/mock.crt /certs/mock.key >/dev/null

# Start the API container with a custom PORT and the ephemeral CA trusted via SSL_CERT_FILE.
docker run -d --name "$API_NAME" \
  --network "$NET_NAME" \
  -p "127.0.0.1:$API_PORT:$API_PORT" \
  -v "$TMPDIR_TEST/mock.crt:/certs/mock.crt:ro" \
  -e PORT="$API_PORT" \
  -e TIMEZONE=Europe/Rome \
  -e X_API_KEY="$KEY" \
  -e PROTON_CALENDAR_URL="$CAL_URL" \
  -e SSL_CERT_FILE=/certs/mock.crt \
  "$IMAGE" >/dev/null

for _ in $(seq 1 30); do curl -sf "$BASE/health" >/dev/null && break; sleep 0.5; done

fail=0
BODY="$TMPDIR_TEST/body"
HDR="$TMPDIR_TEST/headers"
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got
  got=$(curl -s -D "$HDR" -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then
    echo "PASS  $name ($got)"
  else
    echo "FAIL  $name (got $got, want $want)"
    cat "$BODY"; echo
    fail=1
  fi
}

check "health"                    200 "$BASE/health"
check "rejects missing API key"   401 "$BASE/events/11-Dec-2026"
check "rejects invalid API key"   401 -H "X-API-KEY: wrong-key" "$BASE/events/11-Dec-2026"
check "fetches day events"        200 -H "X-API-KEY: $KEY" "$BASE/events/11-Dec-2026"

if python3 - "$BODY" <<'PY'
import json, sys
events = json.load(open(sys.argv[1]))
assert len(events) == 3, f"expected 3 events, got {events}"
assert events[0] == {"calendar": "Personal", "name": "Birthday", "time_start": "", "time_end": "", "timezone": "Europe/Rome"}, events[0]
assert events[1] == {"calendar": "Personal", "name": "Dentist", "time_start": "09:00", "time_end": "09:45", "timezone": "Europe/Rome"}, events[1]
assert events[2] == {"calendar": "Personal", "name": "Team Standup", "time_start": "10:30", "time_end": "11:00", "timezone": "Europe/Rome"}, events[2]
PY
then
  echo "PASS  events order, all-day, timed, and recurring expansion"
else
  echo "FAIL  unexpected events payload"; cat "$BODY"; echo; fail=1
fi

if grep -qi '^cache-control:.*no-store' "$HDR"; then
  echo "PASS  Cache-Control: no-store header"
else
  echo "FAIL  missing Cache-Control: no-store header"; fail=1
fi

check "empty day returns []"      200 -H "X-API-KEY: $KEY" "$BASE/events/12-Dec-2026"
if [ "$(cat "$BODY")" = "[]" ]; then
  echo "PASS  empty day payload is []"
else
  echo "FAIL  expected [], got $(cat "$BODY")"; fail=1
fi

check "invalid date rejected"     422 -H "X-API-KEY: $KEY" "$BASE/events/not-a-date"
check "Swagger UI (/docs)"        200 "$BASE/docs"
check "OpenAPI schema"            200 "$BASE/openapi.json"

# Confirm the upstream mock received the calendar fetch without the client X-API-KEY header.
if docker logs "$MOCK_NAME" 2>&1 | grep -q "UPSTREAM GET /api/calendar/v1/url/mock-calendar/calendar.ics x-api-key=absent"; then
  echo "PASS  upstream never receives client X-API-KEY"
else
  echo "FAIL  expected upstream log without X-API-KEY"; docker logs "$MOCK_NAME" 2>&1; fail=1
fi

# Verify default PORT=80 behavior (no PORT env var passed) as the non-root user.
docker run -d --name "$DEFAULT_NAME" \
  -p "127.0.0.1:$DEFAULT_PORT_HOST:80" \
  -e TIMEZONE=UTC \
  -e X_API_KEY="$KEY" \
  -e PROTON_CALENDAR_URL="$CAL_URL" \
  "$IMAGE" >/dev/null
for _ in $(seq 1 30); do curl -sf "http://127.0.0.1:$DEFAULT_PORT_HOST/health" >/dev/null && break; sleep 0.5; done
check "default PORT=80 health"    200 "http://127.0.0.1:$DEFAULT_PORT_HOST/health"

# Verify clean SIGTERM shutdown (important for Vercel Function scale-down).
docker stop -t 10 "$API_NAME" >/dev/null
EXIT_CODE=$(docker inspect -f '{{.State.ExitCode}}' "$API_NAME")
if [ "$EXIT_CODE" = "0" ]; then
  echo "PASS  clean SIGTERM shutdown (exit 0)"
else
  echo "FAIL  SIGTERM shutdown exited with $EXIT_CODE"; fail=1
fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
