# Common Package Overview

The ChronoSync common package (`@chronosync/common`) contains shared code, types, and utilities that are used across different parts of the application, particularly between the frontend and backend.

## Purpose

The common package serves several important purposes:

1. **Type Sharing**: Define TypeScript interfaces and types that are used in both frontend and backend
2. **Code Reuse**: Share utility functions and business logic
3. **Consistency**: Ensure consistent data structures and validation
4. **DRY Principle**: Avoid duplicating code across packages

## Project Structure

The common package has a simple structure:

```
packages/web/common/
├── src/
│   ├── types/              # Shared TypeScript types and interfaces
│   │   ├── auth.ts         # Authentication-related types
│   │   ├── user.ts         # User-related types
│   │   └── ...             # Other type definitions
│   ├── utils/              # Shared utility functions
│   │   ├── validation.ts   # Validation utilities
│   │   ├── formatting.ts   # Formatting utilities
│   │   └── ...             # Other utilities
│   ├── constants/          # Shared constants
│   │   ├── errorCodes.ts   # Error codes
│   │   └── ...             # Other constants
│   └── index.ts            # Package entry point
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── ...
```

## Key Components

### Shared Types

The common package defines types that are used across the application:

- **Authentication Types**: Login credentials, registration data, JWT payload structure
- **User Types**: User profile structure, user preferences
- **API Types**: Request and response structures for API endpoints
- **Error Types**: Standardized error structures

### Shared Utilities

Utility functions that are used in multiple places:

- **Validation**: Input validation functions
- **Formatting**: Data formatting utilities
- **Date Handling**: Date manipulation and formatting
- **String Manipulation**: Common string operations

### Shared Constants

Constants that need to be consistent across the application:

- **Error Codes**: Standardized error codes
- **Status Codes**: HTTP status codes with descriptions
- **Regex Patterns**: Common regular expressions for validation
- **Configuration Constants**: Shared configuration values

## Usage

### In Backend

The common package is imported in the backend code:

```typescript
// In a backend file
import { UserProfile, LoginCredentials } from '@chronosync/common';

// Use the imported types
const validateUser = (user: UserProfile) => {
  // Implementation
};
```

### In Frontend

Similarly, the common package is imported in the frontend code:

```typescript
// In a frontend file
import { UserProfile, formatDate } from '@chronosync/common';

// Use the imported types and utilities
const user: UserProfile = {
  // User data
};

const formattedDate = formatDate(user.createdAt);
```

## Building the Common Package

The common package needs to be built before it can be used by other packages:

```bash
pnpm build:web:common
# or
nx run web-common:build
```

This compiles the TypeScript code and generates the necessary type definitions.

## Development Workflow

When making changes to the common package:

1. Update the code in the common package
2. Build the common package
3. The changes will be available to other packages that depend on it

## Best Practices

### When to Use the Common Package

Code should be placed in the common package when:

- It's used by both frontend and backend
- It defines data structures that are shared between packages
- It contains utility functions that are needed in multiple places

### When Not to Use the Common Package

Code should NOT be placed in the common package when:

- It's specific to either frontend or backend
- It has dependencies that are not compatible with both environments
- It's only used in one place

### Maintaining Compatibility

When adding code to the common package:

- Ensure it works in both Node.js and browser environments
- Avoid dependencies on platform-specific APIs
- Use TypeScript for type safety
- Write tests that verify compatibility

## Further Reading

- [Project Structure](../../monorepo/structure.md) - How the common package fits into the overall project structure
- [Development Workflow](../../workflow/development.md) - How to work with the common package in development
