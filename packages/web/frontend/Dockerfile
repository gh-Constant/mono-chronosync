# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.6.1

# Copy the root package.json, pnpm-workspace.yaml, and pnpm-lock.yaml
COPY ../../package.json ./
COPY ../../pnpm-workspace.yaml ./
COPY ../../pnpm-lock.yaml ./

# Copy the common package
COPY ../common ./packages/web/common

# Copy the frontend package
COPY . ./packages/web/frontend

# Install dependencies from the root
RUN pnpm install

# Build common package first
RUN cd /app/packages/web/common && pnpm run build

# Build the frontend
WORKDIR /app/packages/web/frontend
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/packages/web/frontend/dist /usr/share/nginx/html

# Add nginx configuration for SPA
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Use default nginx configuration
CMD ["nginx", "-g", "daemon off;"] 