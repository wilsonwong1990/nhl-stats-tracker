# Docker Usage

This application can be run using Docker with Alpine Linux as the base image.

## Pull the Docker Image

```bash
docker pull ghcr.io/wilsonwong1990/nhl-stats-tracker:main
```

## Run the Docker Container

```bash
docker run -p 3000:80 ghcr.io/wilsonwong1990/nhl-stats-tracker:main
```

Then access the application at http://localhost:3000

## Build the Docker Image Locally

```bash
docker build -t nhl-stats-tracker .
```

## Run the Locally Built Image

```bash
docker run -p 3000:80 nhl-stats-tracker
```

## Image Details

- **Base Image**: node:20-alpine
- **Multi-stage build**: Yes (reduces final image size)
- **Port**: 3000
- **Platforms**: linux/amd64, linux/arm64
