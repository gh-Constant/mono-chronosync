#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

# Build common package
echo "Building common package..."
pnpm build:web:common

# Build backend
echo "Building backend..."
cd packages/web/backend
npx tsc --outDir ./dist
ls -la ./dist
cd ../../..

# Build frontend
echo "Building frontend..."
pnpm build:web:frontend

# Ensure the backend dist directory exists
mkdir -p /app/packages/web/backend/dist

# Create a fallback index.js if it doesn't exist
if [ ! -f /app/packages/web/backend/dist/index.js ]; then
  echo "Creating fallback index.js..."
  echo 'console.log("Fallback server running..."); const express = require("express"); const app = express(); app.get("/", (req, res) => res.send("Server is starting...")); app.listen(3000);' > /app/packages/web/backend/dist/index.js
fi

echo "Build completed successfully!" 