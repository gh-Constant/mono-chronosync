# Running the Application

This guide explains how to run different components of the ChronoSync application for development and testing.

## Prerequisites

Before running the application, make sure you have:

1. Completed the [installation process](./installation.md)
2. Set up your [development environment](./development-setup.md)
3. Configured all required [environment variables](./installation.md#environment-configuration)

## Running the Web Application

### Running the Full Web Stack

To run both the frontend and backend together:

```bash
pnpm dev
# or
pnpm dev:web
# or
nx run-many --target=dev --projects=web-frontend,web-backend --parallel
```

This will start:
- Frontend development server on port 4173 (accessible at http://localhost:4173)
- Backend API server on port 3005 (accessible at http://localhost:3005/api)

### Running Only the Frontend

To run just the web frontend:

```bash
pnpm dev:web:frontend
# or
nx run web-frontend:dev
```

The frontend will be available at http://localhost:4173.

### Running Only the Backend

To run just the web backend:

```bash
pnpm dev:web:backend
# or
nx run web-backend:dev
```

The backend API will be available at http://localhost:3005/api.

You can test the API is running by accessing the health check endpoint:
http://localhost:3005/api/health

## Running Desktop Applications

### Running the General Desktop App

```bash
pnpm dev:desktop
# or
nx run desktop:dev
```

### Running Platform-Specific Desktop Apps

For Windows:
```bash
pnpm dev:desktop:windows
# or
nx run desktop-windows:dev
```

For macOS:
```bash
pnpm dev:desktop:mac
# or
nx run desktop-mac:dev
```

For Linux:
```bash
pnpm dev:desktop:linux
# or
nx run desktop-linux:dev
```

## Running Mobile Applications

### Running the General Mobile App

```bash
pnpm dev:mobile
# or
nx run mobile:dev
```

### Running Platform-Specific Mobile Apps

For Android:
```bash
pnpm dev:mobile:android
# or
nx run mobile-android:dev
```

For iOS:
```bash
pnpm dev:mobile:ios
# or
nx run mobile-ios:dev
```

## Running All Applications

To run all applications in parallel (not recommended for most development scenarios):

```bash
pnpm dev:all
# or
nx run-many --target=dev --all --parallel
```

## Production Mode

### Building for Production

To build all applications for production:

```bash
pnpm build
# or
nx run-many --target=build --all
```

To build specific applications:

```bash
# Build web frontend
pnpm build:web:frontend
# or
nx run web-frontend:build

# Build web backend
pnpm build:web:backend
# or
nx run web-backend:build

# Build common package
pnpm build:web:common
# or
nx run web-common:build
```

### Running in Production Mode

To run the web application in production mode after building:

```bash
pnpm start
# or
nx run web:start
```

To run just the frontend in preview mode:

```bash
pnpm start:web:frontend
# or
nx run web-frontend:preview
```

To run just the backend in production mode:

```bash
pnpm start:web:backend
# or
nx run web-backend:start
```

## Accessing the Application

Once the application is running, you can access it at:

- **Web Frontend**: http://localhost:4173
- **Web Backend API**: http://localhost:3005/api
- **API Health Check**: http://localhost:3005/api/health

## Stopping the Application

To stop any running application, press `Ctrl+C` in the terminal where it's running.

## Troubleshooting

### Port Conflicts

If you encounter port conflicts:

1. Check if another process is using the required ports:
   ```bash
   # For Windows
   netstat -ano | findstr :3005
   netstat -ano | findstr :4173
   
   # For macOS/Linux
   lsof -i :3005
   lsof -i :4173
   ```

2. Either stop the conflicting process or change the port in the configuration:
   - For backend: Update the `PORT` in `packages/web/backend/.env`
   - For frontend: Update the port in `packages/web/frontend/vite.config.ts`

### Backend Not Starting

If the backend fails to start:

1. Check the database connection:
   ```bash
   # Verify PostgreSQL is running
   pg_isready
   ```

2. Verify environment variables are set correctly
3. Check the logs for specific error messages

### Frontend Not Connecting to Backend

If the frontend can't connect to the backend:

1. Ensure the backend is running
2. Check that `VITE_API_URL` in the frontend `.env` file points to the correct backend URL
3. Verify CORS settings in the backend

## Next Steps

Now that you have the application running, you can:

1. Explore the [web frontend architecture](../web/frontend/overview.md)
2. Learn about the [web backend API](../web/backend/api-routes.md)
3. Understand the [development workflow](../workflow/development.md)
