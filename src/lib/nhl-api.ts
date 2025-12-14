const NHL_API_BASE = '/nhl-api/v1'
const DEFAULT_SEASON = '20252026'
// Optional mock data import (only used when env flag is set)
import getMockData from './mock-data'
import { DEFAULT_TEAM_ID, getTeamInfo, type TeamId, type TeamInfo } from './teams'


export interface Game {
  id: string
  opponent: string
  date: string
  time: string
  isHome: boolean
  homeScore?: number
  awayScore?: number
  gameState?: string // 'FUT' for future, 'LIVE' for live, 'FINAL' or 'OFF' for completed
  lastPeriodType?: string // 'REG', 'OT', 'SO', etc.
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
  captaincy?: 'C' | 'A' | null
}

export interface StandingsInfo {
  conferencePosition: number
  isWildcard: boolean
  divisionPosition?: number
  wins?: number
  losses?: number
  otLosses?: number
  points?: number
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

function getGameDateInPST(dateString: string): string {
  // Convert the full UTC datetime to PST and extract just the date
  const date = new Date(dateString)
  const pstDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
  return pstDate // Returns YYYY-MM-DD format
}

// Mock data moved to separate file: mock-data.ts

export async function fetchTeamSchedule(team: TeamInfo, season = DEFAULT_SEASON): Promise<Game[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  
  try {
    const url = `${NHL_API_BASE}/club-schedule-season/${team.nhlAbbrev}/${season}`
    console.log(`Fetching full season schedule for ${team.fullName} from:`, url)
    
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
    
    // Log the first completed game's ALL fields for debugging
    if (data.games && data.games.length > 0) {
      const completedGame = data.games.find((g: any) => g.gameState !== 'FUT' && g.gameState !== 'LIVE')
      if (completedGame) {
        console.log('===== FIRST COMPLETED GAME FROM SCHEDULE =====')
        console.log(JSON.stringify(completedGame, null, 2))
        console.log('===== END COMPLETED GAME =====')
      }
    }
    
    const games: Game[] = []
    
    if (data.games && Array.isArray(data.games)) {
      for (const game of data.games) {
        // Skip preseason games
        const gameType = game.gameType || 0
        if (gameType === 1) {
          continue // Skip preseason (gameType 1)
        }
        
        const isHome = game.homeTeam?.abbrev === team.nhlAbbrev
        const opponentTeam = isHome ? game.awayTeam : game.homeTeam
        const opponentPlaceName = opponentTeam?.placeName?.default || ''
        const opponentCommonName = opponentTeam?.commonName?.default || ''
        const opponentAbbrev = opponentTeam?.abbrev || ''
        const opponent = opponentPlaceName && opponentCommonName 
          ? `${opponentPlaceName} ${opponentCommonName}`
          : opponentPlaceName || opponentAbbrev || 'TBD'
        
        // Get scores if game is completed
        const homeScore = game.homeTeam?.score
        const awayScore = game.awayTeam?.score
        const gameState = game.gameState || 'FUT'
        
        const lastPeriodTypeCandidates = [
          game.gameOutcome?.lastPeriodType,
          game.gameOutcomeLastPeriodType,
          game.gameOutcome?.gameOutcome,
          game.gameOutcomeType,
          game.periodDescriptor?.periodType,
          game.periodDescriptor?.periodTypeName
        ] as Array<unknown>

        const lastPeriodType = lastPeriodTypeCandidates.find((value): value is string => {
          return typeof value === 'string' && value.trim().length > 0
        })

        games.push({
          id: game.id.toString(),
          opponent: opponent,
          date: getGameDateInPST(game.startTimeUTC), // Convert UTC start time to PST date
          time: convertToPST(game.startTimeUTC),
          isHome,
          homeScore: homeScore,
          awayScore: awayScore,
          gameState: gameState,
          lastPeriodType: lastPeriodType ? lastPeriodType.trim().toUpperCase() : undefined
        })
      }
    }
    
    console.log(`Successfully parsed ${games.length} total games (excluding preseason) for ${team.nhlAbbrev}`)
    return games
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout fetching ${team.nhlAbbrev} schedule`)
      throw new Error('Request timeout - please try again')
    }
    console.error(`Error fetching ${team.nhlAbbrev} schedule:`, error)
    throw error
  }
}

async function fetchStandings(teamInfo: TeamInfo): Promise<StandingsInfo> {
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
    console.log('===== FULL STANDINGS RESPONSE STRUCTURE =====')
    console.log(JSON.stringify(data, null, 2))
    console.log('===== END STANDINGS RESPONSE =====')
    
    // Find Vegas Golden Knights in the standings
    const conferences = data.standings || []
    for (const conference of conferences) {
      if (conference.teams) {
        for (let i = 0; i < conference.teams.length; i++) {
          const team = conference.teams[i]
          const abbrev = team.teamAbbrev?.default || team.teamAbbrev
          if (abbrev === teamInfo.nhlAbbrev) {
            console.log(`===== ${teamInfo.fullName} OBJECT FROM STANDINGS =====`)
            console.log(JSON.stringify(team, null, 2))
            console.log('===== END TEAM OBJECT =====')
            
            const position = i + 1
            const isWildcard = position >= 9
            // Attempt to derive division position if divisionSequence or divisionRank present
            const divisionPosition = team.divisionSequence || team.divisionRank || 0
            const wins = team.wins || team.winsOverall || team.record?.wins || 0
            const losses = team.losses || team.lossesOverall || team.record?.losses || 0
            const otLosses = team.otLosses || team.overtimeLosses || team.record?.ot || 0
            console.log(`${teamInfo.nhlAbbrev} standings parsed -> Conf: ${position}, Div: ${divisionPosition}, Record: ${wins}-${losses}-${otLosses}, Wildcard: ${isWildcard}`)
            return { conferencePosition: position, isWildcard, divisionPosition, wins, losses, otLosses }
          }
        }
      }
    }
    console.log(`${teamInfo.nhlAbbrev} not found in standings, using default`)
    return { conferencePosition: 0, isWildcard: false, divisionPosition: 0, wins: 0, losses: 0, otLosses: 0 }
  } catch (error) {
    console.error('Error fetching standings:', error)
    return { conferencePosition: 0, isWildcard: false, divisionPosition: 0, wins: 0, losses: 0, otLosses: 0 }
  }
}

async function fetchPuckPediaInjuries(team: TeamInfo): Promise<InjuredPlayer[]> {
  if (!team.puckpediaSlug) {
    console.warn(`No PuckPedia slug configured for ${team.fullName}`)
    return []
  }
  try {
    console.log(`Fetching ${team.fullName} injury data from PuckPedia`)
    
    // Try their API endpoint instead of HTML scraping
    const response = await fetch(`/puckpedia-api/api/teams/${team.puckpediaSlug}/injuries`, {
      headers: { 
        'Accept': 'application/json',
        'Referer': 'https://puckpedia.com/'
      }
    })
    
    if (!response.ok) {
      console.error('PuckPedia API fetch failed:', response.status, response.statusText)
      
      // Try the HTML page with better headers
      const htmlResponse = await fetch(`/puckpedia-api/team/${team.puckpediaSlug}/injuries`, {
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
    console.error(`Error fetching PuckPedia ${team.nhlAbbrev} injuries:`, error)
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

export async function fetchTeamStats(team: TeamInfo, season = DEFAULT_SEASON): Promise<Omit<TeamStats, 'games'>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  
  try {
    // Try multiple endpoints to get the most comprehensive stats
    const endpoints = [
      `${NHL_API_BASE}/club-stats/${team.nhlAbbrev}/${season}/2`,
      `${NHL_API_BASE}/club-stats-season/${team.nhlAbbrev}/${season}`,
      `${NHL_API_BASE}/roster/${team.nhlAbbrev}/${season}`,
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
      fetchPuckPediaInjuries(team),
      fetchStandings(team)
    ])
    
    clearTimeout(timeout)
    
    let data: any = null
    let playerData: any = null
    let rosterData: any = null
    let injuries: InjuredPlayer[] = []
    let standingsInfo: StandingsInfo = { conferencePosition: 0, isWildcard: false, divisionPosition: 0, wins: 0, losses: 0, otLosses: 0, points: 0 }
    
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
    if (standings.status === 'fulfilled') {
      standingsInfo = standings.value
      console.log('✓ Standings loaded: position', standingsInfo.conferencePosition, 'wildcard:', standingsInfo.isWildcard)
    } else {
      console.log('✗ Standings failed:', standings.reason)
      standingsInfo = { conferencePosition: 0, isWildcard: false, divisionPosition: 0, wins: 0, losses: 0, otLosses: 0, points: 0 }
    }
    if (responses[0]?.status === 'fulfilled' && responses[0].value.ok) {
      data = await responses[0].value.json()
      console.log(`${team.nhlAbbrev} club stats data received, skaters:`, data.skaters?.length || 0, 'goalies:', data.goalies?.length || 0)
    }
    
    // Check second endpoint (club-stats-season)
    if (responses[1]?.status === 'fulfilled' && responses[1].value.ok) {
      playerData = await responses[1].value.json()
      console.log(`${team.nhlAbbrev} season stats data received:`, Object.keys(playerData || {}))
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

        const normalizePosition = (raw: string | undefined): string => {
          if (!raw) return 'F';
          const p = raw.toString().trim().toUpperCase();
          if (['LW','LEFT WING','L'].includes(p)) return 'LW';
          if (['RW','RIGHT WING','R'].includes(p)) return 'RW';
          if (['C','CENTER'].includes(p)) return 'C';
          if (['D','DEF','DEFENSE','DEFENCEMAN'].includes(p)) return 'D';
          if (['G','GOALIE','GOALTENDER'].includes(p)) return 'G';
          // Some APIs use F for forwards
           if (['F','FORWARD'].includes(p)) return 'F';
          return p.length <= 3 ? p : 'F';
        };

        // Try to build roster from dedicated roster endpoint first
        if (rosterData) {
          console.log('Building roster from roster endpoint')
          const allPlayers = [
            ...(rosterData.forwards || []),
            ...(rosterData.defensemen || []),
            ...(rosterData.goalies || [])
          ];
          const seen = new Set<string>();
          const mapped = allPlayers.map((player: any, idx: number) => {
            const name = `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim();
            const positionRaw = player.position || player.positionCode || player.primaryPosition || 'F';
            const position = normalizePosition(positionRaw);
            const number = player.sweaterNumber || player.number || player.jerseyNumber || player.uniformNumber || 0;
            const captaincy = player.captaincy || null;
            if (idx < 3) {
              console.log('Roster player data (raw->normalized):', {
                name,
                positionRaw,
                position,
                number,
                captaincy,
                availableFields: Object.keys(player)
              });
            }
            return { name, position, number, captaincy };
          }).filter(p => {
            if (seen.has(p.name)) return false;
            seen.add(p.name);
            return true;
          });
          if (mapped.length > 0) {
            return mapped.sort((a, b) => {
              const orderA = getPositionOrder(a.position);
              const orderB = getPositionOrder(b.position);
              if (orderA !== orderB) return orderA - orderB;
              return a.name.localeCompare(b.name);
            });
          }
        }
        
        // Fallback to stats data
        console.log('Building roster from stats data')
        const seen = new Set<string>();
        const mapped = skaters.map((player: any, idx: number) => {
          const name = `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim();
          const positionRaw = player.position || player.positionCode || player.primaryPosition || 'F';
          const position = normalizePosition(positionRaw);
          const number = player.sweaterNumber || player.number || player.jerseyNumber || player.uniformNumber || 0;
          if (idx < 3) {
            console.log('Stats player data for roster (raw->normalized):', {
              name,
              positionRaw,
              position,
              number,
              availableFields: Object.keys(player)
            });
          }
          return { name, position, number };
        }).filter(p => {
          if (seen.has(p.name)) return false;
          seen.add(p.name);
          return true;
        });
        return mapped.sort((a, b) => {
          const orderA = getPositionOrder(a.position);
          const orderB = getPositionOrder(b.position);
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name);
        });
      })(),
      standings: standingsInfo
    }
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout fetching ${team.nhlAbbrev} stats`)
      throw new Error('Request timeout - please try again')
    }
    console.error(`Error fetching ${team.nhlAbbrev} stats:`, error)
    throw error
  }
}

export async function fetchAllTeamData(inputTeam: TeamInfo | TeamId, season = DEFAULT_SEASON): Promise<TeamStats> {
  const team = typeof inputTeam === 'string' ? getTeamInfo(inputTeam) : inputTeam
  const useMock = import.meta.env?.VITE_USE_MOCK === 'true'
  if (useMock) {
    console.warn('[TEAM] Using mock data (VITE_USE_MOCK=true). Live NHL API calls skipped.')
    const data = getMockData(team.id)
    return data
  }
  console.log(`Starting NHL API data fetch for ${team.nhlAbbrev}...`)
  
  const [gamesResult, statsResult] = await Promise.allSettled([
    fetchTeamSchedule(team, season),
    fetchTeamStats(team, season)
  ])
  
  let games: Game[] = []
  let stats: Omit<TeamStats, 'games'>
  
  if (gamesResult.status === 'fulfilled') {
    games = gamesResult.value
    console.log(`✓ Schedule loaded successfully for ${team.nhlAbbrev}:`, games.length, 'games')
  } else {
    console.error('✗ Schedule fetch failed:', gamesResult.reason)
    throw new Error('Unable to fetch schedule data from NHL API - check console for details')
  }
  
  if (statsResult.status === 'fulfilled') {
    stats = statsResult.value
    console.log(`✓ Stats loaded successfully for ${team.nhlAbbrev}`)
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
