# NHL Stats Tracker 🏒

A stats tracking application for all NHL teams, providing real-time access to upcoming games, player statistics, and injury reports for the current season. Track all 32 teams with data from [NHL API based off the unofficial reference from Zmalski](https://github.com/Zmalski/NHL-API-Reference)

## 🎯 About This Project

This application was originally created using [GitHub Spark](https://githubnext.com/projects/github-spark). What started as a Spark project focused on the Vegas Golden Knights has evolved into a hockey statistics dashboard that supports all 32 NHL teams and pulls live data from the NHL API.


## ✨ Features

### 🏒 Team Selection
- Choose from all 32 NHL teams via an easy-to-use dropdown selector
- Dynamic theme updates based on selected team's colors and branding
- Remembers your team preference across sessions
- Defaults to Vegas Golden Knights (GKG!)
  - This can be edited in the `lib/teams.ts` by changing the `DEFAULT_TEAM_ID_FALLBACK` to your favorite team's 3 letter abbervation.


### 📅 Upcoming Games Schedule
- Displays the next 10 upcoming games with opponent, home/away status, and PST start time
- Real-time data fetched from the NHL API
- Pagination controls to navigate through the schedule
- 24-hour data caching for optimal performance

### 📊 Player Statistics Leaderboards
The app includes multiple stat leader boards showing top performers:
- **Point Leaders** - Total points (goals + assists)
- **Goal Leaders** - Top goal scorers
- **Assist Leaders** - Top playmakers
- **Plus/Minus Leaders** - Players with the best plus/minus ratings
- **Time on Ice/Game** - Players with the most ice time on average
- **Goalie Save Percentage** - Goaltending performance

All statistics are fetched live from the NHL API and cached for 24 hours.

### 🏆 Team Standings & Record
- Current win-loss-OT loss record or the record for the specific season
- Total points in standings
- Conference position with visual indicators
- Wildcard status (if applicable)
- Games remaining in the season
- If the team is the Stanley Cup Champions for that particular year, a championship cup symbol will appear next to the team's name

### 👥 Full Team Roster
- Complete roster organized by position (Forwards, Defense, Goalies)
- Player names, positions, and jersey numbers

### 🏥 Injury Report
- Direct link to external injury reports via PuckPedia

### 🎨 Dynamic Team Theming
- Unique color schemes for all 32 NHL teams
- Automatic theme switching when selecting a different team
- Responsive layout for desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) primitives
  - [Phosphor Icons](https://phosphoricons.com/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query)
- **State Management**: [@github/spark](https://github.com/githubnext/spark) hooks
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## 📦 Distribution

This project is available in multiple formats for easy deployment:

> **Note**: Docker images and npm package publishing are configured and ready. If you're the maintainer, see the deployment section for publishing instructions.

### Docker Images

Pre-built Docker images are published to GitHub Container Registry:
- **Registry**: `ghcr.io/wilsonwong1990/nhl-stats-tracker`
- **Tags**: `latest`, `v{version}`, `main`
- **Size**: ~50MB (optimized multi-stage build)
- **Base**: Nginx Alpine (production-ready)

View available images: [GitHub Packages](https://github.com/wilsonwong1990/nhl-stats-tracker/pkgs/container/nhl-stats-tracker)

### npm Package

Published to npm registry for use as a library:
- **Package**: `nhl-stats-tracker`
- **Version**: Check [npm](https://www.npmjs.com/package/nhl-stats-tracker) for latest
- **Bundle Size**: Tree-shakeable, minimal footprint
- **TypeScript**: Full type definitions included

```bash
npm view nhl-stats-tracker versions  # View all available versions
```

## 🚀 Getting Started

### Quick Start (Pre-built Packages)

#### Using Pre-built Docker Image

If you just want to run the application without building from source, you can use the pre-built Docker image:

```bash
# Pull and run the latest image
docker run -d -p 3000:80 --name nhl-stats-tracker ghcr.io/wilsonwong1990/nhl-stats-tracker:latest

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

#### Using as an npm Package

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

---

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn** package manager
- **Docker** (optional, for containerized deployment)

### Installation Methods (Build from Source)

#### Option 1: Standard npm Installation

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

#### Option 2: Using Docker

##### Using Docker Compose (Recommended)

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

##### Using Docker Directly

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

### Available Scripts

- `npm run dev` - Start the development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint to check code quality
- `npm run optimize` - Optimize dependencies

### Package Manager Alternatives

#### Using Yarn

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

#### Using pnpm

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

## 📁 Project Structure

```
nhl-stats-tracker/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components (buttons, cards, etc.)
│   │   └── StatLeaderCard.tsx  # Custom stat display component
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API clients
│   │   ├── nhl-api.ts   # NHL API integration
│   │   ├── teams.ts     # Team definitions and theming
│   │   └── utils.ts     # Helper utilities
│   ├── styles/          # Global styles and theme configuration
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── PRD.md              # Product Requirements Document
├── package.json        # Project dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## 🎨 Design

The application features dynamic theming that adapts to each NHL team's unique colors. Each team has a custom color palette including:
- **Primary Color** - Team's main brand color for accents and highlights
- **Secondary Color** - Complementary team color for additional accents
- **Background Colors** - Dark, professional backgrounds optimized for data display
- **Foreground Colors** - High-contrast text colors for excellent readability

The default theme is based on the Vegas Golden Knights colors (Steel Gray and Gold), but changes dynamically when you select a different team.

Typography uses the **Inter** font family for excellent readability across all data displays.

## 🔄 Data Sources

All live data is fetched from the official NHL API:
- Player statistics for the current season (points, goals, assists, plus/minus, shifts, goalie stats)
- Upcoming game schedules with real-time scores
- Team information, standings, and conference positions
- Complete team rosters with player positions

External data sources:
- **PuckPedia** - Injury reports and salary cap information

Data is cached for 24 hours to reduce API load and improve performance.

## 🌟 Created with GitHub Spark

This project began as a [GitHub Spark](https://githubnext.com/projects/github-spark) application. Spark is an AI-powered tool that helps developers rapidly prototype and build web applications using natural language descriptions.

The initial Spark commit SHA: `130d713a0092f5dfca3b7dd39bd6b69c0492e654`

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📝 Documentation

For detailed feature specifications and design decisions, see [PRD.md](./PRD.md).

---

**Track your favorite NHL team! 🏒**
