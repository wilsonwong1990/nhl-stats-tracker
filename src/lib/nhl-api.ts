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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const currentDate = new Date().toISOString().split('T')[0]
    const response = await fetch(`${NHL_API_BASE}/club-schedule-season/${VGK_TEAM_ABBREV}/20242025`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schedule: ${response.status} ${response.statusText}`)
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
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Timeout fetching VGK schedule')
      throw new Error('Request timeout - please try again')
    }
    console.error('Error fetching VGK schedule:', error)
    throw error
  }
}

export async function fetchVGKStats(): Promise<Omit<TeamStats, 'games'>> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    
    const statsResponse = await fetch(`${NHL_API_BASE}/club-stats/${VGK_TEAM_ABBREV}/20242025/2`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    
    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch team stats: ${statsResponse.status}`)
    }
    
    const data = await statsResponse.json()
    
    const skaters = data.skaters || []
    const goalies = data.goalies || []
    
    const pointLeaders = [...skaters]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.points || 0
      }))
    
    const goalLeaders = [...skaters]
      .sort((a, b) => (b.goals || 0) - (a.goals || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.goals || 0
      }))
    
    const assistLeaders = [...skaters]
      .sort((a, b) => (b.assists || 0) - (a.assists || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.assists || 0
      }))
    
    const blockLeaders = [...skaters]
      .sort((a, b) => (b.blockedShots || 0) - (a.blockedShots || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.blockedShots || 0
      }))
    
    const hitLeaders = [...skaters]
      .sort((a, b) => (b.hits || 0) - (a.hits || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.hits || 0
      }))
    
    const goalieStats = [...goalies]
      .filter(g => (g.gamesPlayed || 0) > 0)
      .sort((a, b) => (b.savePctg || 0) - (a.savePctg || 0))
      .slice(0, 3)
      .map(g => ({
        name: `${g.firstName?.default || ''} ${g.lastName?.default || ''}`.trim(),
        value: g.savePctg || 0
      }))
    
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
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Timeout fetching VGK stats')
      throw new Error('Request timeout - please try again')
    }
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
