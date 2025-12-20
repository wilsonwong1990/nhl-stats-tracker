/**
 * Utility functions for NHL season management
 */

export interface SeasonInfo {
  id: string // Format: "20242025" for 2024-2025 season
  displayName: string // Format: "2024-2025"
  startYear: number
  endYear: number
}

/**
 * Get the current NHL season based on the current date.
 * NHL seasons typically run from October to June of the following year.
 */
export function getCurrentSeason(): SeasonInfo {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-12
  
  // If we're in Jan-September, the season started last year
  // If we're in October-Dec, the season starts this year
  const startYear = currentMonth >= 10 ? currentYear : currentYear - 1
  const endYear = startYear + 1
  
  return {
    id: `${startYear}${endYear}`,
    displayName: `${startYear}-${endYear}`,
    startYear,
    endYear
  }
}

/**
 * Generate a list of available NHL seasons.
 * Goes back 25 seasons from current season and includes potential future seasons.
 * 
 * @param yearsBack Number of years to go back (default: 25)
 * @param yearsFuture Number of future seasons to include (default: 2)
 */
export function getAvailableSeasons(yearsBack: number = 25, yearsFuture: number = 2): SeasonInfo[] {
  const currentSeason = getCurrentSeason()
  const seasons: SeasonInfo[] = []
  
  // Generate past seasons
  for (let i = yearsBack; i > 0; i--) {
    const startYear = currentSeason.startYear - i
    const endYear = startYear + 1
    seasons.push({
      id: `${startYear}${endYear}`,
      displayName: `${startYear}-${endYear}`,
      startYear,
      endYear
    })
  }
  
  // Add current season
  seasons.push(currentSeason)
  
  // Generate future seasons
  for (let i = 1; i <= yearsFuture; i++) {
    const startYear = currentSeason.startYear + i
    const endYear = startYear + 1
    seasons.push({
      id: `${startYear}${endYear}`,
      displayName: `${startYear}-${endYear}`,
      startYear,
      endYear
    })
  }
  
  return seasons
}

/**
 * Get a specific season by its ID
 */
export function getSeasonById(seasonId: string): SeasonInfo | null {
  if (!seasonId || seasonId.length !== 8) {
    return null
  }
  
  const startYear = parseInt(seasonId.substring(0, 4))
  const endYear = parseInt(seasonId.substring(4, 8))
  
  if (isNaN(startYear) || isNaN(endYear) || endYear !== startYear + 1) {
    return null
  }
  
  return {
    id: seasonId,
    displayName: `${startYear}-${endYear}`,
    startYear,
    endYear
  }
}

/**
 * Format a season ID into a display name
 */
export function formatSeasonDisplay(seasonId: string): string {
  const season = getSeasonById(seasonId)
  return season ? season.displayName : seasonId
}
