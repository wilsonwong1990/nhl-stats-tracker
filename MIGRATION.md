# Migration to Python Backend Guide

## Overview

This document explains the migration from Node.js client-side NHL API calls to a Python FastAPI backend using the nhl-api-py library.

## What Changed

### Architecture

**Before:**
- React frontend making direct API calls to NHL's public API via Vite proxy
- No backend server

**After:**
- React frontend → Python FastAPI backend → NHL API (via nhl-api-py)
- Python backend provides REST API
- Frontend calls backend through `/api` endpoints

### Benefits

1. **Better API Access**: nhl-api-py provides organized access to NHL data including EDGE statistics
2. **Server-Side Processing**: Data transformation happens on the backend
3. **Rate Limiting**: Can implement rate limiting and caching at the backend level
4. **Enhanced Features**: Access to advanced NHL EDGE data for future features
5. **Maintainability**: Centralized API logic in Python backend

## Architecture Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Browser   │ ──────> │  Python Backend  │ ──────> │  NHL API    │
│  (React)    │ <────── │    (FastAPI)     │ <────── │ (nhl-api-py)│
└─────────────┘         └──────────────────┘         └─────────────┘
   Port 5173               Port 8000
```

## Getting Started

### Option 1: Quick Start Script

```bash
./dev.sh
```

This script will:
1. Setup Python virtual environment
2. Install Python dependencies
3. Start backend on port 8000
4. Start frontend on port 5173

### Option 2: Docker Compose

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Production:**
```bash
docker-compose up -d
```

### Option 3: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm install --legacy-peer-deps
npm run dev
```

## API Endpoints

The Python backend exposes these endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/teams` | Get all NHL teams |
| `GET /api/schedule/{team_abbr}/{season}` | Get team schedule |
| `GET /api/stats/{team_abbr}/{season}` | Get team statistics |
| `GET /api/standings` | Get league standings |
| `GET /api/game/{game_id}` | Get game details |
| `GET /api/player/{player_id}/career` | Get player career stats |

Full API documentation available at: `http://localhost:8000/docs`

## File Changes

### New Files

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── Dockerfile          # Backend Docker config
└── README.md           # Backend documentation

docker-compose.yml      # Production compose config
docker-compose.dev.yml  # Development compose config
dev.sh                  # Development startup script
```

### Modified Files

- `src/lib/nhl-api.ts` - Updated to call Python backend instead of NHL API directly
- `vite.config.ts` - Updated proxy to forward `/api` to Python backend
- `README.md` - Added architecture and setup instructions
- `DOCKER.md` - Updated for multi-container setup
- `.gitignore` - Added Python-specific ignores

## Frontend Changes

The frontend changes are minimal and transparent to users:

1. **API Base URL**: Changed from `/nhl-api/v1` to `/api`
2. **Endpoint Paths**: Updated to match new backend endpoints
3. **Data Parsing**: Remains the same (backend returns similar data structure)

All existing TypeScript interfaces and React components work without changes.

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
# Test health endpoint
curl http://localhost:8000/

# Test API endpoint
curl http://localhost:8000/api/teams
```

### Frontend Tests

```bash
npm run test
```

All existing tests should pass as the frontend interface remains unchanged.

## Deployment

### Local Development

Use `./dev.sh` or docker-compose for local development with hot-reloading.

### Production

Use docker-compose for production:

```bash
docker-compose up -d
```

Or deploy services separately:
- Backend: Deploy Python FastAPI app (Railway, Render, AWS, etc.)
- Frontend: Deploy static build to CDN or static hosting

## Troubleshooting

### Backend not starting

1. Check Python version: `python --version` (need 3.12+)
2. Check if port 8000 is available: `lsof -i :8000`
3. Check logs: `logs/backend.log` or `docker-compose logs backend`

### Frontend can't connect to backend

1. Ensure backend is running: `curl http://localhost:8000/`
2. Check Vite proxy configuration in `vite.config.ts`
3. Check browser console for CORS errors

### API returns errors

1. Check backend logs for error details
2. Verify NHL API is accessible (may have rate limits)
3. Check nhl-api-py version compatibility

## Migration Notes

### Backward Compatibility

- All frontend functionality remains the same
- User experience unchanged
- Data structures maintained for compatibility

### Future Enhancements

The Python backend opens up possibilities for:
- EDGE statistics integration
- Advanced analytics
- Data caching and optimization
- Custom aggregations
- Rate limiting and quotas

## Support

For issues or questions:
1. Check backend logs: `logs/backend.log`
2. Check API documentation: `http://localhost:8000/docs`
3. Review backend README: `backend/README.md`
4. Open an issue on GitHub

## Additional Resources

- [nhl-api-py Documentation](https://github.com/coreyjs/nhl-api-py)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Backend API Docs](http://localhost:8000/docs) (when running)
