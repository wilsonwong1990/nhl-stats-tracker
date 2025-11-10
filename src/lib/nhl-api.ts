const NHL_API_BASE = '/nhl-api/v1'
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
  expectedReturn?: string
  status?: string
  injuryType?: string
}

export interface RosterPlayer {
  name: string
  position: string
  number: number
}

export interface StandingsInfo {
  conferencePosition: number
  isWildcard: boolean
}

export interface TeamStats {
  games: Game[]
  pointLeaders: PlayerStat[]
  goalLeaders: PlayerStat[]
  assistLeaders: PlayerStat[]
  plusMinusLeaders: PlayerStat[]
  avgShiftsLeaders: PlayerStat[]
  goalieStats: PlayerStat[]
  injuries: InjuredPlayer[]
  roster: RosterPlayer[]
  standings: StandingsInfo
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
    const opponents = [
      'Avalanche', 'Kings', 'Oilers', 'Sharks', 'Ducks', 'Canucks', 'Jets', 'Wild',
      'Blues', 'Stars', 'Predators', 'Blackhawks', 'Red Wings', 'Blue Jackets',
      'Penguins', 'Capitals', 'Rangers', 'Islanders', 'Devils', 'Flyers',
      'Bruins', 'Sabres', 'Maple Leafs', 'Senators', 'Canadiens', 'Lightning',
      'Panthers', 'Hurricanes', 'Kraken', 'Flames', 'Mammoth'
    ]
    
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
    plusMinusLeaders: [
      { name: 'Jack Eichel', value: 15 },
      { name: 'Shea Theodore', value: 12 },
      { name: 'Alex Pietrangelo', value: 8 },
      { name: 'Mark Stone', value: 6 },
      { name: 'Ivan Barbashev', value: 4 }
    ],
    avgShiftsLeaders: [
      { name: 'Jack Eichel', value: 22.5 },
      { name: 'Shea Theodore', value: 25.8 },
      { name: 'Alex Pietrangelo', value: 24.2 },
      { name: 'Mark Stone', value: 21.1 },
      { name: 'William Karlsson', value: 20.3 }
    ],
    goalieStats: [
      { name: 'Adin Hill', value: 0.912 },
      { name: 'Logan Thompson', value: 0.908 },
      { name: 'Laurent Brossoit', value: 0.895 }
    ],
    injuries: [
      { name: 'Mark Stone', daysOut: 14 },
      { name: 'Zach Whitecloud', daysOut: 7 }
    ],
    roster: [
      { name: 'Jack Eichel', position: 'C', number: 9 },
      { name: 'Mark Stone', position: 'RW', number: 61 },
      { name: 'Ivan Barbashev', position: 'LW', number: 49 },
      { name: 'Tomas Hertl', position: 'C', number: 48 },
      { name: 'William Karlsson', position: 'C', number: 71 },
      { name: 'Shea Theodore', position: 'D', number: 27 },
      { name: 'Alex Pietrangelo', position: 'D', number: 7 },
      { name: 'Brayden McNabb', position: 'D', number: 3 },
      { name: 'Nicolas Hague', position: 'D', number: 14 },
      { name: 'Adin Hill', position: 'G', number: 33 },
      { name: 'Laurent Brossoit', position: 'G', number: 39 }
    ],
    standings: {
      conferencePosition: 3,
      isWildcard: false
    }
  }
}

export async function fetchVGKSchedule(): Promise<Game[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  
  try {
    const currentDate = new Date().toISOString().split('T')[0]
    const url = `${NHL_API_BASE}/club-schedule-season/${VGK_TEAM_ABBREV}/20252026`
    console.log('Fetching schedule from:', url)
    
    const response = await fetch(url, {
      signal: controller.signal,
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
    console.log('Schedule data received, games:', data.games?.length || 0)
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
    
    console.log('Successfully parsed', games.length, 'upcoming games')
    return games
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Timeout fetching VGK schedule')
      throw new Error('Request timeout - please try again')
    }
    console.error('Error fetching VGK schedule:', error)
    throw error
  }
}

async function fetchStandings(): Promise<StandingsInfo> {
  try {
    // NHL API endpoint for current standings
    const standingsUrl = `${NHL_API_BASE}/standings/now`
    
    console.log('Fetching standings data:', standingsUrl)
    const response = await fetch(standingsUrl, {
      headers: { 'Accept': 'application/json' }
    })
    
    if (!response.ok) {
      console.error('Standings fetch failed:', response.status, response.statusText)
      return { conferencePosition: 0, isWildcard: false }
    }
    
    const data = await response.json()
    console.log('Standings data received')
    
    // Find Vegas Golden Knights in the standings
    const conferences = data.standings || []
    for (const conference of conferences) {
      if (conference.teams) {
        for (let i = 0; i < conference.teams.length; i++) {
          const team = conference.teams[i]
          if (team.teamAbbrev?.default === VGK_TEAM_ABBREV || team.teamAbbrev === VGK_TEAM_ABBREV) {
            const position = i + 1
            // In NHL, typically positions 9+ in conference are wildcard spots
            const isWildcard = position >= 9
            
            console.log(`VGK found at conference position ${position}, wildcard: ${isWildcard}`)
            return { conferencePosition: position, isWildcard }
          }
        }
      }
    }
    
    console.log('VGK not found in standings, using default')
    return { conferencePosition: 0, isWildcard: false }
  } catch (error) {
    console.error('Error fetching standings:', error)
    return { conferencePosition: 0, isWildcard: false }
  }
}

async function fetchPuckPediaInjuries(): Promise<InjuredPlayer[]> {
  try {
    console.log('Fetching VGK injury data from PuckPedia')
    
    // Try their API endpoint instead of HTML scraping
    const response = await fetch('/puckpedia-api/api/teams/vegas-golden-knights/injuries', {
      headers: { 
        'Accept': 'application/json',
        'Referer': 'https://puckpedia.com/'
      }
    })
    
    if (!response.ok) {
      console.error('PuckPedia API fetch failed:', response.status, response.statusText)
      
      // Try the HTML page with better headers
      const htmlResponse = await fetch('/puckpedia-api/team/vegas-golden-knights/injuries', {
        headers: { 
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://puckpedia.com/',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin'
        }
      })
      
      if (!htmlResponse.ok) {
        console.error('PuckPedia HTML fetch also failed:', htmlResponse.status, htmlResponse.statusText)
        return []
      }
      
      return await parseHTMLInjuries(htmlResponse)
    }
    
    // If JSON endpoint works, parse it
    const data = await response.json()
    console.log('PuckPedia JSON data received:', data)
    
    return parseJSONInjuries(data)
    
  } catch (error) {
    console.error('Error fetching PuckPedia VGK injuries:', error)
    return []
  }
}

async function parseHTMLInjuries(response: Response): Promise<InjuredPlayer[]> {
  const html = await response.text()
  console.log('PuckPedia HTML response received, length:', html.length)
  
  const injuries: InjuredPlayer[] = []
  
  // Parse HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Find all player links
  const playerLinks = doc.querySelectorAll('a[href*="/player/"]')
  console.log('Found', playerLinks.length, 'player links')
  
  for (const link of playerLinks) {
    const playerName = link.textContent?.trim()
    if (!playerName) continue
    
    // Get surrounding text to find injury details
    let currentNode: Node | null = link.parentElement
    let searchText = ''
    
    // Go up a few levels to get more context
    for (let i = 0; i < 3 && currentNode; i++) {
      searchText = currentNode.textContent || ''
      if (searchText.includes('Expected Return')) {
        break
      }
      currentNode = currentNode.parentElement
    }
    
    if (!searchText) continue
    
    // Extract status and injury type - look for patterns like "IR-LT | WRIST" or "OUT | LOWER BODY"
    const statusPattern = /(OUT|IR-LT|IR-NR|IR|LTIR|SUSPENSION)\s*\|\s*([A-Z\s]+)/i
    const statusMatch = searchText.match(statusPattern)
    
    let status = ''
    let injuryType = ''
    
    if (statusMatch) {
      status = statusMatch[1].trim()
      injuryType = statusMatch[2].trim()
    }
    
    // Extract expected return date
    const returnPattern = /Expected Return:\s*([A-Za-z]+\s+\d+,\s+\d+)/i
    const returnMatch = searchText.match(returnPattern)
    
    let expectedReturn = ''
    let daysOut = 7
    
    if (returnMatch) {
      expectedReturn = returnMatch[1].trim()
      
      // Calculate days out from return date
      try {
        const returnDate = new Date(expectedReturn)
        const today = new Date()
        const diffTime = returnDate.getTime() - today.getTime()
        daysOut = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
      } catch (e) {
        console.warn('Could not parse return date:', expectedReturn)
      }
    }
    
    // Only add if we found some injury information
    if (status || expectedReturn) {
      injuries.push({
        name: playerName,
        daysOut: daysOut,
        expectedReturn: expectedReturn || undefined,
        status: status || undefined,
        injuryType: injuryType || undefined
      })
      
      console.log(`Found injury: ${playerName} - ${status} | ${injuryType} - Returns: ${expectedReturn}`)
    }
  }
  
  console.log('Total injuries found:', injuries.length)
  return injuries
}

function parseJSONInjuries(data: any): InjuredPlayer[] {
  const injuries: InjuredPlayer[] = []
  
  // Parse JSON structure (we'll need to see what the actual structure is)
  if (Array.isArray(data)) {
    for (const injury of data) {
      injuries.push({
        name: injury.playerName || injury.name || 'Unknown',
        daysOut: injury.daysOut || 7,
        expectedReturn: injury.expectedReturn || injury.returnDate || undefined,
        status: injury.status || undefined,
        injuryType: injury.injuryType || injury.injury || undefined
      })
    }
  }
  
  return injuries
}

export async function fetchVGKStats(): Promise<Omit<TeamStats, 'games'>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  
  try {
    // Try multiple endpoints to get the most comprehensive stats
    const endpoints = [
      `${NHL_API_BASE}/club-stats/${VGK_TEAM_ABBREV}/20252026/2`,
      `${NHL_API_BASE}/club-stats-season/${VGK_TEAM_ABBREV}/20252026`,
      `${NHL_API_BASE}/roster/${VGK_TEAM_ABBREV}/20252026`,
    ]
    
    // Fetch NHL stats, PuckPedia injuries, and standings in parallel
    const [nhelpResponses, puckpediaInjuries, standings] = await Promise.allSettled([
      Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(endpoint, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          })
        )
      ),
      fetchPuckPediaInjuries(),
      fetchStandings()
    ])
    
    clearTimeout(timeout)
    
    let data: any = null
    let playerData: any = null
    let rosterData: any = null
    let injuries: InjuredPlayer[] = []
    let standingsInfo: StandingsInfo = { conferencePosition: 0, isWildcard: false }
    
    // Extract NHL API responses
    const responses = nhelpResponses.status === 'fulfilled' ? nhelpResponses.value : []
    
    // Extract injury data
    if (puckpediaInjuries.status === 'fulfilled') {
      injuries = puckpediaInjuries.value
      console.log('✓ PuckPedia injuries loaded:', injuries.length, 'injuries')
    } else {
      console.log('✗ PuckPedia injuries failed:', puckpediaInjuries.reason)
      injuries = [{ name: 'No current injuries reported', daysOut: 0 }]
    }
    
    // Extract standings data
    if (standings.status === 'fulfilled') {
      standingsInfo = standings.value
      console.log('✓ Standings loaded: position', standingsInfo.conferencePosition, 'wildcard:', standingsInfo.isWildcard)
    } else {
      console.log('✗ Standings failed:', standings.reason)
      standingsInfo = { conferencePosition: 0, isWildcard: false }
    }
    
    // Check first endpoint (club-stats)
    if (responses[0]?.status === 'fulfilled' && responses[0].value.ok) {
      data = await responses[0].value.json()
      console.log('Club stats data received, skaters:', data.skaters?.length || 0, 'goalies:', data.goalies?.length || 0)
    }
    
    // Check second endpoint (club-stats-season)
    if (responses[1]?.status === 'fulfilled' && responses[1].value.ok) {
      playerData = await responses[1].value.json()
      console.log('Season stats data received:', Object.keys(playerData || {}))
      console.log('Sample season data:', playerData?.skaters?.[0] || playerData?.players?.[0])
    }
    
    // Check third endpoint (roster)
    if (responses[2]?.status === 'fulfilled' && responses[2].value.ok) {
      rosterData = await responses[2].value.json()
      console.log('Roster data received:', Object.keys(rosterData || {}))
      console.log('Sample roster data:', rosterData?.forwards?.[0] || rosterData?.defensemen?.[0] || rosterData?.goalies?.[0])
    }
    
    // If we don't have any data, throw an error
    if (!data && !playerData) {
      console.error('All stats endpoints failed')
      throw new Error('Failed to fetch team stats from all endpoints')
    }
    
    // Use the more detailed data if available, otherwise fall back to basic stats
    const skaters = (playerData?.skaters || playerData?.players || data?.skaters || []) as any[]
    const goalies = (playerData?.goalies || data?.goalies || []) as any[]
    
    console.log('Final skater count:', skaters.length)
    console.log('Sample skater data:', skaters[0]) // Debug log
    console.log('Sample goalie data:', goalies[0]) // Debug log
    
    // Debug: Log all available fields for the first skater
    if (skaters[0]) {
      console.log('Available skater fields:', Object.keys(skaters[0]))
    }
    
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
    
    const plusMinusLeaders = [...skaters]
      .sort((a, b) => (b.plusMinus || b.plus_minus || b.plusMinusValue || 0) - (a.plusMinus || a.plus_minus || a.plusMinusValue || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.plusMinus || p.plus_minus || p.plusMinusValue || 0
      }))
    
    console.log('Plus/minus leaders parsed:', plusMinusLeaders.length, 'players')
    
    const avgShiftsLeaders = [...skaters]
      .sort((a, b) => (b.avgShiftsPerGame || b.avgShiftDuration || b.shiftDurationAvg || 0) - (a.avgShiftsPerGame || a.avgShiftDuration || a.shiftDurationAvg || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: parseFloat((p.avgShiftsPerGame || p.avgShiftDuration || p.shiftDurationAvg || 0).toFixed(1))
      }))
      
    console.log('Average shifts leaders parsed:', avgShiftsLeaders.length, 'players')
    
    const goalieStats = [...goalies]
      .filter(g => (g.gamesPlayed || 0) > 0)
      .sort((a, b) => (b.savePctg || b.savePercentage || 0) - (a.savePctg || a.savePercentage || 0))
      .slice(0, 3)
      .map(g => ({
        name: `${g.firstName?.default || ''} ${g.lastName?.default || ''}`.trim(),
        value: parseFloat((g.savePctg || g.savePercentage || 0).toFixed(3))
      }))
    
    console.log('Successfully parsed stats leaders')
    
    // Only return data we actually have - no mock fallbacks
    return {
      pointLeaders,
      goalLeaders,
      assistLeaders,
      plusMinusLeaders: plusMinusLeaders.length > 0 ? plusMinusLeaders : [
        { name: 'Plus/minus stats unavailable', value: 0 }
      ],
      avgShiftsLeaders: avgShiftsLeaders.length > 0 ? avgShiftsLeaders : [
        { name: 'Shift stats unavailable', value: 0 }
      ],
      goalieStats,
      injuries: injuries.length > 0 ? injuries : [
        { name: 'No current injuries reported', daysOut: 0 }
      ],
      roster: (() => {
        // Function to get position sort order
        const getPositionOrder = (position: string): number => {
          const pos = position.toUpperCase();
          if (pos === 'C') return 1;
          if (pos === 'R' || pos === 'RW') return 2;
          if (pos === 'L' || pos === 'LW') return 3;
          if (pos === 'D') return 4;
          if (pos === 'G') return 5;
          return 6; // Unknown positions go last
        };

        // Try to build roster from dedicated roster endpoint first
        if (rosterData) {
          console.log('Building roster from roster endpoint')
          const allPlayers = [
            ...(rosterData.forwards || []),
            ...(rosterData.defensemen || []),
            ...(rosterData.goalies || [])
          ];
          
          if (allPlayers.length > 0) {
            return allPlayers.slice(0, 25).map((player: any) => {
              const name = `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim();
              const position = player.position || player.positionCode || 'F';
              const number = player.sweaterNumber || player.number || player.jerseyNumber || player.uniformNumber || 0;
              
              // Debug log for first few players from roster
              if (allPlayers.indexOf(player) < 3) {
                console.log('Roster player data:', {
                  name,
                  position,
                  number,
                  availableFields: Object.keys(player)
                });
              }
              
              return { name, position, number };
            })
            .sort((a, b) => {
              const orderA = getPositionOrder(a.position);
              const orderB = getPositionOrder(b.position);
              if (orderA !== orderB) {
                return orderA - orderB;
              }
              // If same position, sort by name alphabetically
              return a.name.localeCompare(b.name);
            });
          }
        }
        
        // Fallback to stats data
        console.log('Building roster from stats data')
        return skaters.slice(0, 20).map((player: any) => {
          const name = `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim();
          const position = player.position || player.positionCode || 'F';
          const number = player.sweaterNumber || player.number || player.jerseyNumber || player.uniformNumber || 0;
          
          // Debug log for the first few players
          if (skaters.indexOf(player) < 3) {
            console.log('Stats player data for roster:', {
              name,
              position,
              number,
              availableFields: Object.keys(player)
            });
          }
          
          return { name, position, number };
        })
        .sort((a, b) => {
          const orderA = getPositionOrder(a.position);
          const orderB = getPositionOrder(b.position);
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          // If same position, sort by name alphabetically
          return a.name.localeCompare(b.name);
        });
      })(),
      standings: standingsInfo
    }
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Timeout fetching VGK stats')
      throw new Error('Request timeout - please try again')
    }
    console.error('Error fetching VGK stats:', error)
    throw error
  }
}

export async function fetchAllVGKData(): Promise<TeamStats> {
  console.log('Starting NHL API data fetch...')
  
  const [gamesResult, statsResult] = await Promise.allSettled([
    fetchVGKSchedule(),
    fetchVGKStats()
  ])
  
  let games: Game[] = []
  let stats: Omit<TeamStats, 'games'>
  
  if (gamesResult.status === 'fulfilled') {
    games = gamesResult.value
    console.log('✓ Schedule loaded successfully:', games.length, 'games')
  } else {
    console.error('✗ Schedule fetch failed:', gamesResult.reason)
    throw new Error('Unable to fetch schedule data from NHL API - check console for details')
  }
  
  if (statsResult.status === 'fulfilled') {
    stats = statsResult.value
    console.log('✓ Stats loaded successfully')
  } else {
    console.error('✗ Stats fetch failed:', statsResult.reason)
    throw new Error('Unable to fetch stats data from NHL API - check console for details')
  }
  
  console.log('✓ All data loaded successfully')
  return {
    games,
    ...stats
  }
}
