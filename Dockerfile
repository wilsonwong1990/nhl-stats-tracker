# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
# This stage only contains the built files and the serve package
# All build dependencies are left behind in the builder stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static files
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Run the application
CMD ["serve", "-s", "dist", "-l", "3000"]
