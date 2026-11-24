#!/usr/bin/env bash
# Smoke-test the SlashObserve image with a local Postgres and a fake Prometheus. No real secrets are used.
# Usage (from this example's folder, after `docker build -f Dockerfile.vercel -t slashobserve-on-vercel .`):
#   bash local-test/smoke-test.sh
set -euo pipefail

IMAGE=${IMAGE:-slashobserve-on-vercel}
HOST_PORT=${HOST_PORT:-8080}
HERE=$(cd "$(dirname "$0")" && pwd)
BASE=http://localhost:$HOST_PORT
N=slashobserve-smoke-$$
CONF=$(mktemp -d)
BODY=$CONF/body

cleanup() {
  docker rm -f "$N-app" "$N-db" "$N-prom" >/dev/null 2>&1 || true
  docker network rm "$N" >/dev/null 2>&1 || true
  rm -rf "$CONF"
}
trap cleanup EXIT

# Test-only config: browser sign-in off, one Admin service-account key, one Prometheus datasource.
KEY="sok_$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n')"
printf '%s\n' "$KEY" > "$CONF/smoke.key"
cat > "$CONF/service-accounts.yaml" <<YAML
serviceAccounts:
  - name: smoke-test
    role: admin
    keyFile: /etc/slashobserve/smoke.key
YAML
cat > "$CONF/datasources.yaml" <<YAML
datasources:
  - uid: prom
    type: prometheus
    name: Prometheus
    prometheus:
      url: http://$N-prom:9090
      scrapeInterval: 15s
YAML
chmod 755 "$CONF"; chmod 644 "$CONF"/*

docker network create "$N" >/dev/null
docker run -d --name "$N-db" --network "$N" \
  -e POSTGRES_USER=slashobserve -e POSTGRES_PASSWORD=slashobserve -e POSTGRES_DB=slashobserve \
  postgres:18 >/dev/null
docker run -d --name "$N-prom" --network "$N" -v "$HERE:/mock:ro" \
  python:3.13-alpine python -u /mock/mock_prometheus.py 9090 >/dev/null
for _ in $(seq 1 60); do docker exec "$N-db" pg_isready -U slashobserve -d slashobserve >/dev/null 2>&1 && break; sleep 0.5; done

# No PORT or SLASHOBSERVE_HTTP_ADDR override: the image's default (:80, Vercel's default port) is under test.
docker run -d --name "$N-app" --network "$N" -p "$HOST_PORT:80" \
  -e SLASHOBSERVE_DATABASE_URL="postgres://slashobserve:slashobserve@$N-db:5432/slashobserve?sslmode=disable" \
  -e SLASHOBSERVE_PUBLIC_URL="$BASE" \
  -e SLASHOBSERVE_SERVICE_ACCOUNTS_FILE=/etc/slashobserve/service-accounts.yaml \
  -e SLASHOBSERVE_DATASOURCES_FILE=/etc/slashobserve/datasources.yaml \
  -v "$CONF:/etc/slashobserve:ro" \
  "$IMAGE" >/dev/null

for _ in $(seq 1 60); do curl -sf "$BASE/readyz" >/dev/null && break; sleep 0.5; done

fail=0
pass() { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; if [ -f "$BODY" ]; then head -c 600 "$BODY"; echo; fi; fail=1; }
check() { # name, expected HTTP status, curl args...
  local name=$1 want=$2; shift 2
  local got; got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then pass "$name ($got)"; else bad "$name (got $got, want $want)"; fi
}
AUTH=(-H "Authorization: Bearer $KEY")

check "liveness /healthz"                 200 "$BASE/healthz"
check "readiness /readyz"                 200 "$BASE/readyz"
grep -q '"database":"ok"' "$BODY" && grep -q '"migrations":"ok"' "$BODY" \
  && pass "Postgres connected, migrations applied" || bad "readyz did not report database and migrations ok"
check "rejects request without a key"     401 "$BASE/api/v1/datasources"
check "lists datasources with a key"      200 "${AUTH[@]}" "$BASE/api/v1/datasources"
grep -q '"prom"' "$BODY" && pass "datasource from file is listed" || bad "datasource prom not listed"
check "PromQL range query via SlashObserve" 200 "${AUTH[@]}" -H 'content-type: application/json' \
  -d '{"query":"sum by (pod) (rate(http_requests_total[5m]))","kind":"range","from":"now-1h","to":"now"}' \
  "$BASE/api/v1/datasources/prom/query"
grep -q 'checkout-0' "$BODY" && pass "query returned the mock series" || bad "query did not return the mock series"
check "web app"                           200 "$BASE/"
curl -s -o "$BODY" "$BASE/metrics"
grep -q '^# HELP' "$BODY" && bad "Prometheus metrics are public at /metrics" || pass "no public Prometheus metrics at /metrics"

start=$(date +%s%N)
docker stop -t 30 "$N-app" >/dev/null
ms=$(( ($(date +%s%N) - start) / 1000000 ))
code=$(docker inspect -f '{{.State.ExitCode}}' "$N-app")
if [ "$code" = 0 ] && [ "$ms" -lt 30000 ]; then pass "SIGTERM: clean exit in ${ms} ms"; else bad "SIGTERM: exit code $code after ${ms} ms"; fi

[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; docker logs "$N-app" 2>&1 | tail -20; exit 1; }
