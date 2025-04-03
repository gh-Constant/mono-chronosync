# Web Frontend Overview

The ChronoSync web frontend is built with Vue.js 3, utilizing the Composition API and TypeScript for a modern, type-safe development experience.

## Technology Stack

- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide icons
- **3D Visualization**: Three.js with TresJS
- **Animation**: GSAP

## Project Structure

The frontend project follows a standard Vue.js project structure with some customizations:

```
packages/web/frontend/
├── public/                 # Static assets that will be served as-is
├── src/
│   ├── assets/             # Static assets that will be processed by the build
│   ├── components/         # Reusable Vue components
│   │   ├── layout/         # Layout components
│   │   ├── ui/             # UI components
│   │   └── ...             # Other component categories
│   ├── router/             # Vue Router configuration
│   ├── services/           # API services and other external services
│   ├── stores/             # Pinia stores for state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── views/              # Vue components that represent pages
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   └── ...
├── .env                    # Environment variables
├── index.html              # HTML entry point
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── ...
```

## Key Components

### Views

Views represent the pages of the application:

- `HomeView.vue`: Landing page
- `AuthView.vue`: Authentication page (login/signup)
- `DashboardView.vue`: User dashboard
- `OAuthCallbackView.vue`: Handles OAuth authentication callbacks
- `PrivacyPolicyView.vue`: Privacy policy page

### Stores

Pinia stores manage the application state:

- `auth.ts`: Authentication state and actions
- `theme.ts`: Theme preferences (light/dark mode)
- `counter.ts`: Example counter store

### Services

Services handle external API communication:

- `authService.ts`: Authentication API calls
- Other service files for different API endpoints

## Authentication Flow

The frontend implements a comprehensive authentication system:

1. **Traditional Authentication**:
   - Email/password login via the `AuthView.vue` component
   - Registration with email/password
   - JWT token storage and management

2. **OAuth Authentication**:
   - Google OAuth integration
   - GitHub OAuth integration
   - Callback handling via `OAuthCallbackView.vue`

3. **Authentication State Management**:
   - Managed by the `useAuthStore` Pinia store
   - Persistent authentication via localStorage
   - Protected routes via navigation guards

## Routing

Vue Router is configured in `src/router/index.ts` with the following key features:

- Route definitions with lazy loading for code splitting
- Meta fields for route requirements (e.g., authentication)
- Navigation guards for protected routes

## State Management

Pinia is used for state management with these key stores:

- **Auth Store**: Manages user authentication state
- **Theme Store**: Manages UI theme preferences
- **Other Stores**: For specific feature domains

## API Integration

The frontend communicates with the backend API using Axios:

- API base URL is configured via environment variables
- Authentication tokens are included in requests
- Error handling and response processing

## UI/UX Design

The frontend implements a responsive design with:

- Light and dark mode support
- Responsive layouts for different screen sizes
- Accessible UI components
- 3D visualizations using Three.js where appropriate

## Build and Development

The frontend uses Vite for fast development and optimized production builds:

- Hot module replacement during development
- Optimized asset bundling for production
- Environment variable handling
- TypeScript integration

## Testing

The frontend includes testing setup with:

- Vitest for unit testing
- Component testing capabilities
- Test utilities for common testing patterns

## Further Reading

- [Component Structure](./components.md) - Detailed information about UI components
- [State Management](./state-management.md) - In-depth look at Pinia stores
- [Routing](./routing.md) - More details about Vue Router configuration
- [API Integration](./api-integration.md) - How the frontend communicates with the backend
