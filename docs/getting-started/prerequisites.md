# Prerequisites

Before you begin working with the ChronoSync project, ensure that your development environment meets the following requirements.

## System Requirements

### Hardware Requirements

- **CPU**: Dual-core processor or better
- **RAM**: 4GB minimum, 8GB or more recommended
- **Disk Space**: At least 2GB of free disk space

### Operating System

ChronoSync development is supported on:

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 20.04 or later, or other major distributions

## Software Requirements

### Required Software

1. **Node.js**
   - Version: 16.x or later
   - [Download Node.js](https://nodejs.org/)
   - Verify installation: `node --version`

2. **PNPM**
   - Version: 8.x or later
   - Installation: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

3. **Git**
   - [Download Git](https://git-scm.com/downloads)
   - Verify installation: `git --version`

### Database Requirements

For local development, you'll need:

1. **PostgreSQL**
   - Version: 12.x or later
   - [Download PostgreSQL](https://www.postgresql.org/download/)
   - Verify installation: `psql --version`

### Recommended Development Tools

While not strictly required, the following tools are recommended for a better development experience:

1. **Visual Studio Code**
   - [Download VS Code](https://code.visualstudio.com/)
   - Recommended extensions:
     - ESLint
     - Prettier
     - Vue Language Features (Volar)
     - TypeScript Vue Plugin (Volar)
     - PostgreSQL

2. **Postman** or **Insomnia**
   - For API testing
   - [Download Postman](https://www.postman.com/downloads/)
   - [Download Insomnia](https://insomnia.rest/download)

## Environment Setup Checklist

Use this checklist to ensure you have everything set up correctly:

- [ ] Node.js installed (v16+)
- [ ] PNPM installed (v8+)
- [ ] Git installed
- [ ] PostgreSQL installed and running
- [ ] Code editor installed (VS Code recommended)
- [ ] API testing tool installed (optional)

## Troubleshooting Common Setup Issues

### Node.js Version Issues

If you have multiple Node.js versions installed, consider using a version manager:
- **Windows**: Use [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS/Linux**: Use [nvm](https://github.com/nvm-sh/nvm)

### PostgreSQL Connection Issues

If you're having trouble connecting to PostgreSQL:
1. Ensure the PostgreSQL service is running
2. Check that you have the correct connection details (host, port, username, password)
3. Verify that your user has the necessary permissions

### PNPM Installation Issues

If you encounter issues installing PNPM:
1. Try installing with npm: `npm install -g pnpm`
2. If that fails, check your Node.js installation
3. On some systems, you may need administrator privileges

## Next Steps

Once you have all the prerequisites installed, proceed to the [Installation Guide](./installation.md) to set up the ChronoSync project on your local machine.
