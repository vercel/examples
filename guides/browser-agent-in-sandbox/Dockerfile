# Prebuilt sandbox image for faster cold starts, built FROM the official `browse`
# CLI image so the agent route can skip the per-request `npm install -g browse`.
#
# Build and push to your project's Vercel Container Registry, then set
# BROWSE_VCR_IMAGE to the pushed tag (see the README "Template image" section).
#
# Vercel Sandbox ignores ENTRYPOINT/CMD — the runtime drives the container — so
# we only need the CLI on PATH.
FROM ghcr.io/browserbase/browse:latest
WORKDIR /work
