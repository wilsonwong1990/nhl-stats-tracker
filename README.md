# Vegas Golden Knights Stats Tracker ⚔️🏒

A comprehensive stats tracking application for the Vegas Golden Knights hockey team, providing real-time access to upcoming games, player statistics, and injury reports for the current season.

## 🎯 About This Project

This application was created using [GitHub Spark](https://githubnext.com/projects/github-spark), an AI-powered tool for rapidly building web applications. What started as a Spark project has evolved into a full-featured hockey statistics dashboard that pulls live data from the NHL API.

### Experience Qualities
- **Informative** - Presents complex hockey statistics in an easily digestible, organized manner
- **Professional** - Reflects the quality and seriousness of professional hockey with a polished interface
- **Dynamic** - Updates and navigates smoothly between game schedules while maintaining visual hierarchy

## ✨ Features

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
- **Block Leaders** - Defensive shot blocking leaders
- **Hit Leaders** - Physical play leaders
- **Goalie Save Percentage** - Goaltending performance

All statistics are fetched live from the NHL API and cached for 24 hours.

### 🏥 Injury Report
- Current injury status for all players
- Duration of injuries
- Clear indication when no players are injured

### 🎨 Team Customization
- Vegas Golden Knights team colors and branding
- Professional, data-focused design inspired by ESPN and NHL.com
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wilsonwong1990/vegas-golden-kn-iron.git
cd vegas-golden-kn-iron
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

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
vegas-golden-kn-iron/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API clients
│   ├── styles/          # Global styles and theme configuration
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── PRD.md              # Product Requirements Document
├── package.json        # Project dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## 🎨 Design

The application uses a triadic color scheme based on the Vegas Golden Knights team colors:
- **Steel Gray** - Primary text and headers
- **Gold** - Team's signature color for accents
- **Dark Charcoal** - Backgrounds and card surfaces
- **Vegas Gold** - Bright gold for CTAs and highlights

Typography uses the **Inter** font family for excellent readability across all data displays.

## 🔄 Data Sources

All live data is fetched from the official NHL API:
- Player statistics for the current season
- Upcoming game schedules
- Team information and standings

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

**Go Knights Go! ⚔️**
