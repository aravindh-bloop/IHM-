# IHM Full Stack Application

This repository contains both the backend (FastAPI) and frontend (React + Vite) services designed to run directly on your machine.

## Architecture

- **Backend**: FastAPI with PostgreSQL database, Redis cache, and background tasks
- **Frontend**: React with Vite for development
- **Services**: Database migrations, task workers, and health monitoring

## Quick Start

### Local development

1. **Install dependencies**:
   ```bash
   poetry install
   cd ihm_frontend
   npm install
   ```

2. **Start the backend** in one terminal:
   ```bash
   cd ..
   poetry run python -m ihm_backend
   ```

3. **Start the frontend** in another terminal:
   ```bash
   cd ihm_frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

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

## Local Commands

### Backend
```bash
poetry run python -m ihm_backend
```

### Frontend
```bash
cd ihm_frontend
npm run dev
```

### Useful Commands
```bash
# Install Python dependencies
poetry install

# Install frontend dependencies
cd ihm_frontend
npm install

# Run tests
pytest -vv .
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
│   └── vite.config.js    # Vite dev server config
├── tests/                # Backend tests
├── README.md             # Project overview
└── FULLSTACK_README.md   # This file
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
   - Check that both the backend and frontend processes are running
   - Verify the API URL in the frontend environment variables
   - Ensure the backend is listening on port 8000

2. **Database connection errors**:
   - Ensure PostgreSQL is running locally
   - Check database credentials in the `.env` file
   - Confirm the database server is reachable at localhost:5432 or your configured port

3. **Hot reload not working**:
   - Restart the Vite dev server
   - Check file permissions if on Windows/WSL

4. **Port conflicts**:
   - Change the ports in the `.env` and Vite config if needed
   - Confirm with `netstat` or a process monitor that ports 5173 and 8000 are free
```