# Build stage
FROM rust:1.96-slim-bookworm AS builder

WORKDIR /app

# Cache dependencies
COPY Cargo.toml ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Build the actual sources
COPY src ./src
RUN touch src/main.rs && cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/target/release/rust-server /usr/local/bin/rust-server

# Vercel routes traffic to port 80 by default (override via PORT)
EXPOSE 80

CMD ["rust-server"]
