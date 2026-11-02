#!/usr/bin/env bash
# Smoke-test the zeroauthy image the way Vercel runs it: plain HTTP on port 80 behind a
# TLS-terminating proxy, PostgreSQL storage, a master key from the environment.
# Uses a throwaway PostgreSQL container and test-only credentials from local-test/seed.yaml.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t zeroauthy-on-vercel .`):
#   ./local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-zeroauthy-on-vercel}
HOST_PORT=${HOST_PORT:-8080}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$HOST_PORT
TENANT=auth.example.test
SYSTEM=admin.example.test
TMP=$(mktemp -d)
NET=zeroauthy-smoke-$$
PG=zeroauthy-pg-$$
APP=zeroauthy-app-$$
ENV_ARGS=(
  -e ZEROAUTHY_STORAGE__DSN="postgres://zeroauthy:zeroauthy@$PG:5432/zeroauthy?sslmode=disable"
  -e ZEROAUTHY_SECURITY__MASTER_KEY="$(head -c 32 /dev/urandom | base64)"
  -e ZEROAUTHY_SERVER__SYSTEM_HOST="$SYSTEM"
)

cleanup() {
  docker rm -f "$APP" "$PG" >/dev/null 2>&1 || true
  docker network rm "$NET" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

docker network create "$NET" >/dev/null
docker run -d --name "$PG" --network "$NET" -e POSTGRES_USER=zeroauthy -e POSTGRES_PASSWORD=zeroauthy \
  -e POSTGRES_DB=zeroauthy postgres:17-alpine >/dev/null
for _ in $(seq 1 60); do docker exec "$PG" pg_isready -q -h 127.0.0.1 -U zeroauthy 2>/dev/null && break; sleep 0.5; done

start_app() { # No PORT and no listen override: the image's default port 80, as on Vercel.
  docker run -d --name "$APP" --network "$NET" -p "$HOST_PORT:80" "${ENV_ARGS[@]}" \
    -e ZEROAUTHY_SEED=/seed/seed.yaml -v "$HERE/seed.yaml:/seed/seed.yaml:ro" "$IMAGE" >/dev/null
  for _ in $(seq 1 60); do
    curl -sf -H "Host: $TENANT" "$BASE/.well-known/openid-configuration" >/dev/null && return 0; sleep 0.5
  done
  docker logs "$APP" | tail -20; return 1
}

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$TMP/body" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; cat "$TMP/body"; echo; fi
}
json() { python3 -c "import json,sys; print(json.load(open('$TMP/body'))$1)"; }

start_app
check "OIDC discovery on port 80" 200 -H "Host: $TENANT" "$BASE/.well-known/openid-configuration"
[ "$(json "['issuer']")" = "https://$TENANT/" ] && pass "issuer is https://$TENANT/ behind the proxy" || bad "issuer is $(json "['issuer']")"
check "JWKS" 200 -H "Host: $TENANT" "$BASE/.well-known/jwks.json"
cp "$TMP/body" "$TMP/jwks1.json"
check "unknown host is refused" 404 -H "Host: nobody.example.test" "$BASE/.well-known/openid-configuration"
check "client_credentials token" 200 -H "Host: $TENANT" "$BASE/oauth/token" \
  -d grant_type=client_credentials -d client_id=demo-m2m -d client_secret=demo-m2m-secret-not-for-production \
  -d audience=https://api.example.test
M2M_TOKEN=$(json "['access_token']")
python3 "$HERE/verify_jwt.py" "$TMP/jwks1.json" "$M2M_TOKEN" "https://$TENANT/" https://api.example.test >/dev/null \
  && pass "access token verifies against JWKS" || bad "access token does not verify"
check "wrong client secret" 401 -H "Host: $TENANT" "$BASE/oauth/token" \
  -d grant_type=client_credentials -d client_id=demo-m2m -d client_secret=wrong -d audience=https://api.example.test
check "password-realm login (user stored in PostgreSQL)" 200 -H "Host: $TENANT" "$BASE/oauth/token" \
  -d grant_type=http://auth0.com/oauth/grant-type/password-realm -d realm=Username-Password-Authentication \
  -d client_id=demo-web -d client_secret=demo-web-secret-not-for-production \
  -d username=alice@example.test -d password=Correct-Horse-Battery-9 -d scope=openid
ID_TOKEN=$(json "['id_token']")
python3 "$HERE/verify_jwt.py" "$TMP/jwks1.json" "$ID_TOKEN" "https://$TENANT/" demo-web >/dev/null \
  && pass "ID token verifies against JWKS" || bad "ID token does not verify"
check "wrong password is rejected" 400 -H "Host: $TENANT" "$BASE/oauth/token" \
  -d grant_type=http://auth0.com/oauth/grant-type/password-realm -d realm=Username-Password-Authentication \
  -d client_id=demo-web -d client_secret=demo-web-secret-not-for-production \
  -d username=alice@example.test -d password=nope -d scope=openid
check "admin console on the system host" 200 -H "Host: $SYSTEM" "$BASE/admin/"
LINK=$(docker run --rm --network "$NET" "${ENV_ARGS[@]}" "$IMAGE" admin create --email ops@example.test | tail -1)
case "$LINK" in "https://$SYSTEM/"*) pass "admin create prints a setup link";; *) bad "admin create printed: $LINK";; esac

# Clean shutdown: Vercel sends SIGTERM to instances it stops.
start=$(date +%s); docker stop -t 20 "$APP" >/dev/null; took=$(( $(date +%s) - start ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$APP")
[ "$code" = 0 ] && [ "$took" -lt 20 ] && pass "SIGTERM exits cleanly (code $code, ${took}s)" || bad "SIGTERM exit code $code after ${took}s"
docker rm "$APP" >/dev/null

# A fresh instance must see the same keys, clients and users: all state lives in PostgreSQL.
start_app
check "new instance: JWKS" 200 -H "Host: $TENANT" "$BASE/.well-known/jwks.json"
python3 "$HERE/verify_jwt.py" "$TMP/body" "$M2M_TOKEN" "https://$TENANT/" https://api.example.test >/dev/null \
  && pass "new instance: earlier token still verifies" || bad "new instance: earlier token no longer verifies"
check "new instance: client_credentials token" 200 -H "Host: $TENANT" "$BASE/oauth/token" \
  -d grant_type=client_credentials -d client_id=demo-m2m -d client_secret=demo-m2m-secret-not-for-production \
  -d audience=https://api.example.test

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
