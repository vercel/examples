#!/usr/bin/env bash
# Smoke-test the Hatamoto image with a throwaway Postgres and a fake S3 bucket. No real credentials are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t hatamoto-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-hatamoto-on-vercel}
PG_IMAGE=${PG_IMAGE:-postgres:17}          # match PG_MAJOR in Dockerfile.vercel
PY_IMAGE=${PY_IMAGE:-python:3.13-alpine}    # runs the stdlib-only S3 mock
APP_PORT=${APP_PORT:-18090}                 # host port for the first instance (container port 80)
HERE=$(cd "$(dirname "$0")" && pwd)
ID=hatamoto-smoke-$$
NET=$ID SUBNET=172.31.$((RANDOM % 200 + 20)).0/24
S3_IP=${SUBNET%0/24}10
ADMIN=/smoke-admin
CODE=smoke-test-setup-7341
SECRET=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
B=http://localhost:$APP_PORT
TMP=$(mktemp -d)

cleanup() {
  docker rm -f "$ID-app" "$ID-app2" "$ID-db" "$ID-s3" >/dev/null 2>&1 || true
  docker network rm "$NET" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

docker network create --subnet "$SUBNET" "$NET" >/dev/null
docker run -d --name "$ID-db" --network "$NET" -e POSTGRES_USER=hatamoto -e POSTGRES_PASSWORD=hatamoto \
  -e POSTGRES_DB=hatamoto "$PG_IMAGE" >/dev/null
docker run -d --name "$ID-s3" --network "$NET" --ip "$S3_IP" -v "$HERE/mock_s3.py:/mock_s3.py:ro" \
  "$PY_IMAGE" python3 -u /mock_s3.py 9000 >/dev/null
for _ in $(seq 1 60); do docker exec "$ID-db" pg_isready -U hatamoto -h 127.0.0.1 >/dev/null 2>&1 && break; sleep 1; done

# The same variables you set on Vercel. No PORT, so the image listens on Vercel's default, 80.
ENV=(-e "DATABASE_URL=postgres://hatamoto:hatamoto@$ID-db:5432/hatamoto?sslmode=disable"
  -e "HATAMOTO_SECRET=$SECRET" -e "HATAMOTO_SETUP_CODE=$CODE" -e "HATAMOTO_ADMIN_PATH=$ADMIN"
  -e "PUBLIC_BASE_URL=$B" -e DATABASE_MIN_CONNECTIONS=0
  -e MEDIA_STORAGE=s3 -e "HATAMOTO_MEDIA_S3_ENDPOINT=http://$S3_IP:9000" -e HATAMOTO_MEDIA_S3_REGION=us-east-1
  -e HATAMOTO_MEDIA_S3_BUCKET=media -e HATAMOTO_MEDIA_S3_PREFIX=site/
  -e HATAMOTO_MEDIA_S3_ACCESS_KEY=mock-access-key -e HATAMOTO_MEDIA_S3_SECRET_KEY=mock-secret-key
  # Keep the test offline: no plugin registry, no crawler IP-range downloads.
  -e HATAMOTO_REGISTRY_URL=off -e HATAMOTO_DEVELOPER_REGISTRY_URL=off -e HATAMOTO_AGENT_RANGES=off)
docker run -d --name "$ID-app" --network "$NET" -p "$APP_PORT:80" "${ENV[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$B/ready" >/dev/null 2>&1 && break; sleep 1; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$TMP/body" -w '%{http_code}' "$@" || true)
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; head -c 400 "$TMP/body"; echo; fi
}
# The admin only answers requests that carry browser fetch metadata.
NAV=(-H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-Dest: document' -H "Origin: $B")
JAR=(-c "$TMP/jar" -b "$TMP/jar")

check "health on default PORT 80"        200 "$B/health"
check "ready (database connected)"       200 "$B/ready"
check "public home page"                 200 "$B/"
check "admin redirects signed-out users" 303 "${NAV[@]}" "$B$ADMIN/"
check "setup wizard"                     200 "${NAV[@]}" "${JAR[@]}" "$B$ADMIN/setup"
CSRF=$(grep -o 'name="_csrf" value="[^"]*"' "$TMP/body" | head -1 | sed 's/.*value="//; s/"$//')
FORM=(--data-urlencode "_csrf=$CSRF" --data-urlencode name=Smoke --data-urlencode email=owner@example.com
  --data-urlencode password=correct-horse-battery --data-urlencode confirm=correct-horse-battery)
check "setup rejects a wrong code"       422 "${NAV[@]}" "${JAR[@]}" "${FORM[@]}" --data-urlencode code=wrong-code-000000 "$B$ADMIN/setup"
check "setup creates the owner"          303 "${NAV[@]}" "${JAR[@]}" "${FORM[@]}" --data-urlencode "code=$CODE" "$B$ADMIN/setup"
signed_in() { # base URL, cookie jar, nav headers...: follows redirects, must end on an admin page, not sign-in
  local base=$1 jar=$2; shift 2
  local out; out=$(curl -s -o /dev/null -w '%{http_code} %{url_effective}' -L "$@" -b "$jar" "$base$ADMIN/")
  [ "${out%% *}" = 200 ] && [[ "${out#* }" != *"$ADMIN/login"* ]]
}
signed_in "$B" "$TMP/jar" "${NAV[@]}" && pass "owner is signed in (admin answers 200)" || bad "owner is not signed in"

# Upload an image through the admin; it must land in the bucket and be served back from /media.
TOKEN=$(curl -s "${NAV[@]}" "${JAR[@]}" "$B$ADMIN/profile/complete" | grep -o '<meta name="csrf-token" content="[^"]*"' | sed 's/.*content="//; s/"$//')
printf '\x89PNG\r\n\x1a\n\0\0\0\rIHDR\0\0\0\1\0\0\0\1\x08\x06\0\0\0\x1f\x15\xc4\x89\0\0\0\rIDATx\x9cc\xf8\xcf\xc0\xf0\x1f\0\x05\0\x01\xff\x89\x99=\x1d\0\0\0\0IEND\xaeB`\x82' > "$TMP/pixel.png"
check "media upload"                     200 "${NAV[@]}" "${JAR[@]}" -H "X-CSRF-Token: $TOKEN" -F "file=@$TMP/pixel.png;type=image/png" "$B$ADMIN/media/upload?json=1"
MEDIA=$(grep -o '"url":"[^"]*"' "$TMP/body" | head -1 | sed 's/"url":"//; s/"$//')
docker logs "$ID-s3" 2>&1 | grep -q '^S3 PUT media/site/' && pass "upload stored in the S3 bucket" || bad "no object written to the bucket"
check "media served from the bucket"     200 "$B$MEDIA"
cmp -s "$TMP/body" "$TMP/pixel.png" && pass "served bytes match the upload" || bad "served bytes differ from the upload"

# Vercel sends SIGTERM on scale-down and allows 30 seconds.
start=$(date +%s)
docker stop -t 30 "$ID-app" >/dev/null
took=$(( $(date +%s) - start )); code=$(docker inspect -f '{{.State.ExitCode}}' "$ID-app")
if [ "$code" = 0 ] && [ "$took" -lt 30 ]; then pass "clean SIGTERM shutdown (exit $code in ${took}s)"; else bad "SIGTERM shutdown (exit $code in ${took}s)"; docker logs --tail 20 "$ID-app"; fi

# A fresh instance (as after scale-down), this time with PORT=3000, on the same address: nothing lived on the old one's disk.
docker run -d --name "$ID-app2" --network "$NET" -p "$APP_PORT:3000" -e PORT=3000 "${ENV[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$B/ready" >/dev/null 2>&1 && break; sleep 1; done
check "new instance listens on PORT=3000" 200 "$B/health"
check "setup wizard stays closed"         404 "${NAV[@]}" "$B$ADMIN/setup"
signed_in "$B" "$TMP/jar" "${NAV[@]}" && pass "owner session survives the new instance" || bad "owner session lost on the new instance"
check "media still served"                200 "$B$MEDIA"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
