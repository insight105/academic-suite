# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./ 

# Install dependencies (using npm for stability, though bun.lockb suggests bun might be used, but package-lock exists too)
# Since package-lock.json exists, we use npm ci
RUN npm ci

# Copy source
COPY . .

# Build with VITE_API_URL set to /api for relative path proxying
ENV VITE_API_URL=/api
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
