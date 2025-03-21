FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.6.1

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy app source
COPY . .

# Build TypeScript
RUN pnpm run build

# Add health check endpoint
RUN echo 'app.get("/api/health", (req, res) => res.status(200).send("OK"));' >> src/index.ts

# Expose the port
EXPOSE 3005

# Start the application
CMD ["pnpm", "run", "start"] 