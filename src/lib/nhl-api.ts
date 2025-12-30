import { getCurrentSeason } from './seasons'
import { getGameDateInPST, formatGameTime } from './date-utils'

const NHL_API_BASE = '/nhl-api/v1'
// Default to current season based on current date
export const DEFAULT_SEASON = getCurrentSeason().id
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
  gameType?: number // 1: Preseason, 2: Regular Season, 3: Playoffs, 4: All-Star
}

export interface GameDetails {
  id: string
  gameDate: string
  venue: string
  homeTeam: {
    name: string
    abbrev: string
    score?: number
    shots?: number
  }
  awayTeam: {
    name: string
    abbrev: string
    score?: number
    shots?: number
  }
  period?: number
  periodType?: string
  gameState: string
  goalScorers?: Array<{
    name: string
    team: string
    period: number
    timeInPeriod: string
  }>
  penalties?: Array<{
    player: string
    team: string
    period: number
    timeInPeriod: string
    penalty: string
    duration: number
  }>
  threeStars?: Array<{
    name: string
    position: string
  }>
  goaltenders?: Array<{
    name: string
    team: string
    teamName?: string
    saves?: number
    shotsAgainst?: number
    goalsAgainst?: number
    savePctg?: number
    timeOnIce?: string
    decision?: string
    isStarter?: boolean
  }>
}

export interface PlayerStat {
  name: string
  value: number
  position?: string
  playerId?: number
  goals?: number
  assists?: number
  points?: number
  powerPlayGoals?: number
  powerPlayPoints?: number
  shorthandedGoals?: number
  shorthandedPoints?: number
  gameWinningGoals?: number
  shootingPctg?: number
  gamesPlayed?: number
  // Goalie-specific stats
  wins?: number
  losses?: number
  otLosses?: number
  savePctg?: number
  goalsAgainstAvg?: number
  shutouts?: number
  shotsAgainst?: number
  saves?: number
  goalsAgainst?: number
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
  playerId?: number
  goals?: number
  assists?: number
  points?: number
  powerPlayGoals?: number
  powerPlayPoints?: number
  shorthandedGoals?: number
  shorthandedPoints?: number
  gameWinningGoals?: number
  shootingPctg?: number
  gamesPlayed?: number
  // Goalie-specific stats
  wins?: number
  losses?: number
  otLosses?: number
  savePctg?: number
  goalsAgainstAvg?: number
  shutouts?: number
  shotsAgainst?: number
  saves?: number
  goalsAgainst?: number
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
          time: formatGameTime(game.startTimeUTC),
          isHome,
          homeScore: homeScore,
          awayScore: awayScore,
          gameState: gameState,
          lastPeriodType: lastPeriodType ? lastPeriodType.trim().toUpperCase() : undefined,
          gameType: gameType
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

const getCurrentStandingsDate = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
}

const extractStandingsForTeam = (data: any, teamInfo: TeamInfo): StandingsInfo | null => {
  // Find the requested team in the standings payload
  const conferences = data?.standings || []
  for (const conference of conferences) {
    if (!conference?.teams) continue

    for (let i = 0; i < conference.teams.length; i++) {
      const team = conference.teams[i]
      const abbrev = team?.teamAbbrev?.default || team?.teamAbbrev
      if (!abbrev || abbrev !== teamInfo.nhlAbbrev) continue

      console.log(`===== ${teamInfo.fullName} OBJECT FROM STANDINGS =====`)
      console.log(JSON.stringify(team, null, 2))
      console.log('===== END TEAM OBJECT =====')

      const position = i + 1
      const isWildcard = position >= 9
      const divisionPosition = team.divisionSequence || team.divisionRank || 0
      const wins = team.wins || team.winsOverall || team.record?.wins || 0
      const losses = team.losses || team.lossesOverall || team.record?.losses || 0
      const otLosses = team.otLosses || team.overtimeLosses || team.record?.ot || 0

      console.log(`${teamInfo.nhlAbbrev} standings parsed -> Conf: ${position}, Div: ${divisionPosition}, Record: ${wins}-${losses}-${otLosses}, Wildcard: ${isWildcard}`)
      return { conferencePosition: position, isWildcard, divisionPosition, wins, losses, otLosses }
    }
  }

  return null
}

async function fetchStandings(teamInfo: TeamInfo): Promise<StandingsInfo> {
  const dateEndpoint = `${NHL_API_BASE}/standings/${getCurrentStandingsDate()}`
  const fallbackEndpoint = `${NHL_API_BASE}/standings/now`
  const candidates = [dateEndpoint, fallbackEndpoint]

  for (const url of candidates) {
    try {
      console.log('Fetching standings data:', url)
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      })

      if (!response.ok) {
        console.warn('Standings fetch failed:', response.status, response.statusText, url)
        continue
      }

      const data = await response.json()
      console.log('Standings data received')
      console.log('===== FULL STANDINGS RESPONSE STRUCTURE =====')
      console.log(JSON.stringify(data, null, 2))
      console.log('===== END STANDINGS RESPONSE =====')

      const parsed = extractStandingsForTeam(data, teamInfo)
      if (parsed) {
        return parsed
      }
    } catch (error) {
      console.warn('Error fetching standings endpoint:', url, error)
    }
  }

  console.log(`${teamInfo.nhlAbbrev} not found in standings, using default`)
  return { conferencePosition: 0, isWildcard: false, divisionPosition: 0, wins: 0, losses: 0, otLosses: 0 }
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
        value: p.points || 0,
        position: p.position || p.positionCode || 'F',
        playerId: p.playerId || p.id || undefined,
        goals: p.goals || 0,
        assists: p.assists || 0,
        points: p.points || 0,
        powerPlayGoals: p.powerPlayGoals || p.ppGoals || 0,
        powerPlayPoints: p.powerPlayPoints || p.ppPoints || 0,
        shorthandedGoals: p.shorthandedGoals || p.shGoals || 0,
        shorthandedPoints: p.shorthandedPoints || p.shPoints || 0,
        gameWinningGoals: p.gameWinningGoals || p.gwGoals || 0,
        shootingPctg: p.shootingPctg || p.shootingPercentage || 0,
        gamesPlayed: p.gamesPlayed || p.games || 0
      }))
    
    const goalLeaders = [...skaters]
      .sort((a, b) => (b.goals || 0) - (a.goals || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.goals || 0,
        position: p.position || p.positionCode || 'F',
        playerId: p.playerId || p.id || undefined,
        goals: p.goals || 0,
        assists: p.assists || 0,
        points: p.points || 0,
        powerPlayGoals: p.powerPlayGoals || p.ppGoals || 0,
        powerPlayPoints: p.powerPlayPoints || p.ppPoints || 0,
        shorthandedGoals: p.shorthandedGoals || p.shGoals || 0,
        shorthandedPoints: p.shorthandedPoints || p.shPoints || 0,
        gameWinningGoals: p.gameWinningGoals || p.gwGoals || 0,
        shootingPctg: p.shootingPctg || p.shootingPercentage || 0,
        gamesPlayed: p.gamesPlayed || p.games || 0
      }))
    
    const assistLeaders = [...skaters]
      .sort((a, b) => (b.assists || 0) - (a.assists || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.assists || 0,
        position: p.position || p.positionCode || 'F',
        playerId: p.playerId || p.id || undefined,
        goals: p.goals || 0,
        assists: p.assists || 0,
        points: p.points || 0,
        powerPlayGoals: p.powerPlayGoals || p.ppGoals || 0,
        powerPlayPoints: p.powerPlayPoints || p.ppPoints || 0,
        shorthandedGoals: p.shorthandedGoals || p.shGoals || 0,
        shorthandedPoints: p.shorthandedPoints || p.shPoints || 0,
        gameWinningGoals: p.gameWinningGoals || p.gwGoals || 0,
        shootingPctg: p.shootingPctg || p.shootingPercentage || 0,
        gamesPlayed: p.gamesPlayed || p.games || 0
      }))
    
    const plusMinusLeaders = [...skaters]
      .sort((a, b) => (b.plusMinus || b.plus_minus || b.plusMinusValue || 0) - (a.plusMinus || a.plus_minus || a.plusMinusValue || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: p.plusMinus || p.plus_minus || p.plusMinusValue || 0,
        position: p.position || p.positionCode || 'F',
        playerId: p.playerId || p.id || undefined,
        goals: p.goals || 0,
        assists: p.assists || 0,
        points: p.points || 0,
        powerPlayGoals: p.powerPlayGoals || p.ppGoals || 0,
        powerPlayPoints: p.powerPlayPoints || p.ppPoints || 0,
        shorthandedGoals: p.shorthandedGoals || p.shGoals || 0,
        shorthandedPoints: p.shorthandedPoints || p.shPoints || 0,
        gameWinningGoals: p.gameWinningGoals || p.gwGoals || 0,
        shootingPctg: p.shootingPctg || p.shootingPercentage || 0,
        gamesPlayed: p.gamesPlayed || p.games || 0
      }))
    
    console.log('Plus/minus leaders parsed:', plusMinusLeaders.length, 'players')
    
    const avgShiftsLeaders = [...skaters]
      .sort((a, b) => (b.avgShiftsPerGame || b.avgShiftDuration || b.shiftDurationAvg || 0) - (a.avgShiftsPerGame || a.avgShiftDuration || a.shiftDurationAvg || 0))
      .slice(0, 5)
      .map(p => ({
        name: `${p.firstName?.default || ''} ${p.lastName?.default || ''}`.trim(),
        value: parseFloat((p.avgShiftsPerGame || p.avgShiftDuration || p.shiftDurationAvg || 0).toFixed(1)),
        position: p.position || p.positionCode || 'F',
        playerId: p.playerId || p.id || undefined,
        goals: p.goals || 0,
        assists: p.assists || 0,
        points: p.points || 0,
        powerPlayGoals: p.powerPlayGoals || p.ppGoals || 0,
        powerPlayPoints: p.powerPlayPoints || p.ppPoints || 0,
        shorthandedGoals: p.shorthandedGoals || p.shGoals || 0,
        shorthandedPoints: p.shorthandedPoints || p.shPoints || 0,
        gameWinningGoals: p.gameWinningGoals || p.gwGoals || 0,
        shootingPctg: p.shootingPctg || p.shootingPercentage || 0,
        gamesPlayed: p.gamesPlayed || p.games || 0
      }))
      
    console.log('Average shifts leaders parsed:', avgShiftsLeaders.length, 'players')
    
    const goalieStats = [...goalies]
      .filter(g => (g.gamesPlayed || 0) > 0)
      .sort((a, b) => (b.savePctg || b.savePercentage || 0) - (a.savePctg || a.savePercentage || 0))
      .slice(0, 3)
      .map(g => ({
        name: `${g.firstName?.default || ''} ${g.lastName?.default || ''}`.trim(),
        value: parseFloat((g.savePctg || g.savePercentage || 0).toFixed(3)),
        position: 'G',
        playerId: g.playerId || g.id || undefined,
        gamesPlayed: g.gamesPlayed || g.games || 0,
        wins: g.wins || 0,
        losses: g.losses || 0,
        otLosses: g.otLosses || g.overtimeLosses || 0,
        savePctg: g.savePctg || g.savePercentage || 0,
        goalsAgainstAvg: g.goalsAgainstAverage || g.goalsAgainstAvg || g.gaa || 0,
        shutouts: g.shutouts || 0,
        shotsAgainst: g.shotsAgainst || g.sa || 0,
        saves: g.saves || 0,
        goalsAgainst: g.goalsAgainst || g.ga || 0
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
            
            // Try to find matching stats from skaters array or goalies array
            const skaterStats = skaters.find(s => 
              `${s.firstName?.default || ''} ${s.lastName?.default || ''}`.trim() === name
            );
            const goalieStats = goalies.find(g => 
              `${g.firstName?.default || ''} ${g.lastName?.default || ''}`.trim() === name
            );
            
            if (idx < 3) {
              console.log('Roster player data (raw->normalized):', {
                name,
                positionRaw,
                position,
                number,
                captaincy,
                hasSkaterStats: !!skaterStats,
                hasGoalieStats: !!goalieStats,
                availableFields: Object.keys(player)
              });
            }
            
            // For goalies, use goalie stats; for skaters, use skater stats
            if (position === 'G' && goalieStats) {
              return {
                name,
                position,
                number,
                captaincy,
                playerId: player.playerId || player.id || undefined,
                gamesPlayed: goalieStats.gamesPlayed || goalieStats.games || 0,
                wins: goalieStats.wins || 0,
                losses: goalieStats.losses || 0,
                otLosses: goalieStats.otLosses || goalieStats.overtimeLosses || 0,
                savePctg: goalieStats.savePctg || goalieStats.savePercentage || 0,
                goalsAgainstAvg: goalieStats.goalsAgainstAverage || goalieStats.goalsAgainstAvg || goalieStats.gaa || 0,
                shutouts: goalieStats.shutouts || 0,
                shotsAgainst: goalieStats.shotsAgainst || goalieStats.sa || 0,
                saves: goalieStats.saves || 0,
                goalsAgainst: goalieStats.goalsAgainst || goalieStats.ga || 0
              };
            }
            
            return { 
              name, 
              position, 
              number, 
              captaincy,
              playerId: player.playerId || player.id || undefined,
              goals: skaterStats?.goals || 0,
              assists: skaterStats?.assists || 0,
              points: skaterStats?.points || 0,
              powerPlayGoals: skaterStats?.powerPlayGoals || skaterStats?.ppGoals || 0,
              powerPlayPoints: skaterStats?.powerPlayPoints || skaterStats?.ppPoints || 0,
              shorthandedGoals: skaterStats?.shorthandedGoals || skaterStats?.shGoals || 0,
              shorthandedPoints: skaterStats?.shorthandedPoints || skaterStats?.shPoints || 0,
              gameWinningGoals: skaterStats?.gameWinningGoals || skaterStats?.gwGoals || 0,
              shootingPctg: skaterStats?.shootingPctg || skaterStats?.shootingPercentage || 0,
              gamesPlayed: skaterStats?.gamesPlayed || skaterStats?.games || 0
            };
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
        const skatersForRoster = skaters.map((player: any, idx: number) => {
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
          return { 
            name, 
            position, 
            number,
            playerId: player.playerId || player.id || undefined,
            goals: player.goals || 0,
            assists: player.assists || 0,
            points: player.points || 0,
            powerPlayGoals: player.powerPlayGoals || player.ppGoals || 0,
            powerPlayPoints: player.powerPlayPoints || player.ppPoints || 0,
            shorthandedGoals: player.shorthandedGoals || player.shGoals || 0,
            shorthandedPoints: player.shorthandedPoints || player.shPoints || 0,
            gameWinningGoals: player.gameWinningGoals || player.gwGoals || 0,
            shootingPctg: player.shootingPctg || player.shootingPercentage || 0,
            gamesPlayed: player.gamesPlayed || player.games || 0
          };
        });
        
        const goaliesForRoster = goalies.map((player: any) => {
          const name = `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim();
          const number = player.sweaterNumber || player.number || player.jerseyNumber || player.uniformNumber || 0;
          return {
            name,
            position: 'G',
            number,
            playerId: player.playerId || player.id || undefined,
            gamesPlayed: player.gamesPlayed || player.games || 0,
            wins: player.wins || 0,
            losses: player.losses || 0,
            otLosses: player.otLosses || player.overtimeLosses || 0,
            savePctg: player.savePctg || player.savePercentage || 0,
            goalsAgainstAvg: player.goalsAgainstAverage || player.goalsAgainstAvg || player.gaa || 0,
            shutouts: player.shutouts || 0,
            shotsAgainst: player.shotsAgainst || player.sa || 0,
            saves: player.saves || 0,
            goalsAgainst: player.goalsAgainst || player.ga || 0
          };
        });
        
        const mapped = [...skatersForRoster, ...goaliesForRoster].filter(p => {
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

export async function fetchGameDetails(gameId: string): Promise<GameDetails | null> {
  // Return mock data if we're in mock mode
  const useMock = import.meta.env?.VITE_USE_MOCK === 'true'
  if (useMock || gameId.startsWith('mock-')) {
    console.log('Returning mock game details for:', gameId)
    
    // Mock completed game with full details
    if (gameId === 'mock-completed') {
      return {
        id: gameId,
        gameDate: '2025-12-15',
        venue: 'T-Mobile Arena',
        homeTeam: {
          name: 'Vegas Golden Knights',
          abbrev: 'VGK',
          score: 4,
          shots: 32
        },
        awayTeam: {
          name: 'Colorado Avalanche',
          abbrev: 'COL',
          score: 3,
          shots: 28
        },
        gameState: 'OFF',
        period: 3,
        periodType: 'REG',
        threeStars: [
          { name: 'Jack Eichel', position: 'C' },
          { name: 'Nathan MacKinnon', position: 'C' },
          { name: 'Adin Hill', position: 'G' }
        ],
        goalScorers: [
          { name: 'Jack Eichel', team: 'VGK', period: 1, timeInPeriod: '5:23' },
          { name: 'Nathan MacKinnon', team: 'COL', period: 1, timeInPeriod: '12:45' },
          { name: 'Mark Stone', team: 'VGK', period: 2, timeInPeriod: '3:15' },
          { name: 'Mikko Rantanen', team: 'COL', period: 2, timeInPeriod: '10:22' },
          { name: 'Ivan Barbashev', team: 'VGK', period: 3, timeInPeriod: '8:17' },
          { name: 'Cale Makar', team: 'COL', period: 3, timeInPeriod: '14:56' },
          { name: 'Tomas Hertl', team: 'VGK', period: 3, timeInPeriod: '18:32' }
        ],
        penalties: [
          { player: 'Shea Theodore', team: 'VGK', period: 1, timeInPeriod: '8:45', penalty: 'Tripping', duration: 2 },
          { player: 'Devon Toews', team: 'COL', period: 2, timeInPeriod: '5:12', penalty: 'High-sticking', duration: 2 },
          { player: 'William Karlsson', team: 'VGK', period: 3, timeInPeriod: '11:23', penalty: 'Holding', duration: 2 }
        ],
        goaltenders: [
          {
            name: 'Adin Hill',
            team: 'VGK',
            teamName: 'Vegas Golden Knights',
            saves: 31,
            shotsAgainst: 34,
            goalsAgainst: 3,
            savePctg: 0.912,
            timeOnIce: '60:00',
            decision: 'W',
            isStarter: true
          },
          {
            name: 'Alexandar Georgiev',
            team: 'COL',
            teamName: 'Colorado Avalanche',
            saves: 28,
            shotsAgainst: 32,
            goalsAgainst: 4,
            savePctg: 0.875,
            timeOnIce: '60:00',
            decision: 'L',
            isStarter: true
          }
        ]
      }
    }
    
    // Return mock data for future games
    return {
      id: gameId,
      gameDate: new Date().toISOString(),
      venue: 'T-Mobile Arena',
      homeTeam: {
        name: 'Vegas Golden Knights',
        abbrev: 'VGK',
        score: undefined,
        shots: undefined
      },
      awayTeam: {
        name: 'Colorado Avalanche',
        abbrev: 'COL',
        score: undefined,
        shots: undefined
      },
      gameState: 'FUT',
      period: undefined,
      periodType: undefined
    }
  }
  
  try {
    const url = `${NHL_API_BASE}/gamecenter/${gameId}/boxscore`
    console.log('Fetching game details from:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('Game details fetch failed:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    console.log('Game details received:', data)

    const isSummaryEmpty = (summary: any): boolean => {
      if (!summary) return true
      const keys = Object.keys(summary)
      if (keys.length === 0) return true
      const hasContent = Boolean(
        (Array.isArray(summary.scoring) && summary.scoring.length > 0) ||
        (Array.isArray(summary.penalties) && summary.penalties.length > 0) ||
        (Array.isArray(summary.threeStars) && summary.threeStars.length > 0)
      )
      return !hasContent
    }

    let summaryData = data.summary

    if (isSummaryEmpty(summaryData) && data.gameState !== 'FUT') {
      try {
        const landingUrl = `${NHL_API_BASE}/gamecenter/${gameId}/landing`
        console.log('Summary empty, attempting fallback fetch from:', landingUrl)
        const landingResponse = await fetch(landingUrl, {
          headers: {
            'Accept': 'application/json'
          }
        })
        if (landingResponse.ok) {
          const landingJson = await landingResponse.json()
          if (!isSummaryEmpty(landingJson?.summary)) {
            summaryData = landingJson.summary
          }
        } else {
          console.warn('Fallback landing fetch failed:', landingResponse.status, landingResponse.statusText)
        }
      } catch (landingError) {
        console.warn('Error during landing fallback fetch:', landingError)
      }
    }
    
    // Helper function to construct player name
    const getPlayerName = (player: any): string => {
      return `${player.firstName?.default || ''} ${player.lastName?.default || ''}`.trim() || player.name?.default || 'Unknown'
    }
    
    // Helper function to construct team name
    const getTeamName = (team: any): string => {
      return `${team.placeName?.default || ''} ${team.name?.default || ''}`.trim() || team.abbrev || ''
    }

    const parseSlashValue = (value: any, index: 0 | 1): number | undefined => {
      if (typeof value === 'string' && value.includes('/')) {
        const parts = value.split('/').map(part => Number(part))
        const parsed = parts[index]
        return Number.isFinite(parsed) ? parsed : undefined
      }
      return undefined
    }

    const parseNumber = (value: any): number | undefined => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value
      }
      if (typeof value === 'string') {
        const cleaned = value.trim()
        if (!cleaned) return undefined
        const numeric = Number(cleaned)
        return Number.isFinite(numeric) ? numeric : undefined
      }
      return undefined
    }
    
    // Parse the response to extract relevant game information
    const homeTeam = data.homeTeam || {}
    const awayTeam = data.awayTeam || {}
    const gameInfo = data.gameInfo || data
    
    // Extract goal scorers from scoring plays (limit to 20 goals to avoid performance issues)
    const goalScorers: GameDetails['goalScorers'] = []
    if (summaryData?.scoring) {
      for (const period of summaryData.scoring) {
        const periodNum = period.periodDescriptor?.number || 0
        for (const goal of (period.goals || []).slice(0, 20)) {
          goalScorers.push({
            name: getPlayerName(goal),
            team: goal.teamAbbrev?.default || goal.teamAbbrev || '',
            period: periodNum,
            timeInPeriod: goal.timeInPeriod || ''
          })
        }
      }
    }
    
    // Extract penalties (limit to 30 penalties to avoid performance issues)
    const penalties: GameDetails['penalties'] = []
    if (summaryData?.penalties) {
      for (const period of summaryData.penalties) {
        const periodNum = period.periodDescriptor?.number || 0
        for (const penalty of (period.penalties || []).slice(0, 30)) {
          penalties.push({
            player: getPlayerName(penalty),
            team: penalty.teamAbbrev?.default || penalty.teamAbbrev || '',
            period: periodNum,
            timeInPeriod: penalty.timeInPeriod || '',
            penalty: penalty.type?.default || penalty.descKey || '',
            duration: penalty.duration || 0
          })
        }
      }
    }
    
    // Extract three stars (limit to 3 as expected)
    const threeStars: GameDetails['threeStars'] = []
    if (summaryData?.threeStars) {
      for (const star of summaryData.threeStars.slice(0, 3)) {
        threeStars.push({
          name: getPlayerName(star),
          position: star.position || ''
        })
      }
    }

    const goaltenders: GameDetails['goaltenders'] = []
    const pushGoalies = (teamKey: 'homeTeam' | 'awayTeam', teamData: any, teamName: string) => {
      const goalies = data.playerByGameStats?.[teamKey]?.goalies
      if (!Array.isArray(goalies)) return

      for (const goalie of goalies) {
        const shotsAgainst = parseNumber(goalie.shotsAgainst) ?? parseSlashValue(goalie.saveShotsAgainst, 1)
        const saves = parseNumber(goalie.saves) ?? parseSlashValue(goalie.saveShotsAgainst, 0)
        const goalsAgainst = parseNumber(goalie.goalsAgainst) ?? (shotsAgainst !== undefined && saves !== undefined ? shotsAgainst - saves : undefined)
        const timeOnIce = typeof goalie.toi === 'string' ? goalie.toi : (typeof goalie.timeOnIce === 'string' ? goalie.timeOnIce : undefined)

        const playedMeaningfulMinutes = (() => {
          if (timeOnIce) {
            const segments = timeOnIce.split(':').map(segment => Number(segment))
            if (segments.length === 3) {
              const [hours, minutes, seconds] = segments
              if ((hours || minutes || seconds) && Number.isFinite(hours) && Number.isFinite(minutes) && Number.isFinite(seconds)) {
                return (hours * 3600 + minutes * 60 + seconds) > 0
              }
            } else if (segments.length === 2) {
              const [minutes, seconds] = segments
              if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
                return (minutes * 60 + seconds) > 0
              }
            }
          }
          return (shotsAgainst ?? 0) > 0 || (goalsAgainst ?? 0) > 0
        })()

        if (!playedMeaningfulMinutes) {
          continue
        }

        goaltenders.push({
          name: getPlayerName(goalie),
          team: teamData.abbrev || '',
          teamName,
          shotsAgainst,
          saves,
          goalsAgainst,
          savePctg: parseNumber(goalie.savePctg),
          timeOnIce,
          decision: typeof goalie.decision === 'string' ? goalie.decision : undefined,
          isStarter: typeof goalie.starter === 'boolean' ? goalie.starter : undefined
        })
      }
    }

    pushGoalies('homeTeam', homeTeam, getTeamName(homeTeam))
    pushGoalies('awayTeam', awayTeam, getTeamName(awayTeam))
    
    return {
      id: gameId,
      gameDate: gameInfo.gameDate || gameInfo.startTimeUTC || '',
      venue: gameInfo.venue?.default || data.venue?.default || 'Unknown Venue',
      homeTeam: {
        name: getTeamName(homeTeam),
        abbrev: homeTeam.abbrev || '',
        score: homeTeam.score,
        shots: homeTeam.sog
      },
      awayTeam: {
        name: getTeamName(awayTeam),
        abbrev: awayTeam.abbrev || '',
        score: awayTeam.score,
        shots: awayTeam.sog
      },
      period: data.period,
      periodType: data.gameOutcome?.lastPeriodType || data.periodDescriptor?.periodType || gameInfo.periodDescriptor?.periodType,
      gameState: data.gameState || gameInfo.gameState || 'FUT',
      goalScorers: goalScorers.length > 0 ? goalScorers : undefined,
      penalties: penalties.length > 0 ? penalties : undefined,
      threeStars: threeStars.length > 0 ? threeStars : undefined,
      goaltenders: goaltenders.length > 0 ? goaltenders : undefined
    }
  } catch (error) {
    console.error('Error fetching game details:', error)
    return null
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

export interface CareerStats {
  goals: number
  assists: number
  points: number
  powerPlayGoals: number
  powerPlayPoints: number
  shorthandedGoals: number
  shorthandedPoints: number
  gameWinningGoals: number
  gamesPlayed: number
  // Goalie-specific career stats
  wins?: number
  losses?: number
  otLosses?: number
  shutouts?: number
  saves?: number
  shotsAgainst?: number
  goalsAgainst?: number
}

export async function fetchPlayerCareerStats(playerId: number): Promise<CareerStats | null> {
  // Return mock career stats in mock mode
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  if (useMock) {
    console.log(`[MOCK] Returning mock career stats for player ${playerId}`)
    // Mock career stats for Jack Eichel (8478403)
    if (playerId === 8478403) {
      return {
        goals: 283,
        assists: 438,
        points: 721,
        powerPlayGoals: 97,
        powerPlayPoints: 284,
        shorthandedGoals: 8,
        shorthandedPoints: 18,
        gameWinningGoals: 48,
        gamesPlayed: 688
      }
    }
    // Mock career stats for Adin Hill (goalie)
    if (playerId === 8477850) {
      return {
        goals: 0,
        assists: 0,
        points: 0,
        powerPlayGoals: 0,
        powerPlayPoints: 0,
        shorthandedGoals: 0,
        shorthandedPoints: 0,
        gameWinningGoals: 0,
        gamesPlayed: 178,
        wins: 87,
        losses: 65,
        otLosses: 16,
        shutouts: 12,
        saves: 4865,
        shotsAgainst: 5342,
        goalsAgainst: 477
      }
    }
    // Return generic mock data for other players
    return {
      goals: 150,
      assists: 200,
      points: 350,
      powerPlayGoals: 45,
      powerPlayPoints: 120,
      shorthandedGoals: 5,
      shorthandedPoints: 10,
      gameWinningGoals: 25,
      gamesPlayed: 500
    }
  }
  
  try {
    const url = `${NHL_API_BASE}/player/${playerId}/landing`
    console.log(`Fetching career stats for player ${playerId} from:`, url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('Player career stats fetch failed:', response.status, response.statusText)
      return null
    }
    
    const data = await response.json()
    console.log('Player career data received:', data)
    
    // Extract career totals from the response
    const careerTotals = data.careerTotals?.regularSeason
    
    if (!careerTotals) {
      console.warn('No career totals found in player data')
      return null
    }
    
    // Check if it's a goalie
    const isGoalie = data.position === 'G'
    
    if (isGoalie) {
      return {
        goals: 0,
        assists: 0,
        points: 0,
        powerPlayGoals: 0,
        powerPlayPoints: 0,
        shorthandedGoals: 0,
        shorthandedPoints: 0,
        gameWinningGoals: 0,
        gamesPlayed: careerTotals.gamesPlayed || 0,
        wins: careerTotals.wins || 0,
        losses: careerTotals.losses || 0,
        otLosses: careerTotals.otLosses || 0,
        shutouts: careerTotals.shutouts || 0,
        saves: careerTotals.saves || 0,
        shotsAgainst: careerTotals.shotsAgainst || 0,
        goalsAgainst: careerTotals.goalsAgainst || 0
      }
    }
    
    return {
      goals: careerTotals.goals || 0,
      assists: careerTotals.assists || 0,
      points: careerTotals.points || 0,
      powerPlayGoals: careerTotals.powerPlayGoals || 0,
      powerPlayPoints: careerTotals.powerPlayPoints || 0,
      shorthandedGoals: careerTotals.shorthandedGoals || 0,
      shorthandedPoints: careerTotals.shorthandedPoints || 0,
      gameWinningGoals: careerTotals.gameWinningGoals || 0,
      gamesPlayed: careerTotals.gamesPlayed || 0
    }
  } catch (error) {
    console.error(`Error fetching career stats for player ${playerId}:`, error)
    return null
  }
}
