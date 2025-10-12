# IHM Full Stack Application

This repository contains both the backend (FastAPI) and frontend (React + Vite) services configured to work together with Docker Compose.

## Architecture

- **Backend**: FastAPI with PostgreSQL database, Redis cache, and background tasks
- **Frontend**: React with Vite for development and Nginx for production
- **Services**: Database migrations, task workers, and health monitoring

## Quick Start

### Development Mode

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd ihm_backend
   ```

2. **Run the full stack in development mode**:
   ```bash
   docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173 (React dev server with hot reload)
   - Backend API: http://localhost:8000 (FastAPI with auto-reload)
   - API Documentation: http://localhost:8000/docs

### Production Mode

1. **Run the full stack in production mode**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000 (Nginx-served React build)
   - Backend API: http://localhost:8000 (FastAPI production)

## Services Overview

| Service | Development Port | Production Port | Description |
|---------|------------------|-----------------|-------------|
| Frontend | 5173 | 3000 | React app with Vite dev server / Nginx |
| Backend API | 8000 | 8000 | FastAPI application |
| PostgreSQL | 5432 | 5432 | Database (internal) |
| Redis | 6379 | 6379 | Cache and message broker (internal) |

## Development Features

### Frontend (React + Vite)
- Hot reload for instant development feedback
- API proxy configuration for seamless backend integration
- Environment variable support for different configurations
- Built-in backend connectivity testing

### Backend (FastAPI)
- Auto-reload on code changes
- Interactive API documentation at `/docs`
- Database migrations with Alembic
- Background task processing with TaskIQ
- User authentication and authorization

## Environment Configuration

### Frontend Environment Variables
Create `ihm_frontend/.env` (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:8000
VITE_NODE_ENV=development
```

### Backend Environment Variables
Create `.env` in project root:
```env
IHM_BACKEND_HOST=0.0.0.0
IHM_BACKEND_PORT=8000
IHM_BACKEND_RELOAD=True
# Add other backend configuration as needed
```

## API Integration

The frontend includes a pre-configured API service (`src/services/api.js`) that handles:
- Health check endpoints
- Echo testing for connectivity verification
- User authentication endpoints
- Centralized error handling

Example usage in React components:
```javascript
import ApiService from './services/api'

// Test backend connection
const response = await ApiService.healthCheck()

// Echo test
const echo = await ApiService.echo("Hello Backend!")
```

## Docker Commands

### Development
```bash
# Start all services with hot reload
docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up

# Rebuild and start
docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build

# Run specific service
docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up frontend
```

### Production
```bash
# Start all services
docker-compose up

# Rebuild and start
docker-compose up --build

# Run in background
docker-compose up -d
```

### Useful Commands
```bash
# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v

# Shell access to containers
docker-compose exec api bash
docker-compose exec frontend sh
```

## Project Structure

```
ihm_backend/
├── ihm_backend/           # Backend FastAPI application
│   ├── web/api/          # API routes and endpoints
│   ├── db/               # Database models and migrations
│   └── services/         # External services (Redis, etc.)
├── ihm_frontend/         # Frontend React application
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── Dockerfile        # Frontend container configuration
│   └── nginx.conf        # Production web server config
├── tests/                # Backend tests
├── deploy/               # Docker Compose overrides
├── docker-compose.yml    # Main service definitions
└── README.md            # This file
```

## Next Steps

1. **Database Setup**: The database will be automatically initialized with migrations
2. **Authentication**: Configure user registration and login flows
3. **Frontend Routing**: Add React Router for multi-page navigation
4. **State Management**: Consider adding Redux or Zustand for complex state
5. **Testing**: Set up frontend tests with Vitest or Jest
6. **CI/CD**: Configure automated building and deployment

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**:
   - Check that both services are running
   - Verify API URL in frontend environment variables
   - Check Docker network connectivity

2. **Database connection errors**:
   - Ensure PostgreSQL service is healthy
   - Check database credentials in environment variables
   - Wait for database initialization (first run takes longer)

3. **Hot reload not working**:
   - Ensure volume mounts are configured correctly in development mode
   - Check file permissions if on Windows/WSL

4. **Port conflicts**:
   - Change port mappings in docker-compose files if needed
   - Use `docker-compose ps` to see current port assignments
```