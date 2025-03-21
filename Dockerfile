# Base stage for dependencies and build
FROM node:20-alpine AS base

# Set environment variables
ENV NODE_ENV=production
ENV NX_DAEMON=false
ENV NX_VERBOSE_LOGGING=true

# Install pnpm
RUN npm install -g pnpm@10.6.1 nx

# Set working directory
WORKDIR /app

# Copy package files 
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json nx.json ./

# Copy source code
COPY packages ./packages

# Install all dependencies with verbose logging
RUN pnpm install --no-frozen-lockfile

# Check package structure for debugging
RUN ls -la && ls -la packages && ls -la packages/web && ls -la packages/web/common

# Build common package first
FROM base AS common-builder
# Add verbose output for debugging
RUN echo "Building @chronosync/common package..."
RUN pnpm build:web:common || (echo "Common build failed with error code $?" && exit 1)
RUN echo "Common package built successfully"

# Build backend 
FROM common-builder AS backend-builder
# Add verbose output for debugging
RUN echo "Building backend package..."
# Install any backend-specific dependencies if needed
RUN cd packages/web/backend && pnpm install --no-frozen-lockfile
# Try building with direct nx command for more debugging info
RUN nx build web-backend --verbose || (echo "Backend build failed with error code $?" && exit 1)
RUN echo "Backend package built successfully"

# Build frontend
FROM common-builder AS frontend-builder
# Add verbose output for debugging
RUN echo "Building frontend package..."
# Install any frontend-specific dependencies if needed
RUN cd packages/web/frontend && pnpm install --no-frozen-lockfile
# Try building with direct nx command for more debugging info
RUN nx build web-frontend --verbose || (echo "Frontend build failed with error code $?" && exit 1)
RUN echo "Frontend package built successfully"

# Backend production image
FROM node:20-alpine AS backend

WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=backend-builder /app/package.json /app/
COPY --from=backend-builder /app/pnpm-lock.yaml /app/
COPY --from=backend-builder /app/dist /app/dist
COPY --from=backend-builder /app/node_modules /app/node_modules

# Add health check endpoint
RUN echo 'app.get("/api/health", (req, res) => res.status(200).send("OK"));' >> /app/dist/packages/web/backend/index.js

# Expose the port
EXPOSE 3005

# Start the application
CMD ["node", "dist/packages/web/backend/index.js"]

# Frontend production image
FROM nginx:alpine AS frontend

# Copy built assets from the builder
COPY --from=frontend-builder /app/packages/web/frontend/dist /usr/share/nginx/html

# Add nginx configuration for SPA
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Use default nginx configuration
CMD ["nginx", "-g", "daemon off;"] 