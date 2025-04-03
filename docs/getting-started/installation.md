# Installation Guide

This guide will walk you through the process of setting up the ChronoSync project on your local machine for development.

## Prerequisites

Before proceeding, ensure you have met all the [prerequisites](./prerequisites.md) for the project.

## Clone the Repository

1. Open your terminal or command prompt
2. Clone the repository using Git:

```bash
git clone https://github.com/yourusername/chronosync.git
cd chronosync
```

Replace `yourusername` with the actual GitHub username or organization where the repository is hosted.

## Install Dependencies

ChronoSync uses PNPM for package management with workspaces. To install all dependencies:

```bash
pnpm install
# or
pnpm setup
```

This command will install dependencies for all packages in the monorepo.

## Environment Configuration

### Create Environment Files

1. Create a `.env` file in the root directory:

```bash
touch .env
```

2. Create a `.env` file in the web backend directory:

```bash
touch packages/web/backend/.env
```

3. Create a `.env` file in the web frontend directory:

```bash
touch packages/web/frontend/.env
```

### Configure Environment Variables

#### Root `.env` File

```
# Node environment
NODE_ENV=development

# Nx settings
NX_DAEMON=false
```

#### Backend `.env` File

```
# Server settings
PORT=3005
NODE_ENV=development

# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chronosync
DB_USER=postgres
DB_PASSWORD=your_password

# JWT settings
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS settings
CORS_ORIGIN=http://localhost:4173

# API URL for callbacks
API_URL=http://localhost:3005/api

# OAuth settings (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Frontend `.env` File

```
# API URL
VITE_API_URL=http://localhost:3005/api

# Other frontend settings
VITE_APP_TITLE=ChronoSync
```

Replace placeholder values with your actual configuration.

## Database Setup

### Create PostgreSQL Database

1. Start your PostgreSQL server
2. Create a new database:

```bash
psql -U postgres -c "CREATE DATABASE chronosync;"
```

### Initialize Database Schema

Run the database initialization script:

```bash
pnpm --filter @chronosync/backend run init-db
```

## Build Common Package

Before running the application, build the common package which is shared between frontend and backend:

```bash
pnpm build:web:common
```

## Verify Installation

To verify that everything is set up correctly:

```bash
# Check Nx
pnpm nx --version

# List all projects in the workspace
pnpm nx show projects
```

You should see a list of all projects in the monorepo.

## Troubleshooting Installation Issues

### Dependency Installation Errors

If you encounter errors during dependency installation:

1. Delete the `node_modules` directory and `pnpm-lock.yaml` file:
```bash
rm -rf node_modules
rm pnpm-lock.yaml
```

2. Clear the PNPM store:
```bash
pnpm store prune
```

3. Try installing again:
```bash
pnpm install
```

### Database Connection Issues

If you have trouble connecting to the database:

1. Verify PostgreSQL is running:
```bash
pg_isready
```

2. Check your database credentials in the `.env` file
3. Ensure the database exists:
```bash
psql -U postgres -c "\l" | grep chronosync
```

### Build Errors

If you encounter errors during the build process:

1. Check for TypeScript errors:
```bash
pnpm nx run-many --target=type-check --all
```

2. Try building packages individually:
```bash
pnpm build:web:common
pnpm build:web:backend
pnpm build:web:frontend
```

## Next Steps

Now that you have installed the ChronoSync project, you can:

1. Learn how to [run the application](./running-the-app.md)
2. Set up your [development environment](./development-setup.md)
3. Explore the [project structure](../monorepo/structure.md)
