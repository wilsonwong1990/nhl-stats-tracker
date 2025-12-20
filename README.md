# Vegas Golden Knights Stats Tracker

A comprehensive stats tracking application for the Vegas Golden Knights hockey team, providing real-time access to upcoming games, player statistics, and injury reports for the current season.

## 🚀 Quick Start
🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
- Comprehensive unit test suite with GitHub Actions CI
  
🧠 What Can You Do?

### Development

```bash
npm install --legacy-peer-deps
npm run dev
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
npm install @wilsonwong1990/vegas-golden-kn-iron
```

## 🐳 Docker

This application is available as a Docker image using Alpine Linux. See [DOCKER.md](DOCKER.md) for details.

```bash
docker pull ghcr.io/wilsonwong1990/vegas-golden-kn-iron:main
docker run -p 3000:3000 ghcr.io/wilsonwong1990/vegas-golden-kn-iron:main
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
