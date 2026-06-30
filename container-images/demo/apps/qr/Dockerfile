# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /qr-service .

# Runtime stage
FROM gcr.io/distroless/static-debian12

COPY --from=builder /qr-service /qr-service

ENV PORT=80
EXPOSE 80

ENTRYPOINT ["/qr-service"]
