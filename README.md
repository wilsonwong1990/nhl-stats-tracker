# Vegas Golden Knights Stats Tracker

A comprehensive stats tracking application for the Vegas Golden Knights hockey team, providing real-time access to upcoming games, player statistics, and injury reports for the current season.

## 🚀 Quick Start

### Development

```bash
npm install --legacy-peer-deps
npm run dev
```

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
