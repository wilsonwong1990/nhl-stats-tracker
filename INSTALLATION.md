# Installation Guide

This guide covers all the ways you can install and run NHL Stats Tracker.

## Prerequisites

- **Node.js** and **npm** (v9 or higher) or **yarn** package manager for npm deployment
- **Docker** for containerization deployment

## Quick Start (Pre-built Packages)

### Using Pre-built Docker Image

If you just want to run the application without building from source, you can use the pre-built Docker image:

```bash
# Pull and run the latest image
docker run -d -p 3000:80 --name nhl-stats-tracker ghcr.io/wilsonwong1990/nhl-stats-tracker:main

# Or using Docker Compose with the pre-built image
# Create a docker-compose.yml file:
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  nhl-stats-tracker:
    image: ghcr.io/wilsonwong1990/nhl-stats-tracker:latest
    ports:
      - "3000:80"
    restart: unless-stopped
EOF

docker-compose up -d
```

Then open your browser to `http://localhost:3000`

**Available Image Tags:**
- `latest` - Most recent stable release
- `v{version}` - Specific version (e.g., `v1.0.0`)
- `main` - Latest from main branch

### Using as an npm Package

You can also install and use this project as an npm package in your own application:

```bash
# Install the package
npm install nhl-stats-tracker

# Or with yarn
yarn add nhl-stats-tracker

# Or with pnpm
pnpm add nhl-stats-tracker
```

Then import and use in your React application:

```typescript
import { NHLStatsTracker } from 'nhl-stats-tracker';

function App() {
  return (
    <div>
      <NHLStatsTracker defaultTeam="VGK" />
    </div>
  );
}
```

**Package Configuration:**
- Full TypeScript support with type definitions included
- Tree-shakeable ES modules
- Compatible with React 18+
- Zero additional configuration needed


## Installation Methods (Build from Source)

### Option 1: Standard npm Installation

1. Clone the repository:
```bash
git clone https://github.com/wilsonwong1990/nhl-stats-tracker.git
cd nhl-stats-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Option 2: Using Docker

#### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/wilsonwong1990/nhl-stats-tracker.git
cd nhl-stats-tracker
```

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

3. Open your browser and navigate to `http://localhost:3000`

4. Stop the container:
```bash
docker-compose down
```

#### Using Docker Directly

1. Build the Docker image:
```bash
docker build -t nhl-stats-tracker .
```

2. Run the container:
```bash
docker run -d -p 3000:80 --name nhl-stats-tracker nhl-stats-tracker
```

3. Open your browser and navigate to `http://localhost:3000`

4. Stop and remove the container:
```bash
docker stop nhl-stats-tracker
docker rm nhl-stats-tracker
```

## Package Manager Alternatives

### Using Yarn

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Using pnpm

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Available Scripts

- `npm run dev` - Start the development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint to check code quality
- `npm run optimize` - Optimize dependencies

## Configuration

### Setting Default Team

The default team is set to Vegas Golden Knights. You can change this by editing the `DEFAULT_TEAM_ID_FALLBACK` in `src/lib/teams.ts` to your favorite team's 3-letter abbreviation.

---

Need help? Check the main [README](./README.md) for more information about the project.
