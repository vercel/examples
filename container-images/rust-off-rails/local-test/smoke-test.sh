#!/usr/bin/env bash
# Smoke-test the app image against a throwaway Postgres, the way it runs on Vercel
# (APP_ENV=production, the image's default PORT=80, DATABASE_URL and APP_URL set). No secrets are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t rust-off-rails-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-rust-off-rails-on-vercel}
HOST_PORT=${HOST_PORT:-8080}
BASE=http://localhost:$HOST_PORT
ID=offrails-smoke-$$
BODY=$(mktemp); HEADERS=$(mktemp)
cleanup() {
  docker rm -f "$ID-app" "$ID-db" >/dev/null 2>&1 || true
  docker network rm "$ID" >/dev/null 2>&1 || true
  rm -f "$BODY" "$HEADERS"
}
trap cleanup EXIT

# Postgres stands in for the Marketplace database (Neon, Supabase, ...).
docker network create "$ID" >/dev/null
docker run -d --name "$ID-db" --network "$ID" \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app postgres:17 >/dev/null
for _ in $(seq 1 60); do docker exec "$ID-db" pg_isready -q -U postgres -d app && break; sleep 0.5; done

# PORT is not set: the image's default (80) is what Vercel expects.
docker run -d --name "$ID-app" --network "$ID" -p "$HOST_PORT:80" \
  -e DATABASE_URL="postgres://postgres:postgres@$ID-db:5432/app" \
  -e APP_URL="$BASE" \
  "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$BASE/up" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
flunk() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -D "$HEADERS" -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else flunk "$name (got $got, want $want)"; head -c 300 "$BODY"; echo; fi
}

check "health: database up, migrations applied" 200 "$BASE/up"
grep -qx 'ok' "$BODY" && pass "health body is ok" || flunk "health body is not ok"
check "home page" 200 "$BASE/"
grep -q 'Rust off Rails' "$BODY" && pass "home page rendered" || flunk "home page not rendered"
CSS=$(grep -o '/static/app\.css[^"]*' "$BODY" | head -1)
check "compiled Tailwind CSS (${CSS:-missing})" 200 "$BASE${CSS:-/static/app.css}"
check "security headers" 200 "$BASE/"
grep -qi '^content-security-policy:' "$HEADERS" && grep -qi '^x-content-type-options: nosniff' "$HEADERS" \
  && pass "CSP and nosniff set" || flunk "missing security headers"
check "dev tools absent in production" 404 "$BASE/dev"
check "cross-site POST blocked (CSRF)" 403 -X POST -H 'Sec-Fetch-Site: cross-site' -H 'Origin: https://evil.example' \
  -d 'theme=dark' "$BASE/theme"
check "same-origin POST accepted" 303 -X POST -H 'Sec-Fetch-Site: same-origin' -H "Origin: $BASE" \
  -d 'theme=dark' "$BASE/theme"
check "robots.txt" 200 "$BASE/robots.txt"
docker logs "$ID-app" 2>&1 | grep -q '"level":"INFO"' && pass "JSON logs on stdout" || flunk "no JSON logs"

# Vercel sends SIGTERM before stopping an instance.
start=$(date +%s%N)
docker stop -t 30 "$ID-app" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$ID-app")
[ "$code" = 0 ] && pass "clean SIGTERM shutdown (exit 0 in ${ms} ms)" || flunk "SIGTERM exit code $code after ${ms} ms"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
