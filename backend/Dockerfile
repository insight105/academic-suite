# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy dependencies first for caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
# CGO_ENABLED=0 is usually safe for alpine unless using SQLite with CGO
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Run Stage
FROM alpine:latest

WORKDIR /app

# Add certificates and timezone data
RUN apk --no-cache add ca-certificates tzdata

# Set Timezone (Common for ID)
ENV TZ=Asia/Jakarta

# Copy binary from builder
COPY --from=builder /app/main .

# Expose port
EXPOSE 8060

# Command to run
CMD ["./main"]
