#!/usr/bin/env bash
# Smoke-test the Atuin server image against a throwaway Postgres container. No real credentials are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t atuin-server-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-atuin-server-on-vercel}
PG_IMAGE=${PG_IMAGE:-postgres:17-alpine}
HOST_PORT=${HOST_PORT:-18888}
APP_PORT=3000                       # the PORT Vercel would pass, if you set one
TAG=atuin-smoke-$$
NET=$TAG-net
BASE=http://127.0.0.1:$HOST_PORT
BODY=$(mktemp)
DB_URL="postgres://atuin:atuin@$TAG-db:5432/atuin"

cleanup() { docker rm -f "$TAG-db" "$TAG-app" >/dev/null 2>&1 || true; docker network rm "$NET" >/dev/null 2>&1 || true; rm -f "$BODY"; }
trap cleanup EXIT

fail=0
pass() { echo "PASS  $1"; }
bad()  { echo "FAIL  $1"; [ -s "$BODY" ] && { cat "$BODY"; echo; }; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@" || true)
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; fi
}
wait_healthy() { for _ in $(seq 1 60); do curl -sf "$1/healthz" >/dev/null 2>&1 && return 0; sleep 0.5; done; return 1; }
start_app() { # extra docker run args...
  docker rm -f "$TAG-app" >/dev/null 2>&1 || true
  docker run -d --name "$TAG-app" --network "$NET" "$@" "$IMAGE" >/dev/null
}

docker network create "$NET" >/dev/null
docker run -d --name "$TAG-db" --network "$NET" \
  -e POSTGRES_USER=atuin -e POSTGRES_PASSWORD=atuin -e POSTGRES_DB=atuin "$PG_IMAGE" >/dev/null
for _ in $(seq 1 60); do docker exec "$TAG-db" pg_isready -U atuin -d atuin >/dev/null 2>&1 && break; sleep 0.5; done
sleep 1

# 1. Like a Marketplace Postgres integration: only DATABASE_URL is set. PORT is set, registration open.
start_app -p "$HOST_PORT:$APP_PORT" -e PORT=$APP_PORT -e DATABASE_URL="$DB_URL" -e ATUIN_OPEN_REGISTRATION=true
wait_healthy "$BASE" && pass "listens on \$PORT, migrates DATABASE_URL" || { bad "server did not become healthy"; docker logs "$TAG-app"; exit 1; }

JSON=(-H 'content-type: application/json')
check "health"                        200 "$BASE/healthz"
check "server info"                   200 "$BASE/"
grep -q '"version"' "$BODY" && pass "server info reports a version" || bad "server info has no version"
check "register user"                 200 "${JSON[@]}" -d '{"email":"dev@example.com","username":"dev","password":"correct-horse"}' "$BASE/register"
check "duplicate username rejected"   400 "${JSON[@]}" -d '{"email":"dev2@example.com","username":"dev","password":"x"}' "$BASE/register"
check "wrong password rejected"       401 "${JSON[@]}" -d '{"username":"dev","password":"wrong"}' "$BASE/login"
check "login"                         200 "${JSON[@]}" -d '{"username":"dev","password":"correct-horse"}' "$BASE/login"
TOKEN=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["session"])' "$BODY")
AUTH=(-H "Authorization: Token $TOKEN")
check "rejects missing token"         400 "$BASE/api/v0/me"
check "rejects invalid token"         403 -H "Authorization: Token not-a-real-session" "$BASE/api/v0/me"
check "whoami"                        200 "${AUTH[@]}" "$BASE/api/v0/me"
grep -q '"dev"' "$BODY" && pass "whoami returns the user" || bad "whoami did not return the user"

HOST_ID=0190f3a2-6c1e-7c3b-9d4e-5f6a7b8c9d0e
REC_ID=0190f3a2-6c1e-7c3b-9d4e-000000000001
RECORD="[{\"id\":\"$REC_ID\",\"idx\":0,\"host\":{\"id\":\"$HOST_ID\"},\"timestamp\":1794400000000000000,\"version\":\"v0\",\"tag\":\"history\",\"data\":{\"data\":\"v4.local.opaque-ciphertext\",\"content_encryption_key\":\"{}\"}}]"
check "upload encrypted record"       200 "${AUTH[@]}" "${JSON[@]}" -d "$RECORD" "$BASE/api/v0/record"
check "record index"                  200 "${AUTH[@]}" "$BASE/api/v0/record"
grep -q "\"$HOST_ID\"" "$BODY" && pass "index lists the host" || bad "index does not list the host"
check "download record"               200 "${AUTH[@]}" "$BASE/api/v0/record/next?host=$HOST_ID&tag=history&count=10"
grep -q 'opaque-ciphertext' "$BODY" && pass "ciphertext round-trips unchanged" || bad "downloaded record differs"

# 2. SIGTERM, then a fresh instance on the default port 80 with registration closed (the default).
start=$(date +%s%N); docker stop -t 30 "$TAG-app" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$TAG-app")
[ "$code" = 0 ] && pass "SIGTERM exits cleanly (exit $code, ${ms} ms)" || bad "SIGTERM exit code $code after ${ms} ms"

start_app -p "$HOST_PORT:80" -e ATUIN_DB_URI="$DB_URL"
wait_healthy "$BASE" && pass "new instance listens on default port 80" || { bad "no response on port 80"; docker logs "$TAG-app"; exit 1; }
check "registration closed by default" 400 "${JSON[@]}" -d '{"email":"x@example.com","username":"intruder","password":"x"}' "$BASE/register"
grep -q 'not open for registrations' "$BODY" && pass "server says registration is closed" || bad "unexpected registration response"
check "login on new instance"         200 "${JSON[@]}" -d '{"username":"dev","password":"correct-horse"}' "$BASE/login"
check "data survives the restart"     200 "${AUTH[@]}" "$BASE/api/v0/record/next?host=$HOST_ID&tag=history&count=10"
grep -q 'opaque-ciphertext' "$BODY" && pass "record is still there" || bad "record was lost"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
