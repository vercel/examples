#!/usr/bin/env bash
# Smoke-test the Wakeshift image against a throwaway Postgres 17. No real credentials are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t wakeshift-on-vercel .`):
#   bash local-test/smoke-test.sh
# Needs Docker, curl and Node.js 22.2 or later (the client uses only the standard library).
set -euo pipefail

IMAGE=${IMAGE:-wakeshift-on-vercel}
PORT=${PORT:-8080}          # the port the server is told to use, as Vercel's PORT
DEFAULT_PORT_CHECK=${DEFAULT_PORT_CHECK:-18081}
HERE=$(cd "$(dirname "$0")" && pwd)
ID=wakeshift-smoke-$$
NET=$ID PG=$ID-pg SRV=$ID-server SRVDEF=$ID-default-port
BASE=http://localhost:$PORT
export WAKESHIFT_CORE=$BASE

cleanup() { docker rm -f "$SRV" "$SRVDEF" "$PG" >/dev/null 2>&1 || true; docker network rm "$NET" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker network create "$NET" >/dev/null
docker run -d --name "$PG" --network "$NET" --network-alias pg \
  -e POSTGRES_PASSWORD=postgres \
  -v "$HERE/postgres-init.sql:/docker-entrypoint-initdb.d/init.sql:ro" \
  postgres:17 >/dev/null
for _ in $(seq 1 60); do docker exec "$PG" pg_isready -h 127.0.0.1 -U postgres -d wakeshift >/dev/null 2>&1 && break; sleep 1; done

# A key for a test app, from the image's own /appkey tool.
KEYS=$(docker run --rm --entrypoint /appkey "$IMAGE" -app smoke)
export WAKESHIFT_KEY=$(printf '%s\n' "$KEYS" | sed -n 's/^WAKESHIFT_KEY=//p')
APPS=$(printf '%s\n' "$KEYS" | sed -n 's/^WAKESHIFT_APPS=//p')

ENVS=(
  -e DATABASE_URL=postgres://wakeshift_server:wakeshift_server@pg:5432/wakeshift?sslmode=disable
  -e WAKESHIFT_MIGRATE_DATABASE_URL=postgres://wakeshift:wakeshift@pg:5432/wakeshift?sslmode=disable
  -e WAKESHIFT_SECRET_KEY="$(head -c 48 /dev/urandom | base64 | tr -d '\n')"
  -e WAKESHIFT_APPS="$APPS"
  -e WAKESHIFT_MCP_EVENTS_PUSH=1
  -e WAKESHIFT_LOG_FORMAT=text
)
docker run -d --name "$SRV" --network "$NET" -p "127.0.0.1:$PORT:$PORT" \
  -e PORT="$PORT" -e WAKESHIFT_PUBLIC_URL="$BASE" "${ENVS[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "$BASE/health" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad()  { echo "FAIL  $1"; fail=1; }
status() { curl -s -o /tmp/$ID-body -w '%{http_code}' "$@"; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(status "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; cat /tmp/$ID-body; echo; fi
}
app() { node "$HERE/client.mjs" "$@"; }
J=(-H 'content-type: application/json')

check "health on PORT=$PORT"          200 "$BASE/health"
check "console served"                200 "$BASE/"
check "app API rejects unsigned call" 401 "$BASE/api/apps/v1/app"

OUT=$(app GET /app) && echo "$OUT" | grep -q '"id":"smoke"' && pass "signed app call (app smoke)" || { bad "signed app call"; echo "$OUT"; }

MANIFEST='{"events":[{"name":"build.finished","description":"A CI build finished",
  "arguments":{"type":"object","properties":{"repo":{"type":"string"}},"required":["repo"]},
  "payload":{"type":"object","properties":{"status":{"type":"string"}},"required":["status"]},
  "topic":"ev/build.finished/{repo}","subscribe":"any"}]}'
OUT=$(app PUT /manifest "$MANIFEST") && pass "publish manifest (build.finished)" || { bad "publish manifest"; echo "$OUT"; }

POLL='{"call":{"user":"u1","client":"smoke-test"},"name":"build.finished","arguments":{"repo":"api"},"cursor":null}'
OUT=$(app POST /events/poll "$POLL") && CURSOR=$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).cursor)' "$OUT") \
  && pass "MCP Events poll subscription created" || { bad "poll subscription"; echo "$OUT"; }

OUT=$(app POST /events/publish-urls '{"name":"build.finished","arguments":{"repo":"api"}}') \
  && URL=$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).url)' "$OUT") \
  && pass "publish URL created" || { bad "publish URL"; echo "$OUT"; }
got=$(status "${J[@]}" -d '{"status":"passed"}' "$URL")
case $got in 2??) pass "webhook POST to publish URL ($got)";; *) bad "webhook POST to publish URL (got $got)"; cat /tmp/$ID-body; echo;; esac

OUT=$(app POST /events/emit '{"name":"build.finished","arguments":{"repo":"api"},"payload":{"status":"failed"},"text":"api build failed"}') \
  && pass "emit from the app API" || { bad "emit"; echo "$OUT"; }
[ -n "${VERBOSE:-}" ] && echo "$OUT" >&2

POLL2=$(node -e 'const p=JSON.parse(process.argv[1]);p.cursor=process.argv[2];console.log(JSON.stringify(p))' "$POLL" "${CURSOR:-}")
OUT=""
for _ in $(seq 1 20); do
  OUT=$(app POST /events/poll "$POLL2" || true)
  echo "$OUT" | grep -q '"data":{"status":"passed"}' && echo "$OUT" | grep -q '"data":{"status":"failed"}' && break
  sleep 0.5
done
[ -n "${VERBOSE:-}" ] && echo "$OUT" >&2
echo "$OUT" | grep -q '"data":{"status":"passed"}' && pass "poll delivers the webhook occurrence" || { bad "webhook occurrence not delivered"; echo "$OUT"; }
echo "$OUT" | grep -q '"data":{"status":"failed"}' && pass "poll delivers the emitted occurrence" || { bad "emitted occurrence not delivered"; echo "$OUT"; }

# No PORT given: the image's default, 8370 (the value to set as the project's PORT on Vercel).
docker run -d --name "$SRVDEF" --network "$NET" -p "127.0.0.1:$DEFAULT_PORT_CHECK:8370" \
  -e WAKESHIFT_PUBLIC_URL="http://localhost:$DEFAULT_PORT_CHECK" "${ENVS[@]}" "$IMAGE" >/dev/null
for _ in $(seq 1 60); do curl -sf "http://localhost:$DEFAULT_PORT_CHECK/health" >/dev/null && break; sleep 0.5; done
check "health on image default port 8370" 200 "http://localhost:$DEFAULT_PORT_CHECK/health"

# Scale-in: Vercel sends SIGTERM and allows 30 seconds.
start=$(date +%s%N); docker stop -t 30 "$SRV" >/dev/null; ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$SRV")
[ "$code" = 0 ] && [ "$ms" -lt 30000 ] && pass "clean SIGTERM shutdown (exit $code in ${ms} ms)" || bad "SIGTERM shutdown (exit $code in ${ms} ms)"

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; docker logs "$SRV" 2>&1 | tail -20; exit 1; }
