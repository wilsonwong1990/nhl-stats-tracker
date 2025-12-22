# Vegas Golden Knights Stats Tracker

A comprehensive stats tracking application for the Vegas Golden Knights hockey team, providing real-time access to upcoming games, player statistics, and injury reports for the current season.

## Architecture

This application consists of two main components:

1. **Frontend**: React + TypeScript + Vite single-page application
2. **Backend**: Python FastAPI server using [nhl-api-py](https://github.com/coreyjs/nhl-api-py) library

The backend provides a REST API that the frontend consumes to display NHL data.

## 🚀 Quick Start

### Development Mode

#### Option 1: Using Docker Compose (Recommended)

```bash
# Start both frontend and backend
docker-compose -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Option 2: Running Locally

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
npm install --legacy-peer-deps
npm run dev
```

### Production Build

```bash
# Using Docker Compose
docker-compose up -d

# Or build separately
docker build -t nhl-stats-backend ./backend
docker build -t nhl-stats-frontend .
```
## Testing

This project includes a comprehensive test suite to ensure code quality:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite includes:
- **Page Rendering Tests**: Verifies that the application renders correctly and is not blank
- **Jack Eichel Stats Test**: Validates player statistics from the October 14, 2025 game
- **Stanley Cup Champions Test**: Confirms Vegas Golden Knights 2022-2023 championship (16 playoff wins)
- **Team Existence Tests**: Verifies Arizona Coyotes cessation after 2023-2024 season
- **Data Loading Tests**: Tests team data, stat leaders, roster display, and game information
- **UI Component Tests**: Validates various UI elements and user interactions

All tests run automatically on pull requests via GitHub Actions.

## Backend API

The Python backend (using [nhl-api-py](https://github.com/coreyjs/nhl-api-py)) provides the following endpoints:

- `GET /api/schedule/{team_abbr}/{season}` - Team schedule
- `GET /api/stats/{team_abbr}/{season}` - Team statistics  
- `GET /api/standings` - League standings
- `GET /api/game/{game_id}` - Game details
- `GET /api/player/{player_id}/career` - Player career stats

For detailed backend documentation, see [backend/README.md](backend/README.md).

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

### Production Build

```bash
npm run build
```

### Testing

```bash
npm run test -- --run
```

## 📦 NPM Package

This package is published to GitHub Packages and can be installed using:

```bash
npm install @wilsonwong1990/nhl-stats-tracker
```

## 🐳 Docker

This application is available as a Docker image using Alpine Linux. See [DOCKER.md](DOCKER.md) for details.

```bash
docker pull ghcr.io/wilsonwong1990/nhl-stats-tracker:main
docker run -p 3000:3000 ghcr.io/wilsonwong1990/nhl-stats-tracker:main
```

## 🔄 Continuous Integration

This project uses GitHub Actions for:
- Building and publishing npm packages to GitHub Packages
- Building and publishing Docker images to GitHub Container Registry

Workflows are triggered on:
- Push to main branch
- Pull requests
- Version tags (v*.*.*)
- Manual workflow dispatch

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
