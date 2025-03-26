# 🚀 Chronosync

A comprehensive productivity application built with modern technologies for efficient time tracking and task management.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Basic Development Setup](#basic-development-setup)
  - [Docker Deployment (Optional)](#docker-deployment-optional)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- Cross-platform data synchronization
- Offline-first approach for mobile functionality
- Responsive design for all device sizes
- Secure user authentication and data protection
- Real-time updates and collaboration
- Performance-optimized time tracking
- Modern and clean user interface

## 🛠 Tech Stack

### Frontend
- **Vue.js** - Progressive JavaScript framework
  - Component-based architecture
  - Reactive data binding
  - TypeScript integration
- **Nuxt UI** - Modern UI component library
  - Reusable and accessible components
  - Customizable design system
  - Consistent styling and theming

### Backend
- **Express.js** - Node.js web application framework
  - RESTful API architecture
  - Robust authentication system
  - WebSocket support
  - Middleware-based request handling

### Database
- **PostgreSQL** - Reliable relational database
  - Complex data relationships
  - JSON support
  - Robust data persistence
  - High performance queries

## 🚀 Getting Started

### Basic Development Setup

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- PostgreSQL (local installation)
- Git

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chronosync.git
cd chronosync
```

2. Set up the frontend:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env
# Edit .env with your settings
```

3. Set up the backend:
```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env
# Edit .env with your settings
```

4. Start the development servers:

```bash
# In the frontend directory
npm run dev:web:frontend

# In another terminal, in the backend directory
npm run dev:web:backend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3005

### Docker Deployment (Optional)

If you prefer using Docker for deployment or development, follow these steps:

#### Prerequisites
- Docker and Docker Compose

#### Installation

1. Create environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`

3. Build and start the containers:
```bash
docker-compose up -d
```

The containerized application will be available at:
- Frontend: http://localhost:4173
- Backend API: http://localhost:3005

## 📁 Project Structure

```
chronosync/
├── frontend/          # Vue.js frontend application
├── backend/           # Express.js backend API
├── docker/            # Docker configuration files (optional)
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## ⚙️ Configuration

### Environment Variables

```env
# Frontend Configuration
VITE_API_URL=/api
PORT=3000

# Backend Configuration
PORT=3005
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=30d

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=chronosync_password
POSTGRES_DB=chronosync_db
DATABASE_URL=postgres://postgres:chronosync_password@localhost:5432/chronosync_db
```

## 📚 API Documentation

API documentation is available at `/api/docs` when running the development server.

Key endpoints:
- Authentication: `/api/auth`
- User Management: `/api/users`
- Time Tracking: `/api/time`
- Tasks: `/api/tasks`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Chronosync Team