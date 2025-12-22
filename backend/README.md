# NHL Stats Tracker - Python Backend

This is the Python backend for the NHL Stats Tracker application, built with FastAPI and the [nhl-api-py](https://github.com/coreyjs/nhl-api-py) library.

## Features

- FastAPI REST API server
- Integration with nhl-api-py for accessing NHL data
- CORS support for frontend integration
- Endpoints for:
  - Team schedules
  - Team statistics
  - Player career stats
  - Game details
  - League standings

## Prerequisites

- Python 3.12 or higher
- pip or uv package manager

## Installation

### Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Docker

Build and run with Docker:
```bash
docker build -t nhl-stats-backend .
docker run -p 8000:8000 nhl-stats-backend
```

## API Endpoints

### Health Check
- `GET /` - Health check endpoint

### Teams
- `GET /api/teams` - Get all NHL teams

### Schedule
- `GET /api/schedule/{team_abbr}/{season}` - Get team schedule for a season
  - `team_abbr`: Three-letter team abbreviation (e.g., VGK, TOR)
  - `season`: Season in YYYYYYYY format (e.g., 20242025)

### Statistics
- `GET /api/stats/{team_abbr}/{season}` - Get team statistics
  - Query parameter: `game_type` (2=Regular season, 3=Playoffs, default: 2)

### Standings
- `GET /api/standings` - Get current league standings
  - Optional query parameter: `date` (YYYY-MM-DD format)

### Game Details
- `GET /api/game/{game_id}` - Get detailed game information
  - `game_id`: NHL game ID (e.g., 2024020001)

### Player Stats
- `GET /api/player/{player_id}/career` - Get player career statistics
  - `player_id`: NHL player ID

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

The backend uses the following environment variables (optional):

- `PYTHONUNBUFFERED=1` - For better logging in Docker

## Development

### Code Structure

```
backend/
├── main.py           # FastAPI application
├── requirements.txt  # Python dependencies
├── Dockerfile        # Docker build configuration
└── README.md        # This file
```

### Adding New Endpoints

1. Add the endpoint function in `main.py`
2. Use the `nhl_client` to access nhl-api-py methods
3. Handle errors appropriately
4. Update this README with the new endpoint

## Testing

To test the API endpoints manually:

```bash
# Health check
curl http://localhost:8000/

# Get all teams
curl http://localhost:8000/api/teams

# Get team schedule
curl http://localhost:8000/api/schedule/VGK/20242025

# Get team stats
curl http://localhost:8000/api/stats/VGK/20242025

# Get standings
curl http://localhost:8000/api/standings
```

## Dependencies

- **fastapi**: Modern web framework for building APIs
- **uvicorn**: ASGI server for running FastAPI
- **nhl-api-py**: Python wrapper for NHL API
- **python-dotenv**: Environment variable management

## Troubleshooting

### Port Already in Use

If port 8000 is already in use:
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9
# Or run on a different port
uvicorn main:app --port 8001
```

### Module Not Found

Make sure you've activated the virtual environment and installed dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

## License

MIT License - See main repository LICENSE file.
