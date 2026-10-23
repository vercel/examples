#!/usr/bin/env bash
# Smoke-test the image: auth, seeded data, queries, writes, read-only mode, default port and SIGTERM shutdown.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t pgrust-on-vercel .`):
#   ./local-test/smoke-test.sh
set -uo pipefail

IMAGE=${IMAGE:-pgrust-on-vercel}
HOST_PORT=${HOST_PORT:-8080}
RO_PORT=${RO_PORT:-8081}
USER_PASS=admin:test-password
BASE=http://localhost:$HOST_PORT
NAME=pgrust-smoke-$$
BODY=$(mktemp)
cleanup() { docker rm -f "$NAME" "$NAME-ro" >/dev/null 2>&1 || true; rm -f "$BODY"; }
trap cleanup EXIT

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; [ -s "$BODY" ] && head -c 500 "$BODY" && echo; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else flunk "$name (got $got, want $want)"; fi
}
contains() { grep -q "$2" "$BODY" && pass "$1" || flunk "$1"; }
wait_up() { for _ in $(seq 1 60); do [ "$(curl -s -o /dev/null -w '%{http_code}' "$1/api/info")" = 401 ] && return 0; sleep 0.5; done; return 1; }
query() { curl -s -o "$BODY" -w '%{http_code}' -u "$USER_PASS" --data-urlencode "query=$2" "$1/api/query"; }

# No PORT is set, so the image uses its default (80), the port Vercel routes to.
docker run -d --name "$NAME" -p "$HOST_PORT:80" -e AUTH_USER=admin -e AUTH_PASS=test-password "$IMAGE" >/dev/null
wait_up "$BASE" && pass "serves on default PORT 80" || flunk "serves on default PORT 80"

check "rejects missing credentials" 401 "$BASE/api/info"
check "rejects wrong password"      401 -u admin:wrong "$BASE/api/info"
check "web UI"                      200 -u "$USER_PASS" "$BASE/"
check "connection info"             200 -u "$USER_PASS" "$BASE/api/connection"
contains "server is pgrust" "pgrust 0.4-beta"
check "lists seeded objects"        200 -u "$USER_PASS" "$BASE/api/objects"
contains "seed tables and view present" "revenue_by_product"

got=$(query "$BASE" "select name, orders, revenue from revenue_by_product")
[ "$got" = 200 ] && pass "query seeded view ($got)" || flunk "query seeded view (got $got)"
contains "aggregates over seeded rows" '\["Hoodie",250,"30060.00"\]'

got=$(query "$BASE" "insert into products values (5, 'Cap', 18.00) returning name")
[ "$got" = 200 ] && pass "write ($got)" || flunk "write (got $got)"
query "$BASE" "select count(*) from products" >/dev/null
contains "read back the write" '\[\[5\]\]'

# Read-only mode on a second container.
docker run -d --name "$NAME-ro" -p "$RO_PORT:80" -e AUTH_USER=admin -e AUTH_PASS=test-password -e PGWEB_READONLY=1 "$IMAGE" >/dev/null
if wait_up "http://localhost:$RO_PORT"; then
  got=$(query "http://localhost:$RO_PORT" "insert into products values (6, 'Pin', 2.00)")
  [ "$got" != 200 ] && pass "PGWEB_READONLY=1 blocks writes ($got)" || flunk "PGWEB_READONLY=1 blocks writes (got $got)"
else
  flunk "read-only container did not start"
fi

# Clean shutdown: docker stop sends SIGTERM.
start=$(date +%s%N)
docker stop -t 20 "$NAME" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$NAME")
[ "$code" = 0 ] && pass "SIGTERM exits cleanly (code $code, ${ms} ms)" || flunk "SIGTERM exits cleanly (code $code, ${ms} ms)"
docker logs "$NAME" 2>&1 | grep -q "database system is shut down" \
  && pass "pgrust shut down cleanly" || flunk "pgrust shut down cleanly"

# Without credentials the container refuses to start.
docker run --rm "$IMAGE" >/dev/null 2>&1 && flunk "refuses to start without AUTH_USER/AUTH_PASS" \
  || pass "refuses to start without AUTH_USER/AUTH_PASS"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
