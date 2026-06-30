# Build stage: compile the Rust crate to WebAssembly with wasm-pack
FROM rust:1.96-slim-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install wasm-pack (handles wasm-bindgen + wasm32 target setup)
RUN cargo install wasm-pack --locked

WORKDIR /app

COPY Cargo.toml ./
COPY src ./src

# Outputs ESM glue + .wasm into ./www/pkg (wasm_app.js, wasm_app_bg.wasm)
RUN wasm-pack build --release --target web --out-dir www/pkg

COPY www/index.html ./www/index.html

# Runtime stage: serve the static assets with nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/www/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
