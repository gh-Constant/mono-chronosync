# Technology Stack

ChronoSync uses a modern technology stack designed for performance, developer experience, and cross-platform compatibility. This document provides an overview of the technologies used in different parts of the application.

## Core Technologies

### Monorepo Management

- **Nx**: Build system and project management tool for monorepos
- **PNPM**: Fast, disk space efficient package manager with workspace support

### Languages

- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **JavaScript**: For scripts and configuration files

### Version Control

- **Git**: Distributed version control system
- **GitHub**: Hosting platform for version control and collaboration

## Frontend Technologies

### Web Frontend

- **Framework**: Vue.js 3 - Progressive JavaScript framework
- **Build Tool**: Vite - Next generation frontend tooling
- **State Management**: Pinia - Intuitive, type safe store for Vue
- **Routing**: Vue Router - Official router for Vue.js
- **HTTP Client**: Axios - Promise based HTTP client
- **UI Components**: Custom components with Lucide icons
- **3D Visualization**: Three.js with TresJS - 3D library for Vue
- **Animation**: GSAP - Professional-grade animation for the modern web

### Desktop Frontend

- **Electron**: Framework for creating native applications with web technologies
- **Platform-specific modules** for Windows, macOS, and Linux

### Mobile Frontend

- **React Native**: Framework for building native apps using React
- **Platform-specific modules** for Android and iOS

## Backend Technologies

### Web Backend

- **Framework**: Express.js - Fast, unopinionated, minimalist web framework for Node.js
- **Database**: PostgreSQL - Powerful, open source object-relational database
- **Authentication**: 
  - JWT (JSON Web Tokens) for stateless authentication
  - Passport.js for OAuth integration (Google, GitHub)
- **Environment Variables**: dotenv - Loads environment variables from .env file
- **Validation**: Zod - TypeScript-first schema validation with static type inference
- **Database Migration**: Custom migration scripts

## Development & Testing Tools

### Code Quality

- **Linting**: 
  - ESLint - Pluggable JavaScript linter
  - Oxlint - Fast JavaScript linter
- **Formatting**: Prettier - Opinionated code formatter
- **Type Checking**: TypeScript compiler

### Testing

- **Unit Testing**: Vitest - Vite-native test framework
- **UI Testing**: (To be implemented)
- **API Testing**: (To be implemented)

### Development Tools

- **Hot Reloading**: Vite and Nodemon for development
- **Debugging**: Built-in Node.js and browser debugging tools
- **API Documentation**: (To be implemented)

## DevOps & Deployment

### CI/CD

- **GitHub Actions**: Automated workflows for testing and deployment
- **Discord Notifications**: Automated notifications for repository events

### Deployment

- **Nixpacks**: Build system for cloud deployment
- **Environment Configuration**: Environment variables for different deployment environments

## Version Compatibility

| Technology      | Version       | Notes                                |
|-----------------|---------------|--------------------------------------|
| Node.js         | 16+           | Required for development             |
| PNPM            | 8+            | Required for package management      |
| TypeScript      | 5.3.3+        | Used across the project              |
| Vue.js          | 3.4.15+       | Frontend framework                   |
| Express.js      | 4.18.2+       | Backend framework                    |
| PostgreSQL      | 8.13.3+       | Database                             |
| Nx              | 20.5.0+       | Monorepo management                  |
| Vite            | 6.0.0+        | Frontend build tool                  |

## Technology Selection Rationale

### Why Vue.js?

Vue.js was chosen for its:
- Progressive framework approach
- Excellent performance
- Composition API for better TypeScript integration
- Strong community support
- Ease of integration with other libraries

### Why Express.js?

Express.js was selected because:
- Minimalist and flexible framework
- Large ecosystem of middleware
- Easy to learn and use
- Great performance
- Excellent TypeScript support

### Why PostgreSQL?

PostgreSQL was chosen for:
- Robust feature set
- Strong data integrity
- Support for complex queries
- Excellent performance
- Open-source with strong community

### Why Nx?

Nx provides:
- Excellent monorepo management
- Built-in support for various frameworks
- Powerful caching for faster builds
- Dependency graph visualization
- Consistent tooling across packages

## Further Reading

- [Web Frontend Overview](../web/frontend/overview.md) - More details about frontend technologies
- [Web Backend Overview](../web/backend/overview.md) - More details about backend technologies
- [Development Workflow](../workflow/development.md) - How these technologies are used in development
