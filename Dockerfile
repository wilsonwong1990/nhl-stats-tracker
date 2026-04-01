# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage (nginx)
FROM nginx:alpine

# Copy custom nginx configuration (includes API proxies)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage into nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
