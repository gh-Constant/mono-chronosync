# Web Backend Overview

The ChronoSync web backend is built with Express.js and TypeScript, providing a RESTful API for the frontend applications. It handles authentication, database operations, and business logic.

## Technology Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Passport.js for OAuth strategies
- **Environment Variables**: dotenv
- **Validation**: Zod
- **Database Access**: Node-postgres (pg)

## Project Structure

The backend follows a modular structure for maintainability and scalability:

```
packages/web/backend/
├── src/
│   ├── config/             # Configuration files
│   │   ├── database.ts     # Database configuration
│   │   ├── passport.ts     # Passport.js configuration
│   │   └── index.ts        # General configuration
│   ├── controllers/        # Request handlers
│   ├── interfaces/         # TypeScript interfaces
│   ├── middlewares/        # Express middlewares
│   │   ├── auth.ts         # Authentication middleware
│   │   └── rgpdMiddleware.ts # RGPD compliance middleware
│   ├── models/             # Database models and schemas
│   │   └── database.sql    # SQL schema definition
│   ├── routes/             # API route definitions
│   │   ├── auth.ts         # Authentication routes
│   │   ├── health.ts       # Health check routes
│   │   ├── rgpd.ts         # RGPD-related routes
│   │   └── index.ts        # Route aggregation
│   ├── services/           # Business logic
│   │   └── authService.ts  # Authentication service
│   ├── utils/              # Utility functions
│   │   └── auth.ts         # Authentication utilities
│   ├── scripts/            # Utility scripts
│   │   ├── initDb.ts       # Database initialization
│   │   └── migrate.ts      # Database migration
│   ├── index.ts            # Application entry point
│   └── server.ts           # Express server setup
├── .env                    # Environment variables
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── ...
```

## Key Components

### Server Setup

The server is initialized in `src/server.ts` with the following key features:

- Express application setup
- Middleware configuration
- Database initialization
- Passport.js configuration
- Route mounting

### API Routes

The API routes are defined in the `src/routes` directory:

- `/api/health`: Health check endpoints
- `/api/auth`: Authentication endpoints
- `/api/rgpd`: RGPD compliance endpoints

### Database Integration

The backend connects to a PostgreSQL database:

- Connection configuration in `src/config/database.ts`
- Database initialization in `src/scripts/initDb.ts`
- Schema definition in `src/models/database.sql`
- Query execution through the `query` function

### Authentication System

The backend implements a comprehensive authentication system:

1. **Traditional Authentication**:
   - Email/password registration and login
   - Password hashing and verification
   - JWT token generation and validation

2. **OAuth Authentication**:
   - Google OAuth integration
   - GitHub OAuth integration
   - User profile creation from OAuth data

3. **Authentication Middleware**:
   - JWT verification middleware
   - Role-based access control

### Error Handling

The backend includes centralized error handling:

- Custom error classes
- Error middleware for consistent responses
- Validation error handling

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login with email and password
- `GET /api/auth/profile`: Get the current user's profile
- `GET /api/auth/google`: Initiate Google OAuth flow
- `GET /api/auth/google/callback`: Handle Google OAuth callback
- `GET /api/auth/github`: Initiate GitHub OAuth flow
- `GET /api/auth/github/callback`: Handle GitHub OAuth callback

### Health Check Endpoints

- `GET /api/health`: Check API health status

### RGPD Endpoints

- `GET /api/rgpd/privacy-policy`: Get privacy policy information
- `POST /api/rgpd/consent`: Record user consent

## Database Schema

The database schema includes tables for:

- Users
- OAuth accounts
- User preferences
- RGPD consent records

## Environment Configuration

The backend uses environment variables for configuration:

- Server settings (port, environment)
- Database connection details
- JWT secret and expiration
- OAuth client IDs and secrets
- CORS settings

## Development and Build

The backend includes scripts for development and production:

- `dev`: Run the development server with hot reloading
- `build`: Compile TypeScript to JavaScript
- `start`: Run the production server
- `init-db`: Initialize the database schema
- Database management commands (`db:generate`, `db:migrate`, etc.)

## Further Reading

- [API Routes](./api-routes.md) - Detailed information about API endpoints
- [Database Integration](./database.md) - More details about database setup and queries
- [Authentication](./authentication.md) - In-depth look at the authentication system
