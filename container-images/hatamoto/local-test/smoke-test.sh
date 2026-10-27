#!/usr/bin/env bash
# Smoke-test the Hatamoto image against a throwaway Postgres container. No real secrets are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t hatamoto-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-hatamoto-on-vercel}
HOST_PORT=${HOST_PORT:-8080}
DEFAULT_PORT_HOST=${DEFAULT_PORT_HOST:-8081}
BASE=http://localhost:$HOST_PORT
ID=hatamoto-smoke-$$
NET=$ID-net
DB_URL=postgres://hatamoto:hatamoto@$ID-db:5432/hatamoto?sslmode=disable
SECRET=local-test-secret-0123456789abcdef0123456789
BODY=$(mktemp)

cleanup() {
  docker rm -f "$ID" "$ID-default" "$ID-db" >/dev/null 2>&1 || true
  docker network rm "$NET" >/dev/null 2>&1 || true
  rm -f "$BODY"
}
trap cleanup EXIT

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@" || true)
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else flunk "$name (got $got, want $want)"; head -c 400 "$BODY"; echo; fi
}
wait_for() { # url
  for _ in $(seq 1 60); do curl -sf "$1" >/dev/null 2>&1 && return 0; sleep 0.5; done; return 1
}
hm() { # run the hatamoto CLI inside the running container
  docker exec -i -e DATABASE_URL="$DB_URL" "$ID" hatamoto "$@"
}

docker network create "$NET" >/dev/null
docker run -d --name "$ID-db" --network "$NET" \
  -e POSTGRES_USER=hatamoto -e POSTGRES_PASSWORD=hatamoto -e POSTGRES_DB=hatamoto \
  postgres:16-alpine >/dev/null
for _ in $(seq 1 60); do docker exec "$ID-db" pg_isready -U hatamoto -h 127.0.0.1 >/dev/null 2>&1 && break; sleep 0.5; done

# Same variables as on Vercel. DATABASE_URL points nowhere on purpose: the
# entrypoint must prefer DATABASE_URL_UNPOOLED, as Neon sets both.
# The registry and AI-crawler range downloads are turned off to keep the test offline.
COMMON=(
  -e DATABASE_URL=postgres://pooled.invalid:5432/nope
  -e DATABASE_URL_UNPOOLED="$DB_URL"
  -e HATAMOTO_SECRET="$SECRET"
  -e HATAMOTO_SETUP_CODE=local-setup-code-7f3k9
  -e HATAMOTO_ADMIN_PATH=/studio
  -e HATAMOTO_REGISTRY_URL=off
  -e HATAMOTO_AGENT_RANGES=off
)

docker run -d --name "$ID" --network "$NET" -p "$HOST_PORT:3000" \
  -e PORT=3000 -e PUBLIC_BASE_URL="$BASE" "${COMMON[@]}" "$IMAGE" >/dev/null
wait_for "$BASE/health" || { echo "server did not start"; docker logs "$ID"; exit 1; }

check "health" 200 "$BASE/health"
grep -qx 'ok' "$BODY" && pass "health body is ok" || flunk "health body is not ok"
check "ready (Postgres via DATABASE_URL_UNPOOLED)" 200 "$BASE/ready"
check "home page" 200 "$BASE/"
# The admin only answers browser navigations, which carry Sec-Fetch-* headers.
NAV=(-H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-Dest: document' -H 'Sec-Fetch-Site: none' -H 'Sec-Fetch-User: ?1')
check "first-run wizard at HATAMOTO_ADMIN_PATH/setup" 200 "${NAV[@]}" "$BASE/studio/setup"
grep -qi 'setup code' "$BODY" && pass "wizard asks for the setup code" || flunk "wizard does not ask for the setup code"

printf '%s\n' 'local-test-password-9x2q' | hm user create --email owner@example.com --name Owner --password-stdin >/dev/null \
  && pass "create owner (hatamoto user create)" || flunk "create owner"
hm entity create --schema page --name "Hello from Vercel" --slug hello-vercel \
  --attributes '{"content":"<p>Served by Hatamoto in a container.</p>"}' --publish --as owner@example.com >/dev/null \
  && pass "publish a page (hatamoto entity create --publish)" || flunk "publish a page"
check "published page is served" 200 "$BASE/hello-vercel"
grep -q 'Served by Hatamoto in a container.' "$BODY" && pass "page shows its content" || flunk "page content missing"

KEY=$(hm apikey create --name smoke --scopes read:entities --as owner@example.com 2>/dev/null | tail -n1 || true)
check "ready with API key returns JSON" 200 -H "X-API-Key: $KEY" "$BASE/ready"
grep -q '"database":"connected"' "$BODY" && pass "database connected" || flunk "database not reported connected"

start=$(date +%s)
docker stop -t 30 "$ID" >/dev/null
code=$(docker inspect -f '{{.State.ExitCode}}' "$ID")
secs=$(( $(date +%s) - start ))
[ "$code" = 0 ] && pass "SIGTERM exits cleanly (code $code, ${secs}s)" || flunk "SIGTERM exit code $code"

# No PORT set: the image must listen on Vercel's default port 80.
docker run -d --name "$ID-default" --network "$NET" -p "$DEFAULT_PORT_HOST:80" "${COMMON[@]}" "$IMAGE" >/dev/null
wait_for "http://localhost:$DEFAULT_PORT_HOST/health" && pass "default PORT 80" || { flunk "default PORT 80"; docker logs "$ID-default" | tail -n 20; }

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
