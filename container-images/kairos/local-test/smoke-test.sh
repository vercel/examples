#!/usr/bin/env bash
# Smoke-test the Kairos image against a real Postgres and a fake Grayson API. No real keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t kairos-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-kairos-on-vercel}
HOST_PORT=${HOST_PORT:-8787}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$HOST_PORT
RUN=kairos-smoke-$$
TMP=$(mktemp -d); chmod 755 "$TMP"  # the app runs as the non-root user node
cleanup() {
  docker rm -f "$RUN-app" "$RUN-db" "$RUN-grayson" >/dev/null 2>&1 || true
  docker network rm "$RUN" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

# The app calls https://api.finic.ai. Inside a private Docker network that name points at the mock,
# whose self-signed certificate the app trusts through NODE_EXTRA_CA_CERTS (test only).
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj "/CN=api.finic.ai" \
  -addext "subjectAltName=DNS:api.finic.ai" -addext "basicConstraints=critical,CA:TRUE" \
  -keyout "$TMP/mock.key" -out "$TMP/mock.crt" 2>/dev/null
chmod 644 "$TMP/mock.key" "$TMP/mock.crt"

docker network create "$RUN" >/dev/null
docker run -d --name "$RUN-db" --network "$RUN" --network-alias db \
  -e POSTGRES_USER=kairos -e POSTGRES_PASSWORD=kairos -e POSTGRES_DB=kairos postgres:17 >/dev/null
docker run -d --name "$RUN-grayson" --network "$RUN" --network-alias api.finic.ai \
  -v "$HERE:/mock:ro" -v "$TMP:/certs:ro" python:3.13-slim \
  python3 -u /mock/mock_grayson.py 443 /certs/mock.crt /certs/mock.key >/dev/null
for _ in $(seq 1 60); do docker exec "$RUN-db" pg_isready -U kairos -d kairos >/dev/null 2>&1 && break; sleep 1; done

# No PORT here: the image's default (80) is what Vercel uses.
docker run -d --name "$RUN-app" --network "$RUN" -p "$HOST_PORT:80" \
  -e DATABASE_URL=postgres://kairos:kairos@db:5432/kairos \
  -e GRAYSON_API_KEY=gk-mock-not-a-real-key \
  -e NODE_EXTRA_CA_CERTS=/certs/mock.crt -v "$TMP:/certs:ro" \
  "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$BASE/health" >/dev/null && break; sleep 1; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
req() { # method path [json] -> body in $TMP/body, status in $code
  local args=(-s -o "$TMP/body" -w '%{http_code}' -X "$1" -H 'content-type: application/json')
  [ -n "${COOKIE:-}" ] && args+=(-H "Cookie: $COOKIE")
  [ -n "${KEY:-}" ] && args+=(-H "Authorization: Bearer $KEY")
  [ $# -ge 3 ] && args+=(-d "$3")
  code=$(curl "${args[@]}" "$BASE$2")
}
field() { python3 -c "import json,sys; d=json.load(open('$TMP/body')); print(eval(sys.argv[1]))" "$1"; }

req GET /health;  [ "$code" = 200 ] && [ "$(field 'd["ok"]')" = True ] && pass "health on default PORT 80 ($code)" || bad "health ($code)"
code=$(curl -s -o "$TMP/body" -w '%{http_code}' "$BASE/"); grep -qi '<html' "$TMP/body" && [ "$code" = 200 ] && pass "console served ($code)" || bad "console ($code)"
req GET /v1/stats; [ "$code" = 401 ] && pass "rejects missing API key ($code)" || bad "missing API key ($code)"

EMAIL=smoke-$$@example.test
code=$(curl -s -o "$TMP/body" -D "$TMP/headers" -w '%{http_code}' -H 'content-type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"smoke-password-$$\",\"name\":\"Smoke\"}" "$BASE/auth/signup")
COOKIE=$(grep -i '^set-cookie:' "$TMP/headers" | head -1 | sed 's/^[^:]*: *//; s/;.*//' | tr -d '\r')
[ "$code" = 200 ] && [ -n "$COOKIE" ] && pass "sign up, first account ($code)" || bad "sign up ($code)"
WS=$(field 'd["workspaces"][0]["id"]')

req POST "/app/workspaces/$WS/keys" '{"name":"smoke","kind":"secret"}'
KEY=$(field 'd["secret"]'); COOKIE=
[[ "$KEY" == ksk_* ]] && pass "create secret API key ($code)" || bad "create API key ($code)"

req PUT /v1/actions/withdrawal '{"subject":"user","hold":"Should this withdrawal be held because the account shows signs of fraud or takeover?"}'
[ "$code" = 200 ] && pass "define action ($code)" || bad "define action ($code)"

req POST /v1/events "{\"batch\":[{\"id\":\"e1_$$\",\"type\":\"login\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"entities\":{\"user\":\"user_42\",\"device\":\"dev_9\"},\"properties\":{\"ip_country\":\"GB\"}}]}"
[ "$code" = 202 ] && pass "track event ($code)" || bad "track event ($code)"

req POST /v1/decide '{"action":"withdrawal","entities":{"user":"user_42","device":"dev_9"},"properties":{"usd":900}}'
DECISION=$(field 'd.get("decision")' 2>/dev/null || true)
[ "$code" = 200 ] && [[ "$DECISION" =~ ^(approve|step_up|review|block)$ ]] && pass "decide via mock model ($code, decision=$DECISION)" || { bad "decide ($code)"; cat "$TMP/body"; echo; }
docker logs "$RUN-grayson" 2>&1 | grep -q 'auth=Bearer gk-mock' && pass "model call carried GRAYSON_API_KEY" || bad "model was not called with the key"

req GET '/v1/decisions?limit=10'
[ "$code" = 200 ] && [ "$(field 'd["total"]')" = 1 ] && pass "decision stored in Postgres ($code)" || bad "list decisions ($code)"

start=$(date +%s%N); docker stop -t 30 "$RUN-app" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
status=$(docker inspect -f '{{.State.ExitCode}}' "$RUN-app")
[ "$status" = 0 ] && pass "clean SIGTERM shutdown (exit 0 in ${ms} ms)" || bad "SIGTERM shutdown (exit $status after ${ms} ms)"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; docker logs "$RUN-app" 2>&1 | tail -20; exit 1; }
