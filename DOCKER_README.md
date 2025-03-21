# Chronosync Docker Deployment Guide

This guide explains how to deploy the Chronosync application using Docker Compose and Coolify, enabling FQDN-based routing.

## Prerequisites

- Docker and Docker Compose installed
- Coolify (optional for production deployments)
- Domain names configured for your application

## Quick Start

1. **Clone the repository:**
   ```
   git clone <your-repository-url>
   cd chronosync
   ```

2. **Configure Environment Variables:**
   ```
   cp .env.example .env
   ```
   Edit the `.env` file and fill in your specific configuration values or use the defaults.

3. **Start the application:**
   ```
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:4173 or your configured FQDN
   - Backend API: http://localhost:3005/api or your configured FQDN
   - pgAdmin: http://localhost:5050 or your configured FQDN

## Environment Variables

### Standard Environment Variables

Key environment variables that are configured with default values:

- `FRONTEND_FQDN`: Frontend domain (default: app.chronosync.local)
- `API_FQDN`: API domain (default: api.chronosync.local)
- OAuth credentials for Google and GitHub are pre-configured

### Coolify Dynamic Environment Variables

This project uses Coolify's dynamic environment variables system:

- `SERVICE_FQDN_FRONTEND`: Generates an FQDN for the frontend service
- `SERVICE_FQDN_API`: Generates an FQDN for the API service
- `SERVICE_FQDN_PGADMIN`: Generates an FQDN for the pgAdmin interface
- `SERVICE_PASSWORD_DB`: Generates a secure password for the database

When deployed with Coolify, these variables will be:
1. Automatically generated with secure values
2. Displayed in Coolify's UI for easy management
3. Consistent across redeployments
4. Shared between services that reference the same variable

## Database Configuration

The database connection is configured to use Coolify's dynamic password generation:

- Database name: `chronosync_db` (customizable via `POSTGRES_DB`)
- Database user: `postgres` (customizable via `POSTGRES_USER`)
- Database password: Auto-generated via `SERVICE_PASSWORD_DB`
- Database host: `postgres-chronosync`

## Database Access with pgAdmin

1. Access pgAdmin at http://localhost:5050 or your configured PGADMIN_FQDN
2. Login with the default credentials:
   - Email: admin@chronosync.com
   - Password: admin
3. Add a new server connection:
   - Name: Chronosync PostgreSQL
   - Host: postgres-chronosync
   - Port: 5432
   - Database: chronosync_db
   - Username: postgres
   - Password: Check Coolify UI for the generated `SERVICE_PASSWORD_DB` value

## Coolify Configuration

The docker-compose file includes Traefik routing configuration for Coolify:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.chronosync-frontend.rule=Host(`${FRONTEND_FQDN:-app.chronosync.local}`)
  - traefik.http.routers.chronosync-frontend.entrypoints=http
  - traefik.http.services.chronosync-frontend.loadbalancer.server.port=80
  - coolify.managed=true
```

When deploying with Coolify:

1. Import the project into Coolify
2. Ensure that Traefik is enabled in your Coolify instance
3. Review the auto-generated environment variables in Coolify's UI
4. Deploy the application

## Services

- **Frontend**: Vue.js application served via Nginx
- **Backend**: Express.js API server
- **postgres-chronosync**: PostgreSQL database with credentials managed by Coolify
- **pgAdmin**: Web interface for PostgreSQL management

## Scaling and Production

For production environments:

1. Use proper domains with SSL certificates
2. Let Coolify manage sensitive credentials through its dynamic variables
3. Consider adding Redis for caching
4. Set up backup strategies for the database

## Troubleshooting

- **Database Connection Issues**: Check the generated `SERVICE_PASSWORD_DB` in Coolify's UI
- **Frontend Cannot Connect to API**: Verify the `SERVICE_FQDN_API` value
- **FQDN Not Working**: Ensure DNS records are correctly configured
- **Traefik Routes Not Working**: Check the Coolify documentation for proper label configuration

## Development

To develop locally:

```
docker-compose up frontend backend postgres-chronosync
```

This will start the main services but skip pgAdmin for a lighter development setup. 