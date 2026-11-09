#!/usr/bin/env bash
# Builds the BenchUp browser editor from a pinned upstream release into ./public.
# Vercel runs this as the Build Command. It also runs locally on x86_64 Linux,
# for example inside the Amazon Linux 2023 image that Vercel's build image is based on.
set -euo pipefail

BENCHUP_REF="${BENCHUP_REF:-v0.6.6}"   # upstream tag or commit SHA
TRUNK_VERSION="${TRUNK_VERSION:-0.22.0}"
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/.benchup-src"
OUT="$HERE/public"

# A C toolchain is needed to link Cargo build scripts on the host.
if ! command -v cc >/dev/null 2>&1; then
  dnf install -y gcc
fi

# Rust with the WebAssembly target (BenchUp needs Rust 1.95 or newer).
export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}" RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}"
export PATH="$CARGO_HOME/bin:$PATH"
if ! command -v cargo >/dev/null 2>&1; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y --profile minimal --default-toolchain stable --no-modify-path
fi
rustup target add wasm32-unknown-unknown

# Prebuilt, statically linked Trunk binary (same version upstream uses for its own browser
# build). The musl build avoids the newer glibc that the gnu build needs.
if ! trunk --version 2>/dev/null | grep -q "$TRUNK_VERSION"; then
  curl -sSfL "https://github.com/trunk-rs/trunk/releases/download/v${TRUNK_VERSION}/trunk-x86_64-unknown-linux-musl.tar.gz" \
    | tar -xz -C "$CARGO_HOME/bin" trunk
fi

# Fetch the upstream source at the pinned ref. No upstream code lives in this example.
rm -rf "$SRC" "$OUT"
mkdir -p "$SRC"
curl -sSfL "https://github.com/BenchUp3D/editor/archive/${BENCHUP_REF}.tar.gz" \
  | tar -xz --strip-components=1 -C "$SRC"

# The build script reads these at compile time. Pin the update feed to the official
# repository instead of guessing it from git, and build without an account server.
export BENCHUP_UPDATE_REPOSITORY="BenchUp3D/editor"
unset BENCHUP_SERVER_URL KETCHUP_SERVER_URL

cd "$SRC"
trunk build --release --locked --dist "$OUT" --public-url /
rm -f "$OUT/.trunk-lock"
test -f "$OUT/index.html"
test -n "$(find "$OUT" -name '*.wasm' -print -quit)"
echo "BenchUp ${BENCHUP_REF} built into public/"
