# NHL Stats Tracker 🏒

A stats tracking application for all NHL teams, providing real-time access to upcoming games, player statistics, and injury reports for the current season. Track all 32 teams with data from the [NHL API (based on the unofficial reference from Zmalski)](https://github.com/Zmalski/NHL-API-Reference).

<img width="1728" height="2897" alt="NHL Stats Tracker" src="https://github.com/user-attachments/assets/2928247c-5189-491d-9383-d804c69b9624" />

> **🚀 Ready to get started?** See [INSTALLATION.md](./INSTALLATION.md) for setup instructions.

## 🎯 About This Project

This application was originally created using [GitHub Spark](https://githubnext.com/projects/github-spark). What started as a Spark project focused on the Vegas Golden Knights has evolved into a comprehensive hockey statistics dashboard that supports all 32 NHL teams and pulls live data from the NHL API.

### Project History

- **Origin**: Built with [GitHub Spark](https://githubnext.com/projects/github-spark), an AI-powered tool for rapid web application prototyping
- **Initial Spark commit SHA**: `130d713a0092f5dfca3b7dd39bd6b69c0492e654`
- **Evolution**: Expanded from a single-team tracker to a full 32-team NHL statistics dashboard
- **Current Status**: Active development with regular updates and improvements


## ✨ Features
### 🏒 Team Selection
- Choose from all 32 NHL teams via an easy-to-use dropdown selector
- Dynamic theme updates based on selected team's colors and branding
- Remembers your team preference across sessions
- Defaults to Vegas Golden Knights (configurable in `src/lib/teams.ts`)


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
- **TypeScript**: Full type definitions included
- **Bundle Size**: Tree-shakeable, minimal footprint

```bash
npm view nhl-stats-tracker versions  # View all available versions
```

> **Installation instructions**: See [INSTALLATION.md](./INSTALLATION.md) for detailed setup guides.

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

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📝 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Setup and deployment instructions
- **[Product Requirements](./PRD.md)** - Detailed feature specifications and design decisions
- **[Docker Guide](./DOCKER.md)** - Docker-specific usage instructions

---

**Track your favorite NHL team! 🏒**
