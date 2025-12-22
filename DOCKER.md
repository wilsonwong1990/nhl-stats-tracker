# Docker Deployment Guide

This application can be deployed using Docker with a multi-container setup consisting of:
1. **Python Backend**: FastAPI server with nhl-api-py
2. **React Frontend**: Static files served with nginx/serve

## Quick Start

### Development Mode

Run both frontend and backend with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:5173`
- API docs on `http://localhost:8000/docs`

### Production Mode

Build and run the production containers:

```bash
docker-compose up -d
```

This will start:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`

## Building Individual Images

### Backend Image

```bash
cd backend
docker build -t nhl-stats-backend .
docker run -p 8000:8000 nhl-stats-backend
```

### Frontend Image

```bash
docker build -t nhl-stats-frontend .
docker run -p 3000:3000 nhl-stats-frontend
```

## Docker Compose Configuration

### Development (docker-compose.dev.yml)

- Hot-reloading enabled for both services
- Source code mounted as volumes
- Useful for local development

### Production (docker-compose.yml)

- Optimized builds with multi-stage Dockerfiles
- No source code volumes
- Health checks enabled
- Ready for deployment

## Environment Variables

### Backend

- `PYTHONUNBUFFERED=1` - Better logging output

### Frontend

- `NODE_ENV=production` - Production mode

## Ports

- **8000**: Backend API
- **3000**: Frontend (production)
- **5173**: Frontend (development)

## Troubleshooting

### Port Already in Use

```bash
# Stop existing containers
docker-compose down

# Or kill process on port
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Backend Not Responding

Check backend logs:
```bash
docker-compose logs backend
```

### Rebuild After Code Changes

```bash
# Rebuild all services
docker-compose build

# Force rebuild without cache
docker-compose build --no-cache
```

## Production Deployment

For production deployment, use the production docker-compose:

```bash
docker-compose up -d
```

Monitor the services:
```bash
docker-compose ps
docker-compose logs -f
```

## Image Details

- Backend: Python 3.12-slim (~200MB)
- Frontend: Node 20-alpine (~100MB)
- Multi-stage builds for optimization
