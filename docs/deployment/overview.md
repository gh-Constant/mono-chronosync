# Deployment Overview

This document provides an overview of the deployment options and strategies for the ChronoSync application.

## Deployment Environments

ChronoSync can be deployed to various environments:

1. **Development**: Local development environment
2. **Staging**: Pre-production environment for testing
3. **Production**: Live environment for end users

## Deployment Architecture

The deployment architecture varies depending on the platform:

### Web Application Deployment

The web application consists of two main components:

1. **Frontend**: Static files served by a web server or CDN
2. **Backend**: Node.js application running the Express.js server

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Browser    │────►│  Web Server     │────►│  API Server     │
│  (Client)       │     │  (Frontend)     │     │  (Backend)      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │  Database       │
                                               │  (PostgreSQL)   │
                                               │                 │
                                               └─────────────────┘
```

### Desktop Application Deployment

The desktop application is packaged and distributed as a native application for each platform:

- Windows: `.exe` installer or portable executable
- macOS: `.dmg` or `.app` package
- Linux: `.deb`, `.rpm`, or AppImage

### Mobile Application Deployment

The mobile application is distributed through app stores:

- Android: Google Play Store
- iOS: Apple App Store

## Deployment Tools

ChronoSync uses the following tools for deployment:

### Web Deployment

- **Nixpacks**: Build system for cloud deployment
- **Docker**: Containerization for consistent deployment
- **GitHub Actions**: CI/CD pipeline for automated deployment
- **Nginx**: Web server for serving static files and proxying API requests

### Desktop Deployment

- **Electron Builder**: Packaging and distribution for desktop applications
- **Code Signing**: For security and trust on Windows and macOS

### Mobile Deployment

- **React Native CLI**: Building and packaging mobile applications
- **Fastlane**: Automation for mobile app deployment

## Environment Configuration

Environment-specific configuration is managed through environment variables:

### Web Backend Environment Variables

```
# Server settings
PORT=3005
NODE_ENV=production

# Database settings
DB_HOST=production-db-host
DB_PORT=5432
DB_NAME=chronosync
DB_USER=db-user
DB_PASSWORD=db-password

# JWT settings
JWT_SECRET=production-jwt-secret
JWT_EXPIRES_IN=7d

# CORS settings
CORS_ORIGIN=https://your-production-domain.com

# API URL for callbacks
API_URL=https://api.your-production-domain.com

# OAuth settings
GOOGLE_CLIENT_ID=production-google-client-id
GOOGLE_CLIENT_SECRET=production-google-client-secret
GITHUB_CLIENT_ID=production-github-client-id
GITHUB_CLIENT_SECRET=production-github-client-secret
```

### Web Frontend Environment Variables

```
# API URL
VITE_API_URL=https://api.your-production-domain.com

# Other frontend settings
VITE_APP_TITLE=ChronoSync
```

## Deployment Process

### Web Application Deployment

#### Frontend Deployment

1. Build the frontend:
   ```bash
   pnpm build:web:frontend
   ```

2. The build output is in `packages/web/frontend/dist`

3. Deploy the static files to a web server or CDN

#### Backend Deployment

1. Build the backend:
   ```bash
   pnpm build:web:backend
   ```

2. The build output is in `dist/packages/web/backend`

3. Deploy the Node.js application to a server

#### Combined Deployment with Nixpacks

ChronoSync includes a `nixpacks.toml` configuration for deploying both frontend and backend together:

```toml
[phases.setup]
cmds = ["npm install -g pnpm@10.6.1"]

[phases.install]
cmds = ["pnpm install --no-frozen-lockfile"]

[phases.build]
cmds = [
  "pnpm build:web:common",
  "pnpm build:web:backend", 
  "pnpm build:web:frontend"
]

[start]
cmd = "node /app/packages/web/backend/dist/index.js"
```

### Desktop Application Deployment

1. Build the desktop application:
   ```bash
   pnpm package:desktop
   ```

2. The packaged applications will be in the `dist/packages/desktop` directory

3. Distribute the installers or packages to users

### Mobile Application Deployment

1. Build the mobile application:
   ```bash
   pnpm package:mobile
   ```

2. The packaged applications will be in the `dist/packages/mobile` directory

3. Submit the packages to the respective app stores

## Continuous Integration and Deployment (CI/CD)

ChronoSync uses GitHub Actions for CI/CD:

1. **Continuous Integration**: Automatically run tests and linting on pull requests
2. **Continuous Deployment**: Automatically deploy to staging or production environments on merge to specific branches

The CI/CD pipeline is defined in `.github/workflows/` directory.

## Database Migration

When deploying updates that include database schema changes:

1. Create a migration script in `packages/web/backend/src/scripts/migrations/`
2. Run the migration as part of the deployment process:
   ```bash
   pnpm --filter @chronosync/backend run db:migrate
   ```

## Rollback Strategy

In case of deployment issues:

1. Keep the previous version's build artifacts
2. Have a quick rollback procedure documented
3. Use database migrations that can be reversed
4. Monitor the application after deployment for issues

## Monitoring and Logging

After deployment, monitor the application using:

1. Server logs
2. Application performance monitoring tools
3. Error tracking services
4. Database monitoring

## Further Reading

- [Web Deployment](./web.md) - Detailed instructions for web application deployment
- [Desktop Deployment](./desktop.md) - Detailed instructions for desktop application deployment
- [Mobile Deployment](./mobile.md) - Detailed instructions for mobile application deployment
- [CI/CD Workflow](../workflow/ci-cd.md) - Details about the CI/CD pipeline
