# ChronoSync

This is a monorepo for the ChronoSync project managed with Nx and PNPM workspaces.

## Project Structure

- `packages/desktop`: Desktop application
- `packages/mobile`: Mobile application
- `packages/shared`: Shared utilities and components
- `packages/web`: Web application
  - `packages/web/backend`: Backend API
  - `packages/web/common`: Common web utilities
  - `packages/web/frontend`: Frontend application

## Getting Started

### Prerequisites

- Node.js 16+
- PNPM 8+

### Installation

```bash
pnpm setup
```

### Development

Start the web app:
```bash
pnpm dev
# or
nx run web:dev
```

Start a specific application:
```bash
# Web frontend
pnpm dev:web:frontend
# or
nx run web-frontend:dev

# Web backend
pnpm dev:web:backend
# or
nx run web-backend:dev

# Desktop
pnpm dev:desktop
# or
nx run desktop:dev

# Mobile
pnpm dev:mobile
# or
nx run mobile:dev
```

### Build

Build all projects:
```bash
pnpm build
# or
nx run-many --target=build --all
```

Build a specific project:
```bash
nx run web:build
# or for other projects
nx run desktop:build
nx run mobile:build
nx run web-frontend:build
nx run web-backend:build
```

### Dependency Graph

View the dependency graph of the monorepo:
```bash
pnpm graph
# or
nx graph
```

## Using Nx Cache

Nx provides caching for your tasks, making subsequent runs faster:

```bash
# Run tests for affected projects only
nx affected --target=test
``` 