# ChronoSync Project Overview

ChronoSync is a comprehensive time synchronization and scheduling application designed to work across multiple platforms including web, desktop, and mobile. The project is structured as a monorepo using Nx and PNPM workspaces, allowing for efficient code sharing and management across different platforms.

## Project Vision

ChronoSync aims to provide a seamless experience for users to manage their time, synchronize schedules, and collaborate with others across different devices and platforms. The application is designed to be:

- **Cross-platform**: Available on web, desktop (Windows, macOS, Linux), and mobile (Android, iOS)
- **User-friendly**: Intuitive interface with modern design principles
- **Secure**: Robust authentication and data protection
- **Scalable**: Built with technologies that can scale with user growth
- **Extensible**: Modular architecture that allows for easy feature additions

## Key Features

- **User Authentication**: Secure login with email/password and OAuth providers (Google, GitHub)
- **Profile Management**: User profile creation and management
- **Dashboard**: Personalized dashboard for authenticated users
- **RGPD Compliance**: Privacy policy and data protection measures

## Project Status

The project is currently in active development with the web application being the most mature component. The desktop and mobile applications are in the planning or early development stages.

### Current Focus Areas

1. **Web Application**:
   - Frontend: Vue.js 3 application with Pinia for state management
   - Backend: Express.js API with PostgreSQL database
   - Common: Shared utilities and types

2. **Infrastructure**:
   - CI/CD pipeline setup
   - Deployment configuration
   - Testing framework implementation

## Repository Structure

The project follows a monorepo structure with the following main directories:

```
chronosync/
├── packages/
│   ├── web/
│   │   ├── frontend/    # Vue.js frontend application
│   │   ├── backend/     # Express.js backend API
│   │   └── common/      # Shared utilities and types
│   ├── desktop/
│   │   ├── windows/     # Windows-specific implementation
│   │   ├── mac/         # macOS-specific implementation
│   │   └── linux/       # Linux-specific implementation
│   └── mobile/
│       ├── android/     # Android-specific implementation
│       └── ios/         # iOS-specific implementation
├── docs/                # Project documentation
└── ...                  # Root configuration files
```

For more detailed information about the project architecture, see the [Architecture](./architecture.md) document.

## Next Steps

To get started with the project:

1. Check out the [Prerequisites](../getting-started/prerequisites.md) to ensure your system is ready for development
2. Follow the [Installation Guide](../getting-started/installation.md) to set up the project
3. Read the [Development Environment Setup](../getting-started/development-setup.md) to configure your development environment

For contributors, please also review the [Contributing Guidelines](../contributing/guidelines.md) before submitting any code changes.
