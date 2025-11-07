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

function getMockData(): TeamStats {
  const today = new Date()
  const mockGames: Game[] = Array.from({ length: 15 }, (_, i) => {
    const gameDate = new Date(today)
    gameDate.setDate(today.getDate() + i + 1)
    const isHome = i % 2 === 0
    const opponents = ['Avalanche', 'Kings', 'Oilers', 'Sharks', 'Ducks', 'Canucks', 'Jets', 'Wild']
    
    return {
      id: `mock-${i}`,
      opponent: opponents[i % opponents.length],
      date: gameDate.toISOString().split('T')[0],
      time: i % 3 === 0 ? '7:00 PM' : i % 3 === 1 ? '7:30 PM' : '6:00 PM',
      isHome
    }
  })

  return {
    games: mockGames,
    pointLeaders: [
      { name: 'Jack Eichel', value: 45 },
      { name: 'Mark Stone', value: 38 },
      { name: 'Ivan Barbashev', value: 32 },
      { name: 'Tomas Hertl', value: 28 },
      { name: 'William Karlsson', value: 24 }
    ],
    goalLeaders: [
      { name: 'Jack Eichel', value: 22 },
      { name: 'Ivan Barbashev', value: 18 },
      { name: 'Mark Stone', value: 16 },
      { name: 'Tomas Hertl', value: 14 },
      { name: 'Jonathan Marchessault', value: 12 }
    ],
    assistLeaders: [
      { name: 'Jack Eichel', value: 23 },
      { name: 'Mark Stone', value: 22 },
      { name: 'Shea Theodore', value: 20 },
      { name: 'Tomas Hertl', value: 14 },
      { name: 'William Karlsson', value: 12 }
    ],
    blockLeaders: [
      { name: 'Brayden McNabb', value: 82 },
      { name: 'Shea Theodore', value: 68 },
      { name: 'Alex Pietrangelo', value: 62 },
      { name: 'Nicolas Hague', value: 58 },
      { name: 'Ben Hutton', value: 45 }
    ],
    hitLeaders: [
      { name: 'Keegan Kolesar', value: 145 },
      { name: 'Brayden McNabb', value: 128 },
      { name: 'Nicolas Hague', value: 112 },
      { name: 'William Carrier', value: 98 },
      { name: 'Ivan Barbashev', value: 87 }
    ],
    goalieStats: [
      { name: 'Adin Hill', value: 0.912 },
      { name: 'Logan Thompson', value: 0.908 },
      { name: 'Laurent Brossoit', value: 0.895 }
    ],
    injuries: [
      { name: 'Mark Stone', daysOut: 14 },
      { name: 'Zach Whitecloud', daysOut: 7 }
    ]
  }
}

export async function fetchVGKSchedule(): Promise<Game[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const currentDate = new Date().toISOString().split('T')[0]
    const url = `${NHL_API_BASE}/club-schedule-season/${VGK_TEAM_ABBREV}/20242025`
    console.log('Fetching schedule from:', url)
    
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    clearTimeout(timeout)
    
    if (!response.ok) {
      console.error('Schedule fetch failed:', response.status, response.statusText)
      throw new Error(`Failed to fetch schedule: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Schedule data received:', data)
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
    
    console.log('Parsed games:', games.length)
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
    
    const url = `${NHL_API_BASE}/club-stats/${VGK_TEAM_ABBREV}/20242025/2`
    console.log('Fetching stats from:', url)
    
    const statsResponse = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    clearTimeout(timeout)
    
    if (!statsResponse.ok) {
      console.error('Stats fetch failed:', statsResponse.status, statsResponse.statusText)
      throw new Error(`Failed to fetch team stats: ${statsResponse.status}`)
    }
    
    const data = await statsResponse.json()
    console.log('Stats data received:', data)
    
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
    
    console.log('Parsed leaders:', { pointLeaders: pointLeaders.length, goalLeaders: goalLeaders.length })
    
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
  try {
    console.log('Starting data fetch...')
    const [games, stats] = await Promise.all([
      fetchVGKSchedule().catch(err => {
        console.error('Schedule fetch failed, using mock data:', err)
        return getMockData().games
      }),
      fetchVGKStats().catch(err => {
        console.error('Stats fetch failed, using mock data:', err)
        const mockData = getMockData()
        return {
          pointLeaders: mockData.pointLeaders,
          goalLeaders: mockData.goalLeaders,
          assistLeaders: mockData.assistLeaders,
          blockLeaders: mockData.blockLeaders,
          hitLeaders: mockData.hitLeaders,
          goalieStats: mockData.goalieStats,
          injuries: mockData.injuries
        }
      })
    ])
    
    console.log('Data fetch complete:', { gamesCount: games.length })
    
    return {
      games,
      ...stats
    }
  } catch (error) {
    console.error('Complete data fetch failed, using all mock data:', error)
    return getMockData()
  }
}
