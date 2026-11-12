#!/bin/sh
# Build TinyGPT Visualizer's in-browser app from a pinned upstream commit into ./dist.
# Vercel runs this as the build command (see vercel.json). It also works locally: `sh build.sh`.
set -eu

# Upstream has no tagged releases, so pin a commit (code) and a Hugging Face revision (model).
TINYGPT_COMMIT="${TINYGPT_COMMIT:-7b681b1fbe4a8c114acb7961507b10c6dadef4b8}"
MODEL_REVISION="${MODEL_REVISION:-5c517c5339e7a7a584c9c08c0a06411991cac991}"
VITE_MODEL_URL="${VITE_MODEL_URL:-https://huggingface.co/oshea00/tinygpt-viz/resolve/$MODEL_REVISION/web/bpe-small/}"

rm -rf .upstream dist
mkdir .upstream
echo "Fetching oshea00/tinygpt-viz@$TINYGPT_COMMIT"
curl -fsSL "https://codeload.github.com/oshea00/tinygpt-viz/tar.gz/$TINYGPT_COMMIT" \
  | tar -xz -C .upstream --strip-components=1

cd .upstream/ui
npm ci --no-audit --no-fund
# VITE_BACKEND=local runs the model in the browser (WebGPU, or the CPU without it); no server needed.
VITE_BACKEND=local VITE_MODEL_URL="$VITE_MODEL_URL" npx vite build --outDir ../../dist --emptyOutDir
# The guide and the in-app help panels read their Markdown from /docs.
cp -r ../docs ../../dist/docs
echo "Built dist/ (model: $VITE_MODEL_URL)"
