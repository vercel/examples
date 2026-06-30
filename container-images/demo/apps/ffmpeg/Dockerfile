# Build stage
FROM golang:1.23-bookworm AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /ffmpeg-service .

# Runtime stage: Debian slim + ffmpeg/ffprobe
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /ffmpeg-service /usr/local/bin/ffmpeg-service

ENV PORT=80
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/ffmpeg-service"]
