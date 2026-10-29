#!/usr/bin/env bash
# Smoke-test the OpenTaxRate image against a local PostGIS database with synthetic data.
# No outside geocoders or real keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t opentaxrate-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-opentaxrate-on-vercel}
DB_IMAGE=${DB_IMAGE:-postgis/postgis:17-3.5}
API_PORT=${API_PORT:-18080}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$API_PORT
ID=$$
NET=otr-smoke-$ID DB=otr-db-$ID API=otr-api-$ID
KEY=otr_master_$(printf 'smoke%.0s' {1..8})
DATABASE_URL=postgres://opentaxrate:opentaxrate@$DB:5432/opentaxrate
BODY=$(mktemp)

cleanup() { docker rm -f "$API" "$DB" >/dev/null 2>&1 || true; docker network rm "$NET" >/dev/null 2>&1 || true; rm -f "$BODY"; }
trap cleanup EXIT

docker network create "$NET" >/dev/null
docker run -d --name "$DB" --network "$NET" \
  -e POSTGRES_USER=opentaxrate -e POSTGRES_PASSWORD=opentaxrate -e POSTGRES_DB=opentaxrate "$DB_IMAGE" >/dev/null
for _ in $(seq 1 60); do docker exec "$DB" pg_isready -U opentaxrate -q 2>/dev/null && break; sleep 1; done
sleep 2

# Geocoders off: the street range alone settles the address.
ENV=(-e DATABASE_URL="$DATABASE_URL" -e CENSUS_DISABLED=true -e NOMINATIM_DISABLED=true -e OPENTAXRATE_MASTER_KEYS="smoke=$KEY")

docker run --rm --network "$NET" "${ENV[@]}" "$IMAGE" migrate >/dev/null
docker exec -i "$DB" psql -q -v ON_ERROR_STOP=1 -U opentaxrate opentaxrate < "$HERE/fixture.sql"

# No PORT set: the image's default (80) must work.
docker run -d --name "$API" --network "$NET" -p "$API_PORT:80" "${ENV[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 30); do curl -sf "$BASE/health" >/dev/null && break; sleep 0.5; done

fail=0
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then echo "PASS  $name ($got)"; else echo "FAIL  $name (got $got, want $want)"; cat "$BODY"; echo; fail=1; fi
}
expect() { # name, pattern
  if grep -q "$2" "$BODY"; then echo "PASS  $1"; else echo "FAIL  $1"; cat "$BODY"; echo; fail=1; fi
}
RATE=(-G --data-urlencode state=WY --data-urlencode "street=150 Main St" --data-urlencode city=Cheyenne --data-urlencode zip=82001)

check  "health on default PORT 80"     200 "$BASE/health"
check  "OpenAPI spec"                  200 "$BASE/v1/openapi.json"
check  "rejects an unknown API key"    401 -H "x-api-key: otr_master_not-a-real-key-0000000000000000" "$BASE/v1/coverage"
check  "coverage with master key"      200 -H "x-api-key: $KEY" "$BASE/v1/coverage"
expect "coverage lists WY"             '"WY"'
check  "rejects a lookup without a state" 400 -H "x-api-key: $KEY" -G --data-urlencode "street=150 Main St" "$BASE/v1/rate"
check  "rate by street address"        200 -H "x-api-key: $KEY" "${RATE[@]}" "$BASE/v1/rate"
expect "combined rate is 7%"           '"rate":0.07'
expect "matched on the street range"   '"match":"street"'
check  "public (no key) rate lookup"   200 "${RATE[@]}" "$BASE/v1/rate"

start=$(date +%s%N); docker stop -t 10 "$API" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$API")
if [ "$ms" -lt 5000 ]; then echo "PASS  SIGTERM shutdown (exit $code, ${ms} ms)"; else echo "FAIL  SIGTERM shutdown took ${ms} ms"; fail=1; fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
