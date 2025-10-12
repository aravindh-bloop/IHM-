@echo off
REM Restart the stack with latest changes
echo Stopping existing containers...
docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml down

echo Building and starting with updated configuration...
docker-compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up --build

echo Access the application:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - API Docs: http://localhost:8000/api/docs