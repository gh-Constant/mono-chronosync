# ChronoSync

This is a monorepo for the ChronoSync project managed with Nx and PNPM workspaces.

## Project Structure

- `packages/desktop`: Desktop application
  - `packages/desktop/windows`: Windows-specific implementation
  - `packages/desktop/mac`: macOS-specific implementation
  - `packages/desktop/linux`: Linux-specific implementation
- `packages/mobile`: Mobile application
  - `packages/mobile/android`: Android-specific implementation
  - `packages/mobile/ios`: iOS-specific implementation
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

# Desktop (general)
pnpm dev:desktop
# or
nx run desktop:dev

# Desktop platform-specific
pnpm dev:desktop:windows
pnpm dev:desktop:mac
pnpm dev:desktop:linux
# or
nx run desktop-windows:dev
nx run desktop-mac:dev
nx run desktop-linux:dev

# Mobile (general)
pnpm dev:mobile
# or
nx run mobile:dev

# Mobile platform-specific
pnpm dev:mobile:android
pnpm dev:mobile:ios
# or
nx run mobile-android:dev
nx run mobile-ios:dev
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
nx run desktop-windows:build
nx run desktop-mac:build
nx run desktop-linux:build
nx run mobile-android:build
nx run mobile-ios:build
```

### Package for Distribution

Package all projects:
```bash
pnpm package
```

Package platform-specific apps:
```bash
pnpm package:desktop
pnpm package:mobile
# or
nx run desktop-windows:package
nx run desktop-mac:package
nx run desktop-linux:package
nx run mobile-android:package
nx run mobile-ios:package
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