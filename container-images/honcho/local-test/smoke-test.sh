#!/usr/bin/env bash
# Smoke-test the Honcho image against Postgres (pgvector) and a fake OpenAI upstream. No real API keys are used.
# Usage (from this example's folder, after `docker build -t honcho-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-honcho-on-vercel}
PG_IMAGE=${PG_IMAGE:-pgvector/pgvector:pg17}
API_PORT=${API_PORT:-8080}
DEFAULT_PORT_CHECK=${DEFAULT_PORT_CHECK:-8081}
MOCK_PORT=${MOCK_PORT:-9999}
SECRET=local-test-jwt-secret
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$API_PORT
ID=$$
NET=honcho-smoke-$ID
BODY=$(mktemp)

python3 "$HERE/mock_openai.py" "$MOCK_PORT" > "$HERE/.mock.log" 2>&1 &
MOCK_PID=$!
cleanup() {
  docker rm -f "db-$ID" "api-$ID" "api80-$ID" "deriver-$ID" >/dev/null 2>&1 || true
  docker network rm "$NET" >/dev/null 2>&1 || true
  kill "$MOCK_PID" 2>/dev/null || true; rm -f "$BODY"
}
trap cleanup EXIT

docker network create "$NET" >/dev/null
docker run -d --name "db-$ID" --network "$NET" --network-alias db -e POSTGRES_PASSWORD=postgres "$PG_IMAGE" >/dev/null
for _ in $(seq 1 60); do docker exec "db-$ID" pg_isready -U postgres -q 2>/dev/null && break; sleep 1; done
sleep 2

# Same variables you set on Vercel. The LLM and embedding base URLs point at the mock on the host.
ENV=(-e DB_CONNECTION_URI=postgresql+psycopg://postgres:postgres@db:5432/postgres
     -e AUTH_JWT_SECRET="$SECRET"
     -e LLM_OPENAI_API_KEY=sk-mock-upstream
     -e LLM_OPENAI_BASE_URL="http://host.docker.internal:$MOCK_PORT/v1"
     -e EMBEDDING_MODEL_CONFIG__OVERRIDES__BASE_URL="http://host.docker.internal:$MOCK_PORT/v1")
RUN=(--network "$NET" --add-host host.docker.internal:host-gateway)

# The API, as the Vercel service runs it (image CMD: migrations, then fastapi on $PORT).
docker run -d --name "api-$ID" "${RUN[@]}" -p "$API_PORT:$API_PORT" -e PORT="$API_PORT" "${ENV[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 90); do curl -sf "$BASE/health" >/dev/null && break; sleep 1; done
# The deriver, as the Vercel daemon runs it (same image, vercel.json `command`).
docker run -d --name "deriver-$ID" "${RUN[@]}" "${ENV[@]}" \
  -e DERIVER_FLUSH_ENABLED=true -e DERIVER_POLLING_STARTUP_JITTER_SECONDS=0 \
  "$IMAGE" /app/.venv/bin/python -m src.deriver >/dev/null

jwt() { # HS256 JWT with Honcho's claims, signed with the given secret
  python3 - "$1" "$2" <<'PY'
import base64, hashlib, hmac, json, sys
b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=").decode()
head = b64(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
body = b64(json.dumps(json.loads(sys.argv[2])).encode())
sig = b64(hmac.new(sys.argv[1].encode(), f"{head}.{body}".encode(), hashlib.sha256).digest())
print(f"{head}.{body}.{sig}")
PY
}
ADMIN=$(jwt "$SECRET" '{"t":"","ad":true}')
FORGED=$(jwt wrong-secret '{"t":"","ad":true}')

fail=0
check() { # name, expected HTTP status (regex), curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [[ "$got" =~ ^($want)$ ]]; then echo "PASS  $name ($got)"; else echo "FAIL  $name (got $got, want $want)"; head -c 400 "$BODY"; echo; fail=1; fi
}
expect() { # name, pattern expected in the last response body
  if grep -q "$2" "$BODY"; then echo "PASS  $1"; else echo "FAIL  $1"; head -c 400 "$BODY"; echo; fail=1; fi
}
AUTH=(-H "Authorization: Bearer $ADMIN" -H 'content-type: application/json')
W=$BASE/v3/workspaces/demo

check "health"                        200 "$BASE/health"
check "rejects missing token"         401 -X POST -H 'content-type: application/json' -d '{"id":"demo"}' "$BASE/v3/workspaces"
check "rejects forged token"          401 -X POST -H "Authorization: Bearer $FORGED" -H 'content-type: application/json' -d '{"id":"demo"}' "$BASE/v3/workspaces"
check "create workspace"              201 "${AUTH[@]}" -d '{"id":"demo"}' "$BASE/v3/workspaces"
check "create peer"                   "200|201" "${AUTH[@]}" -d '{"id":"alice"}' "$W/peers"
check "create session"                "200|201" "${AUTH[@]}" -d '{"id":"s1","peers":{"alice":{}}}' "$W/sessions"
check "add messages"                  201 "${AUTH[@]}" \
  -d '{"messages":[{"peer_id":"alice","content":"I spent the weekend hiking in the Alps, it is my favorite thing to do."}]}' "$W/sessions/s1/messages"
check "list messages"                 200 "${AUTH[@]}" -d '{}' "$W/sessions/s1/messages/list"
expect "message stored" "favorite thing"

found=0
for _ in $(seq 1 60); do
  curl -s -o "$BODY" "${AUTH[@]}" -d '{}' "$W/conclusions/list" || true
  grep -q "hiking in the Alps" "$BODY" && { found=1; break; }; sleep 1
done
[ "$found" = 1 ] && echo "PASS  deriver worker extracted a conclusion" || { echo "FAIL  deriver produced no conclusion"; docker logs --tail 30 "deriver-$ID"; fail=1; }

check "dialectic chat"                200 "${AUTH[@]}" -d '{"query":"What does Alice like?"}' "$W/peers/alice/chat"
expect "chat answered by the LLM" "mock answer"
check "dialectic chat streaming"      200 "${AUTH[@]}" -d '{"query":"What does Alice like?","stream":true}' "$W/peers/alice/chat"
expect "streamed answer" "hiking"

# Vercel routes to port 80 unless PORT is set: run the image once more without PORT.
docker run -d --name "api80-$ID" "${RUN[@]}" -p "$DEFAULT_PORT_CHECK:80" "${ENV[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 90); do curl -sf "http://localhost:$DEFAULT_PORT_CHECK/health" >/dev/null && break; sleep 1; done
check "serves on default port 80"     200 "http://localhost:$DEFAULT_PORT_CHECK/health"

# Vercel sends SIGTERM on scale-in, with a 30 second grace period.
start=$(date +%s%N); docker stop -t 30 "api-$ID" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "api-$ID")
[ "$code" = 0 ] && [ "$ms" -lt 30000 ] && echo "PASS  API exits cleanly on SIGTERM (${ms} ms)" || { echo "FAIL  API SIGTERM exit $code after ${ms} ms"; fail=1; }
start=$(date +%s%N); docker stop -t 30 "deriver-$ID" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "deriver-$ID")
[ "$code" = 0 ] && [ "$ms" -lt 30000 ] && echo "PASS  deriver exits cleanly on SIGTERM (${ms} ms)" || { echo "FAIL  deriver SIGTERM exit $code after ${ms} ms"; fail=1; }

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
