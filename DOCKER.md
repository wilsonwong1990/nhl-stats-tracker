# Docker Usage

This application can be run using Docker with Alpine Linux as the base image.

## Pull the Docker Image

```bash
docker pull ghcr.io/wilsonwong1990/vegas-golden-kn-iron:main
```

## Run the Docker Container

```bash
docker run -p 3000:3000 ghcr.io/wilsonwong1990/vegas-golden-kn-iron:main
```

Then access the application at http://localhost:3000

## Build the Docker Image Locally

```bash
docker build -t vegas-golden-kn-iron .
```

## Run the Locally Built Image

```bash
docker run -p 3000:3000 vegas-golden-kn-iron
```

## Image Details

- **Base Image**: node:20-alpine
- **Multi-stage build**: Yes (reduces final image size)
- **Port**: 3000
- **Platforms**: linux/amd64, linux/arm64
