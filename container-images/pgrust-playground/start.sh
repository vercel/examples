#!/bin/sh
# Start pgrust on a private Unix socket, then pgweb on $PORT.
# With --seed (used at build time), load /opt/seed.sql into /opt/pgdata and exit.
set -eu

PORT=${PORT:-80}
PG=/opt/pgrust/bin

if [ "${1:-}" = "--seed" ]; then
  DATA=/opt/pgdata
else
  if [ -z "${AUTH_USER:-}" ] || [ -z "${AUTH_PASS:-}" ]; then
    echo "start.sh: set AUTH_USER and AUTH_PASS (HTTP basic auth for pgweb)" >&2
    exit 1
  fi
  # Each instance gets its own writable copy of the seeded database. It is gone when the instance stops.
  DATA=/tmp/pgdata
  rm -rf "$DATA" && cp -a /opt/pgdata "$DATA"
fi

# pgrust's documented settings for running the server.
ulimit -s 65520 2>/dev/null || true
RUST_MIN_STACK=33554432 setpriv --reuid=pgrust --regid=pgrust --init-groups \
  "$PG/postgres" -D "$DATA" -k /tmp -c listen_addresses= -c io_method=sync -c max_stack_depth=60000 &
DB=$!

until "$PG/psql" -h /tmp -U postgres -Atqc 'select 1' >/dev/null 2>&1; do
  kill -0 "$DB" 2>/dev/null || { echo "start.sh: pgrust exited during startup" >&2; exit 1; }
  sleep 0.2
done

if [ "${1:-}" = "--seed" ]; then
  "$PG/psql" -h /tmp -U postgres -v ON_ERROR_STOP=1 -q -f /opt/seed.sql
  kill -INT "$DB" && wait "$DB"
  exit 0
fi

# pgweb reads AUTH_USER and AUTH_PASS from the environment. Set PGWEB_READONLY=1 to block writes.
pgweb --url "postgres://postgres@/postgres?host=/tmp&sslmode=disable" \
  --bind 0.0.0.0 --listen "$PORT" --skip-open ${PGWEB_READONLY:+--readonly} &
WEB=$!

stop() {
  kill -TERM "$WEB" 2>/dev/null || true
  kill -INT "$DB" 2>/dev/null || true # fast shutdown
  wait "$WEB" 2>/dev/null || true
  wait "$DB" 2>/dev/null || true
  exit "${1:-0}"
}
trap 'stop 0' TERM INT

# Stop everything if either process dies.
while kill -0 "$DB" 2>/dev/null && kill -0 "$WEB" 2>/dev/null; do
  sleep 1 &
  wait $!
done
stop 1
