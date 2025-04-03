# Development Workflow

This document outlines the recommended development workflow for contributing to the ChronoSync project.

## Development Environment

Before starting development, ensure you have:

1. Set up your [development environment](../getting-started/development-setup.md)
2. Installed all [prerequisites](../getting-started/prerequisites.md)
3. Cloned the repository and installed dependencies

## Development Cycle

### 1. Update Your Local Repository

Before starting work, ensure your local repository is up to date:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Update dependencies if needed
pnpm install
```

### 2. Create a Feature Branch

Create a new branch for your work:

```bash
# For a new feature
git checkout -b feature/your-feature-name

# For a bug fix
git checkout -b bugfix/issue-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### 3. Run the Development Server

Start the development server for the package(s) you're working on:

```bash
# For the full web stack
pnpm dev

# For just the frontend
pnpm dev:web:frontend

# For just the backend
pnpm dev:web:backend
```

### 4. Make Your Changes

Develop your feature or fix, following these guidelines:

- Follow the [code style guidelines](../contributing/code-style.md)
- Write tests for your changes
- Keep commits small and focused
- Use meaningful commit messages

### 5. Test Your Changes

Test your changes thoroughly:

```bash
# Run tests for all packages
pnpm test

# Run tests for a specific package
nx run web-frontend:test
nx run web-backend:test

# Run tests with coverage
nx run web-frontend:test --coverage
```

### 6. Lint Your Code

Ensure your code follows the project's style guidelines:

```bash
# Lint all packages
pnpm lint

# Lint a specific package
nx run web-frontend:lint
```

### 7. Build the Project

Verify that the project builds successfully:

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:web:common
pnpm build:web:frontend
pnpm build:web:backend
```

### 8. Commit Your Changes

Commit your changes with a meaningful message following the [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git add .
git commit -m "feat(component): add new feature"
```

### 9. Push Your Changes

Push your branch to your fork:

```bash
git push origin your-branch-name
```

### 10. Create a Pull Request

Create a pull request on GitHub:

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the pull request template
5. Submit the pull request

## Working with Nx

Nx provides several commands to help with development:

### Running Tasks

```bash
# Run a task for a specific project
nx run project-name:task-name

# Run a task for multiple projects
nx run-many --target=task-name --projects=project1,project2

# Run a task for all projects
nx run-many --target=task-name --all
```

### Affected Commands

Nx can run tasks only for projects affected by your changes:

```bash
# Run tests only for affected projects
nx affected --target=test

# Run lint only for affected projects
nx affected --target=lint

# Build only affected projects
nx affected --target=build
```

### Dependency Graph

Visualize the dependency graph:

```bash
pnpm graph
# or
nx graph
```

## Working with PNPM

PNPM is used for package management:

```bash
# Add a dependency to a specific package
pnpm --filter @chronosync/frontend add package-name

# Add a dev dependency to a specific package
pnpm --filter @chronosync/backend add -D package-name

# Update dependencies
pnpm update

# Run a script in a specific package
pnpm --filter @chronosync/backend run script-name
```

## Common Development Tasks

### Adding a New Component to Frontend

1. Create the component in `packages/web/frontend/src/components/`
2. Import and use the component where needed
3. Add tests in a `__tests__` directory or with `.spec.ts` suffix

### Adding a New API Endpoint to Backend

1. Define the route in `packages/web/backend/src/routes/`
2. Implement the controller in `packages/web/backend/src/controllers/`
3. Add any necessary services in `packages/web/backend/src/services/`
4. Update the main router in `packages/web/backend/src/routes/index.ts`

### Adding a New Type to Common Package

1. Add the type in `packages/web/common/src/types/`
2. Export it from the appropriate barrel file
3. Rebuild the common package: `pnpm build:web:common`

## Debugging

### Frontend Debugging

1. Use Vue DevTools in the browser
2. Use `console.log` or browser developer tools
3. Set breakpoints in the browser's source panel

### Backend Debugging

1. Use `console.log` for simple debugging
2. Use the Node.js debugger:
   ```bash
   # Start the backend with the inspector
   node --inspect packages/web/backend/src/index.ts
   ```
3. Connect to the debugger using Chrome DevTools or VS Code

## Performance Optimization

### Frontend Performance

1. Use the Vue DevTools Performance tab
2. Analyze bundle size with `pnpm build:web:frontend --report`
3. Use lazy loading for routes and components

### Backend Performance

1. Use profiling tools like `clinic.js`
2. Monitor database query performance
3. Implement caching where appropriate

## Further Reading

- [Git Workflow](./git-workflow.md) - Detailed Git workflow guidelines
- [Testing](./testing.md) - Testing strategies and practices
- [CI/CD](./ci-cd.md) - Continuous Integration and Deployment workflow
