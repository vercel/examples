#!/bin/sh
# Start the Octomind WebSocket server on $PORT, with every model call going through AI Gateway.
set -eu

: "${OCTOMIND_SERVER_TOKEN:?OCTOMIND_SERVER_TOKEN is required: clients must send it as a Bearer token}"

# Octomind's `local:` provider speaks OpenAI Chat Completions, which AI Gateway serves.
export LOCAL_API_KEY="${LOCAL_API_KEY:-${AI_GATEWAY_API_KEY:-}}"
if [ -z "$LOCAL_API_KEY" ]; then
  echo "AI_GATEWAY_API_KEY is required" >&2
  exit 1
fi

MODEL="local:${OCTOMIND_MODEL:-anthropic/claude-sonnet-5}"
# `assistant` is defined in Octomind's built-in config, so startup downloads nothing.
# Set OCTOMIND_ROLE to a tap agent (for example developer:general) to fetch one instead.
ROLE="${OCTOMIND_ROLE:-assistant}"
mkdir -p "$OCTOMIND_DATA_DIR"

# --sandbox confines file writes from the agent, its shells and MCP servers to /workspace.
exec octomind server "$ROLE" \
  --host 0.0.0.0 \
  --port "${PORT:-80}" \
  --sandbox \
  -c "model.name=\"$MODEL\"" \
  -c "supervisor.model.name=\"$MODEL\"" \
  -c "compression.model.name=\"$MODEL\""
