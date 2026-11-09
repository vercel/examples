#!/usr/bin/env bash
# Smoke-test the CaseCite image with Postgres, Redis and a fake OpenAI API. No real API keys are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t casecite-on-vercel .`):
#   ./local-test/smoke-test.sh
set -uo pipefail

IMAGE=${IMAGE:-casecite-on-vercel}
APP_PORT=${APP_PORT:-8080}
MOCK_PORT=${MOCK_PORT:-9999}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$APP_PORT
ID=casecite-smoke-$$
NET=$ID-net
BOOTSTRAP=smoke-bootstrap-token
EMAIL=admin@example.com
PASSWORD='Smoke-Test-Passw0rd!2026'
TMP=$(mktemp -d)

python3 "$HERE/mock_openai.py" "$MOCK_PORT" > "$TMP/mock.log" 2>&1 &
MOCK_PID=$!
cleanup() {
  docker rm -f "$ID-app" "$ID-pg" "$ID-redis" >/dev/null 2>&1 || true
  docker network rm "$NET" >/dev/null 2>&1 || true
  kill "$MOCK_PID" 2>/dev/null || true
  rm -rf "$TMP"
}
trap cleanup EXIT

docker network create "$NET" >/dev/null
docker run -d --name "$ID-pg" --network "$NET" -e POSTGRES_USER=casecite -e POSTGRES_PASSWORD=casecite \
  -e POSTGRES_DB=casecite postgres:16-alpine >/dev/null
docker run -d --name "$ID-redis" --network "$NET" redis:7-alpine redis-server --maxmemory-policy noeviction >/dev/null
for _ in $(seq 1 60); do docker exec "$ID-pg" pg_isready -U casecite >/dev/null 2>&1 && break; sleep 1; done

# Same variables as on Vercel. Local Postgres has no TLS, so DB_SSL=internal here (use require on Vercel).
docker run -d --name "$ID-app" --network "$NET" -p "$APP_PORT:$APP_PORT" \
  --add-host=host.docker.internal:host-gateway \
  -e PORT="$APP_PORT" \
  -e SECRET_KEY="$(openssl rand -hex 32)" \
  -e ENCRYPTION_SALT="$(openssl rand -hex 16)" \
  -e AUDIT_HMAC_KEY="$(openssl rand -hex 32)" \
  -e DATABASE_URL="postgresql+asyncpg://casecite:casecite@$ID-pg:5432/casecite" \
  -e DB_SSL=internal \
  -e REDIS_URL="redis://$ID-redis:6379/0" \
  -e ALLOWED_HOSTS=localhost \
  -e CORS_ORIGINS="$BASE" \
  -e DISK_ENCRYPTION_ACKNOWLEDGED=true \
  -e REGISTRATION_BOOTSTRAP_TOKEN="$BOOTSTRAP" \
  -e OPENAI_API_KEY=sk-mock \
  -e OPENAI_BASE_URL="http://host.docker.internal:$MOCK_PORT/v1" \
  -e EMBEDDING_BASE_URL="http://host.docker.internal:$MOCK_PORT/v1" \
  "$IMAGE" >/dev/null

for _ in $(seq 1 120); do curl -sf "$BASE/health" >/dev/null && break; sleep 1; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; [ -f "$TMP/body" ] && head -c 400 "$TMP/body" && echo; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$TMP/body" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; fi
}
json() { python3 -c "import json,sys; print(json.load(open('$TMP/body'))$1)" 2>/dev/null; }

check "health" 200 "$BASE/health"
check "frontend shell" 200 "$BASE/"
grep -q '/assets/' "$TMP/body" && pass "frontend references built assets" || bad "frontend references built assets"
check "rejects unauthenticated API call" 401 "$BASE/api/v1/auth/me"

check "CSRF token" 200 "$BASE/api/v1/csrf-token"
CSRF=$(json "['csrf_token']")
C=(-H "Cookie: _csrf=$CSRF" -H "X-CSRF-Token: $CSRF" -H 'content-type: application/json')

check "first account needs bootstrap token" 403 "${C[@]}" \
  -d "{\"email\":\"$EMAIL\",\"name\":\"Admin\",\"password\":\"$PASSWORD\"}" "$BASE/api/v1/auth/register"
check "register first admin" 201 "${C[@]}" \
  -d "{\"email\":\"$EMAIL\",\"name\":\"Admin\",\"password\":\"$PASSWORD\",\"bootstrap_token\":\"$BOOTSTRAP\"}" "$BASE/api/v1/auth/register"
check "login" 200 "${C[@]}" -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" "$BASE/api/v1/auth/login"
TOKEN=$(json "['access_token']")
A=(-H "Authorization: Bearer $TOKEN" -H "Cookie: _csrf=$CSRF" -H "X-CSRF-Token: $CSRF")
check "current user" 200 "${A[@]}" "$BASE/api/v1/auth/me"

printf 'MASTER SERVICES AGREEMENT\n\nSection 9. Limitation of Liability. Each party'"'"'s total liability is capped at the fees paid in the twelve months before the claim.\n' > "$TMP/msa.txt"
check "upload and index document" 200 "${A[@]}" -F "file=@$TMP/msa.txt;type=text/plain" "$BASE/api/v1/documents"
check "research chat over documents" 200 "${A[@]}" -H 'content-type: application/json' \
  -d '{"query":"What is the liability cap in the MSA?","include_case_law":false}' "$BASE/api/v1/chat"
grep -q 'Mock answer' "$TMP/body" && pass "answer comes from the model" || bad "answer comes from the model"
grep -q 'MOCK POST /v1/embeddings' "$TMP/mock.log" && pass "embeddings sent to OpenAI-compatible endpoint" || bad "embeddings sent to OpenAI-compatible endpoint"
grep -q 'MOCK POST /v1/chat/completions' "$TMP/mock.log" && pass "chat sent to OpenAI-compatible endpoint" || bad "chat sent to OpenAI-compatible endpoint"

start=$(date +%s)
docker stop -t 30 "$ID-app" >/dev/null
code=$(docker inspect -f '{{.State.ExitCode}}' "$ID-app")
[ "$code" = 0 ] && pass "clean shutdown on SIGTERM (exit $code, $(( $(date +%s) - start ))s)" || { echo "FAIL  shutdown exit code $code"; fail=1; }

echo "--- mock provider calls"; sort "$TMP/mock.log" | uniq -c
[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; docker logs "$ID-app" 2>&1 | tail -40; exit 1; }
