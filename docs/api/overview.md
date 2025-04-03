# API Reference Overview

This document provides an overview of the ChronoSync API, which is implemented in the backend package (`packages/web/backend`). The API follows RESTful principles and uses JSON for data exchange.

## API Base URL

The API is accessible at the following base URL:

- **Development**: `http://localhost:3005/api`
- **Production**: Depends on deployment environment

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Tokens) for authentication.

### Authentication Methods

1. **Bearer Token**: Include the JWT token in the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```

2. **Cookie-based**: For browser clients, the token is also stored in an HTTP-only cookie.

### Obtaining a Token

Tokens can be obtained through:

- **Login**: `POST /api/auth/login`
- **Registration**: `POST /api/auth/register`
- **OAuth**: Via Google or GitHub authentication flows

## API Versioning

Currently, the API does not use explicit versioning in the URL. Future versions may introduce versioning if significant changes are made.

## Response Format

API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {
      // Optional additional error details
    }
  }
}
```

## Common Status Codes

The API uses standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits may vary by endpoint and authentication status.

## CORS

Cross-Origin Resource Sharing (CORS) is configured to allow requests from:

- **Development**: `http://localhost:4173` (frontend development server)
- **Production**: Configured domain(s)

## API Endpoints

The API is organized into the following categories:

### Health Endpoints

- `GET /api/health`: Check API health status

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login with email and password
- `GET /api/auth/profile`: Get the current user's profile
- `POST /api/auth/logout`: Logout the current user
- `GET /api/auth/google`: Initiate Google OAuth flow
- `GET /api/auth/google/callback`: Handle Google OAuth callback
- `GET /api/auth/github`: Initiate GitHub OAuth flow
- `GET /api/auth/github/callback`: Handle GitHub OAuth callback

### RGPD Endpoints

- `GET /api/rgpd/privacy-policy`: Get privacy policy information
- `POST /api/rgpd/consent`: Record user consent

## Detailed API Documentation

For detailed information about specific endpoints, refer to the following documents:

- [Authentication API](./authentication.md): Authentication-related endpoints
- [User API](./user.md): User management endpoints
- [Other APIs](./other.md): Additional API endpoints

## API Client

The frontend communicates with the API using Axios. The API client is implemented in `packages/web/frontend/src/services/authService.ts` and other service files.

## Testing the API

You can test the API using:

1. **Postman** or **Insomnia**: Import the API collection (if available)
2. **curl**: Command-line requests
3. **Frontend application**: Through the UI

## Error Codes

The API uses standardized error codes to indicate specific error conditions. These codes are defined in the common package and used consistently across the API.

## Further Development

The API is designed to be extensible. When adding new endpoints:

1. Create a new route file in `packages/web/backend/src/routes/`
2. Implement the necessary controllers and services
3. Add the route to the main router in `packages/web/backend/src/routes/index.ts`
4. Update the API documentation

## Security Considerations

The API implements several security measures:

- JWT token authentication
- HTTPS in production
- Input validation
- CORS configuration
- Rate limiting
- HTTP-only cookies for sensitive data

## Further Reading

- [Authentication API](./authentication.md) - Detailed documentation of authentication endpoints
- [User API](./user.md) - Detailed documentation of user management endpoints
- [Web Backend Overview](../web/backend/overview.md) - Overview of the backend implementation
