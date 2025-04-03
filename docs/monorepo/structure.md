# Monorepo Structure

ChronoSync is organized as a monorepo using Nx and PNPM workspaces. This document explains the structure of the monorepo and how different packages relate to each other.

## Directory Structure

The top-level directory structure of the ChronoSync monorepo is as follows:

```
chronosync/
├── .github/                # GitHub-specific files (workflows, templates)
├── .nx/                    # Nx cache and configuration
├── docs/                   # Project documentation
├── packages/               # All project packages
│   ├── desktop/            # Desktop application packages
│   │   ├── windows/        # Windows-specific implementation
│   │   ├── mac/            # macOS-specific implementation
│   │   └── linux/          # Linux-specific implementation
│   ├── mobile/             # Mobile application packages
│   │   ├── android/        # Android-specific implementation
│   │   └── ios/            # iOS-specific implementation
│   ├── shared/             # Shared utilities and components
│   └── web/                # Web application packages
│       ├── backend/        # Express.js backend API
│       ├── common/         # Shared web utilities and types
│       └── frontend/       # Vue.js frontend application
├── dist/                   # Build output directory
├── node_modules/           # Node.js dependencies
├── .env                    # Root environment variables
├── .gitignore              # Git ignore file
├── nx.json                 # Nx configuration
├── package.json            # Root package configuration
├── pnpm-lock.yaml          # PNPM lock file
├── pnpm-workspace.yaml     # PNPM workspace configuration
├── README.md               # Project README
└── tsconfig.base.json      # Base TypeScript configuration
```

## Package Structure

### Web Packages

The web application is divided into three main packages:

#### Frontend (`packages/web/frontend`)

The Vue.js frontend application:

```
packages/web/frontend/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── assets/             # Assets (images, styles, etc.)
│   ├── components/         # Vue components
│   ├── router/             # Vue Router configuration
│   ├── services/           # API services
│   ├── stores/             # Pinia stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   ├── views/              # Page components
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── .env                    # Environment variables
├── index.html              # HTML entry point
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── ...
```

#### Backend (`packages/web/backend`)

The Express.js backend API:

```
packages/web/backend/
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── interfaces/         # TypeScript interfaces
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── scripts/            # Utility scripts
│   ├── index.ts            # Application entry point
│   └── server.ts           # Express server setup
├── .env                    # Environment variables
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── ...
```

#### Common (`packages/web/common`)

Shared code between frontend and backend:

```
packages/web/common/
├── src/                    # Source code
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utility functions
│   ├── constants/          # Shared constants
│   └── index.ts            # Package entry point
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── ...
```

### Desktop Packages

The desktop application is divided into platform-specific packages:

```
packages/desktop/
├── windows/                # Windows-specific implementation
├── mac/                    # macOS-specific implementation
└── linux/                  # Linux-specific implementation
```

### Mobile Packages

The mobile application is divided into platform-specific packages:

```
packages/mobile/
├── android/                # Android-specific implementation
└── ios/                    # iOS-specific implementation
```

## Dependencies Between Packages

The dependencies between packages are defined in each package's `package.json` file and are managed by PNPM workspaces.

Key dependencies:

- **Frontend depends on Common**: `"@chronosync/common": "workspace:*"`
- **Backend depends on Common**: `"@chronosync/common": "workspace:*"`
- **Desktop packages may depend on Common**: For shared business logic
- **Mobile packages may depend on Common**: For shared business logic

## PNPM Workspace Configuration

The PNPM workspace is configured in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'
  - 'packages/web/backend'
  - 'packages/web/common'
  - 'packages/web/frontend'
  - 'packages/desktop/windows'
  - 'packages/desktop/mac'
  - 'packages/desktop/linux'
  - 'packages/mobile/android'
  - 'packages/mobile/ios'
```

This configuration tells PNPM which directories contain packages that should be included in the workspace.

## Nx Configuration

The Nx workspace is configured in `nx.json`:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "affected": {
    "defaultBase": "main"
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "lint": {
      "inputs": [
        "default",
        "{workspaceRoot}/.eslintrc.json",
        "{workspaceRoot}/.eslintignore"
      ]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": []
  },
  "workspaceLayout": {
    "appsDir": "packages",
    "libsDir": "packages"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test"]
      }
    }
  }
}
```

This configuration defines how Nx manages the workspace, including:

- Build dependencies between packages
- Caching configuration
- Workspace layout
- Default task runner options

## Build Output

When packages are built, the output is placed in the `dist` directory:

```
dist/
├── packages/
│   ├── web/
│   │   ├── backend/        # Compiled backend code
│   │   ├── common/         # Compiled common code
│   │   └── frontend/       # Compiled frontend code
│   ├── desktop/            # Compiled desktop applications
│   └── mobile/             # Compiled mobile applications
```

## Further Reading

- [Nx Workspace](./nx-workspace.md) - More details about the Nx configuration
- [Package Management](./package-management.md) - How dependencies are managed in the monorepo
- [Development Workflow](../workflow/development.md) - How to work with the monorepo structure
