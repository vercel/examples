# Build stage: compile the Go server
FROM golang:1.23-bookworm AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /browser .

# Runtime stage: Debian slim + system Chromium
FROM debian:bookworm-slim

# Install Chromium and the fonts/libraries it needs to render pages headlessly.
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      ca-certificates \
      fonts-liberation \
      fonts-noto-color-emoji \
      fonts-noto-cjk \
      libasound2 \
      libnss3 \
      libxss1 \
      libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Point chromedp at the system Chromium binary.
ENV CHROME_BIN=/usr/bin/chromium

# Note: we run as root so the server can bind the privileged port 80. Chromium
# is launched with --no-sandbox (set in the app) which is required when running
# headless Chromium as root inside a container.
WORKDIR /app

COPY --from=builder /browser /usr/local/bin/browser

# Vercel routes traffic to port 80 by default (override via PORT).
ENV PORT=80
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/browser"]
