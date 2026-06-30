# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /go-server .

# Runtime stage
FROM gcr.io/distroless/static-debian12

COPY --from=builder /go-server /go-server

# Vercel routes traffic to port 80 by default (override via PORT)
EXPOSE 80

ENTRYPOINT ["/go-server"]
