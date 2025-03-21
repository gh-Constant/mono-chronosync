FROM node:20-alpine

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

# Copy the backend package
COPY . ./packages/web/backend

# Set workdir to backend folder
WORKDIR /app/packages/web/backend

# Install dependencies from the root
RUN cd /app && pnpm install

# Build common package first
RUN cd /app/packages/web/common && pnpm run build

# Build the backend
RUN pnpm run build

# Add health check endpoint
RUN echo 'app.get("/api/health", (req, res) => res.status(200).send("OK"));' >> src/index.ts

# Expose the port
EXPOSE 3005

# Start the application
CMD ["pnpm", "run", "start"] 