const NHL_API_BASE = 'https://api-web.nhle.com/v1'
const VGK_TEAM_ABBREV = 'VGK'

export interface Game {
  id: string
  opponent: string
  date: string
  time: string
  isHome: boolean
}

export interface PlayerStat {
  name: string
  value: number
}

export interface InjuredPlayer {
  name: string
  daysOut: number
}

export interface TeamStats {
  games: Game[]
  pointLeaders: PlayerStat[]
  goalLeaders: PlayerStat[]
  assistLeaders: PlayerStat[]
  blockLeaders: PlayerStat[]
  hitLeaders: PlayerStat[]
  goalieStats: PlayerStat[]
  injuries: InjuredPlayer[]
}

function convertToPST(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export async function fetchVGKSchedule(): Promise<Game[]> {
  try {
    const currentDate = new Date().toISOString().split('T')[0]
    const response = await fetch(`${NHL_API_BASE}/club-schedule-season/${VGK_TEAM_ABBREV}/20252026`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule')
    }
    
    const data = await response.json()
    const games: Game[] = []
    
    if (data.games && Array.isArray(data.games)) {
      for (const game of data.games) {
        const gameDate = game.gameDate.split('T')[0]
        if (gameDate >= currentDate) {
          const isHome = game.homeTeam?.abbrev === VGK_TEAM_ABBREV
          const opponent = isHome ? game.awayTeam?.placeName?.default : game.homeTeam?.placeName?.default
          const opponentAbbrev = isHome ? game.awayTeam?.abbrev : game.homeTeam?.abbrev
          
          games.push({
            id: game.id.toString(),
            opponent: opponent || opponentAbbrev || 'TBD',
            date: game.gameDate.split('T')[0],
            time: convertToPST(game.startTimeUTC),
            isHome
          })
        }
      }
    }
    
    return games
  } catch (error) {
    console.error('Error fetching VGK schedule:', error)
    throw error
  }
}

export async function fetchVGKStats(): Promise<Omit<TeamStats, 'games'>> {
  try {
    const rosterResponse = await fetch(`${NHL_API_BASE}/roster/${VGK_TEAM_ABBREV}/current`)
    
    if (!rosterResponse.ok) {
      throw new Error('Failed to fetch roster')
    }
    
    const rosterData = await rosterResponse.json()
    
    const playerStats: Array<{
      name: string
      goals: number
      assists: number
      points: number
      blocks: number
      hits: number
      isGoalie: boolean
      savePercentage: number
    }> = []
    
    if (rosterData.forwards) {
      for (const player of rosterData.forwards) {
        try {
          const statsResponse = await fetch(`${NHL_API_BASE}/player/${player.id}/landing`)
          if (statsResponse.ok) {
            const stats = await statsResponse.json()
            const seasonStats = stats.featuredStats?.regularSeason?.subSeason || stats.featuredStats?.regularSeason
            
            if (seasonStats) {
              playerStats.push({
                name: `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim(),
                goals: seasonStats.goals || 0,
                assists: seasonStats.assists || 0,
                points: seasonStats.points || 0,
                blocks: seasonStats.blockedShots || 0,
                hits: seasonStats.hits || 0,
                isGoalie: false,
                savePercentage: 0
              })
            }
          }
        } catch (error) {
          console.error(`Error fetching stats for player ${player.id}:`, error)
        }
      }
    }
    
    if (rosterData.defensemen) {
      for (const player of rosterData.defensemen) {
        try {
          const statsResponse = await fetch(`${NHL_API_BASE}/player/${player.id}/landing`)
          if (statsResponse.ok) {
            const stats = await statsResponse.json()
            const seasonStats = stats.featuredStats?.regularSeason?.subSeason || stats.featuredStats?.regularSeason
            
            if (seasonStats) {
              playerStats.push({
                name: `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim(),
                goals: seasonStats.goals || 0,
                assists: seasonStats.assists || 0,
                points: seasonStats.points || 0,
                blocks: seasonStats.blockedShots || 0,
                hits: seasonStats.hits || 0,
                isGoalie: false,
                savePercentage: 0
              })
            }
          }
        } catch (error) {
          console.error(`Error fetching stats for player ${player.id}:`, error)
        }
      }
    }
    
    if (rosterData.goalies) {
      for (const player of rosterData.goalies) {
        try {
          const statsResponse = await fetch(`${NHL_API_BASE}/player/${player.id}/landing`)
          if (statsResponse.ok) {
            const stats = await statsResponse.json()
            const seasonStats = stats.featuredStats?.regularSeason?.subSeason || stats.featuredStats?.regularSeason
            
            if (seasonStats) {
              playerStats.push({
                name: `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim(),
                goals: 0,
                assists: 0,
                points: 0,
                blocks: 0,
                hits: 0,
                isGoalie: true,
                savePercentage: seasonStats.savePctg || 0
              })
            }
          }
        } catch (error) {
          console.error(`Error fetching stats for goalie ${player.id}:`, error)
        }
      }
    }
    
    const pointLeaders = playerStats
      .filter(p => !p.isGoalie)
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)
      .map(p => ({ name: p.name, value: p.points }))
    
    const goalLeaders = playerStats
      .filter(p => !p.isGoalie)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 5)
      .map(p => ({ name: p.name, value: p.goals }))
    
    const assistLeaders = playerStats
      .filter(p => !p.isGoalie)
      .sort((a, b) => b.assists - a.assists)
      .slice(0, 5)
      .map(p => ({ name: p.name, value: p.assists }))
    
    const blockLeaders = playerStats
      .filter(p => !p.isGoalie)
      .sort((a, b) => b.blocks - a.blocks)
      .slice(0, 5)
      .map(p => ({ name: p.name, value: p.blocks }))
    
    const hitLeaders = playerStats
      .filter(p => !p.isGoalie)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 5)
      .map(p => ({ name: p.name, value: p.hits }))
    
    const goalieStats = playerStats
      .filter(p => p.isGoalie)
      .sort((a, b) => b.savePercentage - a.savePercentage)
      .slice(0, 3)
      .map(p => ({ name: p.name, value: p.savePercentage }))
    
    return {
      pointLeaders,
      goalLeaders,
      assistLeaders,
      blockLeaders,
      hitLeaders,
      goalieStats,
      injuries: []
    }
  } catch (error) {
    console.error('Error fetching VGK stats:', error)
    throw error
  }
}

export async function fetchAllVGKData(): Promise<TeamStats> {
  const [games, stats] = await Promise.all([
    fetchVGKSchedule(),
    fetchVGKStats()
  ])
  
  return {
    games,
    ...stats
  }
}
