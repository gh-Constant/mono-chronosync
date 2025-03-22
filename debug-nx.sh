#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ChronoSync NX Debugging Script ===${NC}"
echo -e "${YELLOW}This script will diagnose and attempt to fix NX build issues${NC}"

# Check Node version
echo -e "${GREEN}[1] Checking Node version...${NC}"
node --version
npm --version 
pnpm --version

# Check if NX is globally installed
echo -e "${GREEN}[2] Checking NX installation...${NC}"
if ! command -v nx &> /dev/null; then
    echo -e "${YELLOW}NX not found globally, installing...${NC}"
    npm install -g nx
else
    echo -e "${GREEN}NX is installed globally: $(nx --version)${NC}"
fi

# Clean NX cache
echo -e "${GREEN}[3] Cleaning NX cache...${NC}"
rm -rf .nx || echo "No .nx directory found"
rm -rf node_modules/.cache/nx || echo "No nx cache in node_modules"

# Check pnpm workspace configuration
echo -e "${GREEN}[4] Checking pnpm workspace configuration...${NC}"
cat pnpm-workspace.yaml

# Check if common package exists
echo -e "${GREEN}[5] Checking for @chronosync/common package...${NC}"
if [ -d "packages/web/common" ]; then
    echo -e "${GREEN}@chronosync/common exists${NC}"
    ls -la packages/web/common
else
    echo -e "${RED}@chronosync/common package not found!${NC}"
    exit 1
fi

# Check node_modules status
echo -e "${GREEN}[6] Checking node_modules...${NC}"
if [ -d "node_modules/@chronosync" ]; then
    echo -e "${GREEN}@chronosync packages are linked in node_modules${NC}"
else
    echo -e "${YELLOW}No @chronosync packages found in node_modules, trying to fix...${NC}"
    rm -rf node_modules
    pnpm install
fi

# Try building with increased memory
echo -e "${GREEN}[7] Attempting to build common package with increased memory...${NC}"
export NODE_OPTIONS="--max-old-space-size=4096"
export NX_DAEMON=false
pnpm build:web:common || echo -e "${RED}Common build failed${NC}"

echo -e "${GREEN}[8] Attempting to build backend package...${NC}"
pnpm build:web:backend || echo -e "${RED}Backend build failed${NC}"

echo -e "${GREEN}[9] Attempting to build frontend package...${NC}"
pnpm build:web:frontend || echo -e "${RED}Frontend build failed${NC}"

# Suggestion for direct build without NX
echo -e "${YELLOW}If the NX builds continue to fail, try using the fallback Dockerfile:${NC}"
echo -e "docker-compose -f docker-compose.yaml build --no-cache"

echo -e "${GREEN}Debug information completed!${NC}"

# Try to fix common issues
echo -e "${GREEN}Would you like to try the fallback build approach? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}Switching to fallback build...${NC}"
    cp Dockerfile.fallback Dockerfile
    echo -e "${GREEN}Fallback Dockerfile is now active. Try building again with:${NC}"
    echo -e "docker-compose build --no-cache"
fi 