# Vegas Golden Knights Stats Tracker

A comprehensive stats tracking application for the Vegas Golden Knights hockey team, providing real-time access to upcoming games, player statistics, and injury reports for the current season.

**Experience Qualities**:
1. **Informative** - Presents complex hockey statistics in an easily digestible, organized manner that fans can quickly scan
2. **Professional** - Reflects the quality and seriousness of professional hockey with a polished, data-focused interface
3. **Dynamic** - Updates and navigates smoothly between game schedules while maintaining visual hierarchy

**Complexity Level**: Light Application (multiple features with basic state)
  - Features include schedule navigation, multiple stat leader boards, and injury tracking with persistent pagination state

## Essential Features

### Upcoming Games Schedule
- **Functionality**: Displays next 10 upcoming games with opponent, home/away status, and PST start time, fetched from NHL API
- **Purpose**: Allows fans to quickly see when and where the team plays next with real-time data
- **Trigger**: Loads automatically on page load, fetches from NHL API, caches for 24 hours
- **Progression**: View current 10 games → Click next/previous arrows → View different set of 10 games → Pagination state persists → Data refreshes daily
- **Success criteria**: All game details clearly visible in table format with working pagination controls and live data from NHL

### Point Leaders Board
- **Functionality**: Shows top players by total points (goals + assists) for current season, fetched from NHL API
- **Purpose**: Highlights overall offensive contributors with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by points → Shows rank, player name, and point total → Data refreshes daily
- **Success criteria**: Clear ranking of top point scorers with accurate, live statistics from NHL

### Goal Leaders Board
- **Functionality**: Shows top goal scorers for current season, fetched from NHL API
- **Purpose**: Identifies pure goal-scoring leaders with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by goals → Shows rank, player name, and goal total → Data refreshes daily
- **Success criteria**: Clear ranking of top goal scorers with accurate, live statistics from NHL

### Assist Leaders Board
- **Functionality**: Shows top assist leaders for current season, fetched from NHL API
- **Purpose**: Highlights playmaking ability with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by assists → Shows rank, player name, and assist total → Data refreshes daily
- **Success criteria**: Clear ranking of top assist leaders with accurate, live statistics from NHL

### Block Leaders Board
- **Functionality**: Shows defensive leaders in blocked shots, fetched from NHL API
- **Purpose**: Highlights defensive contributions with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by blocks → Shows rank, player name, and block total → Data refreshes daily
- **Success criteria**: Clear ranking of top shot blockers with accurate, live statistics from NHL

### Hit Leaders Board
- **Functionality**: Shows physical play leaders in hits, fetched from NHL API
- **Purpose**: Identifies most physical players with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by hits → Shows rank, player name, and hit total → Data refreshes daily
- **Success criteria**: Clear ranking of top hitters with accurate, live statistics from NHL

### Goalie Save Percentage Board
- **Functionality**: Shows goalie performance by save percentage, fetched from NHL API
- **Purpose**: Highlights goaltending excellence with live stats
- **Trigger**: Displays automatically on load, fetches from NHL API, caches for 24 hours
- **Progression**: Data loads from API → Displays sorted list by save % → Shows rank, goalie name, and save percentage → Data refreshes daily
- **Success criteria**: Clear ranking with percentage formatted properly and accurate, live statistics from NHL

### Injury Report
- **Functionality**: Lists currently injured players with injury duration
- **Purpose**: Keeps fans informed of player availability
- **Trigger**: Displays automatically on load
- **Progression**: Data loads → Shows player names → Displays days/duration injured
- **Success criteria**: Clear list of injured players with time frames

## Edge Case Handling

- **No Upcoming Games**: Display message "No upcoming games scheduled" when schedule is empty
- **Empty Stat Categories**: Show placeholder text "No data available" if category has no players
- **No Injuries**: Display "No players currently injured" when injury list is empty
- **Pagination Boundaries**: Disable/hide previous arrow on first page, next arrow on last page
- **Loading States**: Show skeleton loaders while data is being fetched from NHL API
- **Long Player Names**: Truncate with ellipsis to maintain table layout
- **API Failures**: Show error message with retry button if NHL API fails to respond
- **Stale Data**: Display last updated timestamp, automatically refresh after 24 hours
- **Network Offline**: Use cached data if available, show "offline" indicator

## Design Direction

The design should feel professional and data-focused like ESPN or NHL.com stat pages, with a clean interface that emphasizes readability and quick information scanning. A minimal interface with clear data hierarchy serves the stats-heavy purpose better than rich visual elements.

## Color Selection

Triadic color scheme using Vegas Golden Knights team colors to create strong brand association while maintaining excellent readability for data-heavy content.

- **Primary Color**: Steel Gray (oklch(0.35 0.02 260)) - Represents the "Steel" in Golden Knights, used for primary text and headers, communicates professionalism and seriousness
- **Secondary Colors**: 
  - Gold (oklch(0.80 0.15 85)) - Team's signature gold color for accents and highlights
  - Dark Charcoal (oklch(0.20 0.01 260)) - Deep backgrounds and card surfaces
- **Accent Color**: Vegas Gold (oklch(0.75 0.13 80)) - Bright gold for CTAs, active states, and important metrics
- **Foreground/Background Pairings**:
  - Background (Dark Charcoal oklch(0.20 0.01 260)): Light gray text (oklch(0.95 0 0)) - Ratio 14.2:1 ✓
  - Card (Steel Gray oklch(0.25 0.02 260)): White text (oklch(0.98 0 0)) - Ratio 12.8:1 ✓
  - Primary (Steel Gray oklch(0.35 0.02 260)): White text (oklch(0.98 0 0)) - Ratio 8.5:1 ✓
  - Secondary (Dark Charcoal oklch(0.22 0.01 260)): Light text (oklch(0.92 0 0)) - Ratio 11.5:1 ✓
  - Accent (Vegas Gold oklch(0.75 0.13 80)): Dark text (oklch(0.20 0.01 260)) - Ratio 7.2:1 ✓
  - Muted (Mid Gray oklch(0.30 0.01 260)): Light gray text (oklch(0.85 0 0)) - Ratio 6.8:1 ✓

## Font Selection

Typography should communicate clarity and professionalism while maintaining excellent readability for dense statistical information, using a clean sans-serif that performs well for both headers and data tables.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold / 32px / tight letter-spacing / Gold accent
  - H2 (Section Headers): Inter SemiBold / 20px / normal letter-spacing
  - H3 (Card Titles): Inter Medium / 16px / normal letter-spacing
  - Body (Player Names): Inter Regular / 14px / normal letter-spacing
  - Data (Stats): Inter Medium / 14px / tabular-nums for alignment
  - Small (Labels): Inter Regular / 12px / slight letter-spacing

## Animations

Animations should be subtle and functional, primarily serving to smooth transitions between paginated game lists and provide feedback on interactive elements without distracting from data consumption.

- **Purposeful Meaning**: Smooth page transitions communicate data updates, hover states provide interactive feedback, loading states indicate processing
- **Hierarchy of Movement**: Pagination transitions are primary (200-300ms), hover effects are subtle (100-150ms), data loads fade in gently (300ms)

## Component Selection

- **Components**:
  - **Table**: For upcoming games schedule with custom styling for data density
  - **Card**: For each stat leader board with subtle elevation and borders
  - **Button**: For pagination arrows with icon-only design (Phosphor icons: CaretLeft, CaretRight)
  - **Badge**: For home/away indicators on games
  - **Separator**: To divide major sections visually
  - **Skeleton**: For loading states on initial data fetch
  
- **Customizations**:
  - Custom stat card component with header, sorted player list, and consistent spacing
  - Custom game table with time formatting and team logo placeholders
  - Injury duration badges with color coding (recent vs long-term)
  
- **States**:
  - Buttons: Subtle gold glow on hover, pressed state with slight scale, disabled state with reduced opacity
  - Cards: Subtle border highlight on hover for interactive elements
  - Table rows: Alternating subtle background tints for readability
  
- **Icon Selection**:
  - CaretLeft/CaretRight for pagination
  - Timer for game times
  - TrendUp for point leaders
  - Target for goal leaders  
  - HandsClapping for assist leaders
  - Shield for block leaders
  - Lightning for hit leaders
  - Crosshair for goalie stats
  - FirstAid for injury report
  
- **Spacing**:
  - Card padding: p-6
  - Section gaps: gap-6 for stat cards, gap-8 for major sections
  - Table cell padding: px-4 py-3
  - Consistent 24px (gap-6) between related elements
  
- **Mobile**:
  - Stack stat cards vertically on mobile (grid-cols-1 md:grid-cols-3)
  - Reduce card padding to p-4 on mobile
  - Horizontally scrollable game table on small screens
  - Larger touch targets (min-h-12) for pagination buttons
  - Adjust font sizes down by 2px on mobile for better fit
