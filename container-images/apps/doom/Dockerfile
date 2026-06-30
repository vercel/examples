# Build stage
FROM golang:1.23-bookworm AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /doom-service .

# Runtime stage: virtual X display + Doom engine + frame grabber
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      xvfb \
      chocolate-doom \
      freedoom \
      xdotool \
      ffmpeg \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# FreeDOOM is a free, redistributable IWAD.
ENV DOOM_WAD=/usr/share/games/doom/freedoom1.wad
ENV DOOM_BIN=/usr/games/chocolate-doom
# chocolate-doom installs under /usr/games which is not on the default PATH.
ENV PATH=/usr/games:$PATH
ENV DISPLAY=:99

COPY --from=builder /doom-service /usr/local/bin/doom-service

ENV PORT=80
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/doom-service"]
