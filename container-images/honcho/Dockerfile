# Honcho on Vercel: fetch the pinned release, install its locked dependencies, ship the API image.
# The same image runs the API (Vercel Function) and the deriver worker (Vercel Daemon).

# Honcho v3.6.1. Change both values together to upgrade.
ARG HONCHO_VERSION=v3.6.1
ARG HONCHO_COMMIT=70c67624169683b9e265517aec95a51b8077cabc

# 1. Honcho source at the pinned commit.
FROM python:3.13-slim-bookworm AS source
ARG HONCHO_COMMIT
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init -q . \
 && git remote add origin https://github.com/plastic-labs/honcho.git \
 && git fetch -q --depth 1 origin "$HONCHO_COMMIT" \
 && git checkout -q FETCH_HEAD

# 2. Locked Python dependencies, installed with uv (same version as upstream).
FROM python:3.13-slim-bookworm AS deps
COPY --from=ghcr.io/astral-sh/uv:0.13.5 /uv /bin/uv
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
COPY --from=source /src/uv.lock /src/pyproject.toml ./
RUN uv sync --frozen --no-install-project --no-group dev

# 3. Runtime: the virtualenv and Honcho's source, run as a non-root user.
FROM python:3.13-slim-bookworm
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PATH="/app/.venv/bin:$PATH" HOME=/app
# Require JWT auth on a public deployment. Honcho refuses to boot without AUTH_JWT_SECRET.
ENV AUTH_USE_AUTH=true
RUN addgroup --system app && adduser --system --group app && chown app:app /app
COPY --from=deps --chown=app:app /app/.venv /app/.venv
COPY --from=source --chown=app:app /src/src /app/src
COPY --from=source --chown=app:app /src/migrations /app/migrations
COPY --from=source --chown=app:app /src/scripts /app/scripts
COPY --from=source --chown=app:app /src/alembic.ini /src/pyproject.toml /app/
USER app
# Apply migrations (guarded by a database lock), then serve on $PORT. 80 is Vercel's default.
CMD ["sh", "-c", "python scripts/provision_db.py && exec fastapi run --host 0.0.0.0 --port \"${PORT:-80}\" src/main.py"]
