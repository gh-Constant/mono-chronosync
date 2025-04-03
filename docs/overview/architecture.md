# ChronoSync Architecture

This document provides an overview of the ChronoSync application architecture, explaining how different components interact with each other.

## High-Level Architecture

ChronoSync follows a multi-tier architecture with separate frontend and backend components, connected through RESTful APIs. The application is designed to work across multiple platforms (web, desktop, mobile) while sharing core business logic and data models.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                    │
├───────────────┬───────────────────────┬─────────────────────┤
│  Web Frontend │    Desktop Clients    │   Mobile Clients    │
│   (Vue.js)    │ (Windows,macOS,Linux) │  (Android, iOS)     │
└───────┬───────┴──────────┬────────────┴──────────┬──────────┘
        │                  │                       │
        │                  │                       │
        ▼                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       RESTful API                           │
├─────────────────────────────────────────────────────────────┤
│                    Backend Services                         │
│                      (Express.js)                           │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Storage                           │
├─────────────────────────────────────────────────────────────┤
│                     PostgreSQL Database                     │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo Architecture

The project is structured as a monorepo using Nx and PNPM workspaces, which allows for:

- **Code Sharing**: Common code can be shared across different applications
- **Consistent Tooling**: Same build, test, and linting tools across all packages
- **Atomic Changes**: Changes that span multiple packages can be made in a single commit
- **Dependency Management**: Centralized management of dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                      Monorepo (Nx)                          │
├───────────────┬───────────────────────┬─────────────────────┤
│  Web Package  │   Desktop Package     │   Mobile Package    │
├───────┬───────┼───────────┬───────────┼───────────┬─────────┤
│Frontend│Backend│  Windows  │   macOS   │  Android  │   iOS   │
└───────┴───────┴───────────┴───────────┴───────────┴─────────┘
             │                                │
             └────────────────┬──────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │Common Package │
                      └───────────────┘
```

## Web Application Architecture

### Frontend Architecture (Vue.js)

The web frontend follows the Vue.js component-based architecture with Pinia for state management:

```
┌─────────────────────────────────────────────────────────────┐
│                      Vue.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    Views    │    │  Components │    │   Layouts   │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
│                            ▼                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Router    │◄───┤    Pinia    │    │   Services  │     │
│  │  (Vue Router)│    │   (Store)   │◄───┤  (API, etc) │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture (Express.js)

The backend follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Routes    │───►│ Controllers │───►│  Services   │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│                                               │            │
│                                               ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Middlewares │    │   Config    │    │   Models    │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│                                               │            │
│                                               ▼            │
│                                        ┌─────────────┐     │
│                                        │  Database   │     │
│                                        │ (PostgreSQL)│     │
│                                        └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

ChronoSync supports multiple authentication methods:

1. **Email/Password Authentication**:
   - User credentials are validated against the database
   - JWT token is generated and returned to the client

2. **OAuth Authentication (Google, GitHub)**:
   - User is redirected to the OAuth provider
   - Provider redirects back with an authorization code
   - Backend exchanges the code for access token
   - User information is retrieved and a JWT token is generated

```
┌─────────┐                  ┌─────────┐                 ┌───────────────┐
│ Client  │                  │ Backend │                 │ OAuth Provider│
└────┬────┘                  └────┬────┘                 └───────┬───────┘
     │                            │                              │
     │ 1. Request OAuth Login     │                              │
     │ -------------------------► │                              │
     │                            │ 2. Redirect to Provider      │
     │ ◄--------------------------|                              │
     │                            │                              │
     │ 3. Redirect to Provider                                   │
     │ --------------------------------------------------------► │
     │                            │                              │
     │                            │                              │
     │ 4. Authenticate & Authorize│                              │
     │ ◄-------------------------------------------------------- │
     │                            │                              │
     │ 5. Redirect with Code      │                              │
     │ -------------------------► │                              │
     │                            │ 6. Exchange Code for Token   │
     │                            │ ---------------------------► │
     │                            │                              │
     │                            │ 7. Return Access Token       │
     │                            │ ◄--------------------------- │
     │                            │                              │
     │                            │ 8. Get User Info             │
     │                            │ ---------------------------► │
     │                            │                              │
     │                            │ 9. Return User Info          │
     │                            │ ◄--------------------------- │
     │ 10. Return JWT Token       │                              │
     │ ◄------------------------- │                              │
     │                            │                              │
```

## Data Flow

The data flow in ChronoSync follows a typical client-server pattern:

1. **Client to Server**:
   - HTTP requests from client to server
   - Authentication via JWT tokens
   - Data validation on both client and server

2. **Server to Database**:
   - Database queries through PostgreSQL client
   - Data transformation and business logic in services
   - Error handling and response formatting

3. **Server to Client**:
   - RESTful API responses
   - JSON data format
   - Error codes and messages

## Cross-Platform Strategy

ChronoSync achieves cross-platform compatibility through:

1. **Shared Business Logic**: Common package contains shared types, utilities, and business logic
2. **Platform-Specific UI**: Each platform has its own UI implementation
3. **Consistent API**: All clients communicate with the same backend API

## Further Reading

- [Technology Stack](./technology-stack.md) - Detailed information about the technologies used
- [Web Frontend Overview](../web/frontend/overview.md) - More details about the frontend architecture
- [Web Backend Overview](../web/backend/overview.md) - More details about the backend architecture
- [Common Package Overview](../web/common/overview.md) - Information about shared code
