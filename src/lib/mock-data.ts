// Centralized mock data for development/reference only.
// Import interfaces from nhl-api to preserve types.
import { type CareerStats, type Game, type GameDetails, type PlayerStat, type InjuredPlayer, type RosterPlayer, type StandingsInfo, type TeamStats } from './nhl-api'
import { DEFAULT_TEAM_ID, getTeamInfo, type TeamId } from './teams'

export const MOCK_ENV_FLAG = 'VITE_USE_MOCK'

export function shouldUseMockData(): boolean {
  const env = import.meta.env as Record<string, string | undefined>
  return env?.[MOCK_ENV_FLAG] === 'true'
}

export function getMockGameDetails(gameId: string): GameDetails {
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

export function getMockCareerStats(playerId: number): CareerStats {
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

/**
 * getMockData returns a fully-populated TeamStats object with placeholder values.
 * This is separated from nhl-api.ts to keep production API code clean.
 * NOTE: Avoid using this in production paths; prefer real API data.
 */
export function getMockData(teamId: TeamId = DEFAULT_TEAM_ID): TeamStats {
  const team = getTeamInfo(teamId)
  const today = new Date()
  
  // Create regular season games (82 games total, mix of completed and upcoming)
  const mockRegularSeasonGames: Game[] = Array.from({ length: 82 }, (_, i) => {
    const gameDate = new Date(today)
    gameDate.setDate(today.getDate() - 60 + i) // Start 60 days ago
    const isHome = i % 2 === 0
    const isCompleted = i < 50 // First 50 games are completed
    const opponents = [
      'Colorado Avalanche', 'Los Angeles Kings', 'Edmonton Oilers', 'San Jose Sharks', 'Anaheim Ducks', 
      'Vancouver Canucks', 'Winnipeg Jets', 'Minnesota Wild', 'St. Louis Blues', 'Dallas Stars', 
      'Nashville Predators', 'Chicago Blackhawks', 'Detroit Red Wings', 'Columbus Blue Jackets',
      'Pittsburgh Penguins', 'Washington Capitals', 'New York Rangers', 'New York Islanders', 
      'New Jersey Devils', 'Philadelphia Flyers', 'Boston Bruins', 'Buffalo Sabres', 
      'Toronto Maple Leafs', 'Ottawa Senators', 'Montreal Canadiens', 'Tampa Bay Lightning',
      'Florida Panthers', 'Carolina Hurricanes', 'Seattle Kraken', 'Calgary Flames'
    ]
    
    const teamWon = isCompleted ? (i % 3 !== 2) : undefined // Team wins about 2/3 of games
    const homeScore = isCompleted ? (isHome ? (teamWon ? 4 : 2) : (teamWon ? 3 : 2)) : undefined
    const awayScore = isCompleted ? (isHome ? (teamWon ? 2 : 4) : (teamWon ? 2 : 3)) : undefined
    const lastPeriodType = isCompleted ? (i % 10 === 0 ? 'OT' : i % 15 === 0 ? 'SO' : 'REG') : undefined

    return {
      id: `mock-reg-${i}`,
      opponent: opponents[i % opponents.length],
      date: gameDate.toISOString().split('T')[0],
      time: i % 3 === 0 ? '7:00 PM' : i % 3 === 1 ? '7:30 PM' : '6:00 PM',
      isHome,
      homeScore,
      awayScore,
      gameState: isCompleted ? 'FINAL' : 'FUT',
      lastPeriodType,
      gameType: 2 // Regular season
    }
  })
  
  // Create playoff games (16 wins = Stanley Cup champion)
  const mockPlayoffGames: Game[] = Array.from({ length: 22 }, (_, i) => {
    const gameDate = new Date(today)
    gameDate.setDate(today.getDate() - 10 + i) // Playoffs in last 10 days
    const isHome = i % 2 === 0
    const opponents = [
      'Los Angeles Kings', 'Los Angeles Kings', 'Los Angeles Kings', 'Los Angeles Kings', 'Los Angeles Kings', 'Los Angeles Kings', // Round 1 (won 4-2)
      'Edmonton Oilers', 'Edmonton Oilers', 'Edmonton Oilers', 'Edmonton Oilers', 'Edmonton Oilers', 'Edmonton Oilers', // Round 2 (won 4-2)
      'Dallas Stars', 'Dallas Stars', 'Dallas Stars', 'Dallas Stars', 'Dallas Stars', 'Dallas Stars', // Round 3 (won 4-2)
      'Florida Panthers', 'Florida Panthers', 'Florida Panthers', 'Florida Panthers' // Stanley Cup Final (won 4-0)
    ]
    
    // Explicit win/loss pattern for each game: 16 wins total across 4 rounds
    const teamWins = [
      true, false, true, true, false, true, // Round 1: Won 4-2 (6 games)
      true, true, false, true, false, true, // Round 2: Won 4-2 (6 games)
      false, true, true, false, true, true, // Round 3: Won 4-2 (6 games)
      true, true, true, true // Cup Final: Won 4-0 (4 games)
    ]
    
    const actualTeamWon = i < teamWins.length ? teamWins[i] : false
    
    const homeScore = isHome ? (actualTeamWon ? 4 : 2) : (actualTeamWon ? 3 : 2)
    const awayScore = isHome ? (actualTeamWon ? 2 : 4) : (actualTeamWon ? 2 : 3)
    const lastPeriodType = i % 5 === 0 ? 'OT' : 'REG'

    return {
      id: `mock-playoff-${i}`,
      opponent: opponents[i],
      date: gameDate.toISOString().split('T')[0],
      time: '5:00 PM',
      isHome,
      homeScore,
      awayScore,
      gameState: 'FINAL',
      lastPeriodType,
      gameType: 3 // Playoffs
    }
  })
  
  const mockGames = [...mockRegularSeasonGames, ...mockPlayoffGames]

  const basePlayers = team.id === DEFAULT_TEAM_ID
    ? {
        pointLeaders: [
          { name: 'Jack Eichel', value: 45, position: 'C', playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Mark Stone', value: 38, position: 'RW', playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'Ivan Barbashev', value: 32, position: 'LW', playerId: 8477367, goals: 18, assists: 14, points: 32, powerPlayGoals: 6, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 2, shootingPctg: 0.145, gamesPlayed: 35 },
          { name: 'Tomas Hertl', value: 28, position: 'C', playerId: 8476881, goals: 14, assists: 14, points: 28, powerPlayGoals: 4, powerPlayPoints: 10, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 2, shootingPctg: 0.112, gamesPlayed: 32 },
          { name: 'William Karlsson', value: 24, position: 'C', playerId: 8476525, goals: 12, assists: 12, points: 24, powerPlayGoals: 2, powerPlayPoints: 6, shorthandedGoals: 2, shorthandedPoints: 4, gameWinningGoals: 1, shootingPctg: 0.098, gamesPlayed: 35 }
        ],
        goalLeaders: [
          { name: 'Jack Eichel', value: 22, position: 'C', playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Ivan Barbashev', value: 18, position: 'LW', playerId: 8477367, goals: 18, assists: 14, points: 32, powerPlayGoals: 6, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 2, shootingPctg: 0.145, gamesPlayed: 35 },
          { name: 'Mark Stone', value: 16, position: 'RW', playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'Tomas Hertl', value: 14, position: 'C', playerId: 8476881, goals: 14, assists: 14, points: 28, powerPlayGoals: 4, powerPlayPoints: 10, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 2, shootingPctg: 0.112, gamesPlayed: 32 },
          { name: 'Jonathan Marchessault', value: 12, position: 'RW', playerId: 8474027, goals: 12, assists: 10, points: 22, powerPlayGoals: 3, powerPlayPoints: 8, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 1, shootingPctg: 0.105, gamesPlayed: 30 }
        ],
        assistLeaders: [
          { name: 'Jack Eichel', value: 23, position: 'C', playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Mark Stone', value: 22, position: 'RW', playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'Shea Theodore', value: 20, position: 'D', playerId: 8478475, goals: 8, assists: 20, points: 28, powerPlayGoals: 2, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 1, shootingPctg: 0.065, gamesPlayed: 35 },
          { name: 'Tomas Hertl', value: 14, position: 'C', playerId: 8476881, goals: 14, assists: 14, points: 28, powerPlayGoals: 4, powerPlayPoints: 10, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 2, shootingPctg: 0.112, gamesPlayed: 32 },
          { name: 'William Karlsson', value: 12, position: 'C', playerId: 8476525, goals: 12, assists: 12, points: 24, powerPlayGoals: 2, powerPlayPoints: 6, shorthandedGoals: 2, shorthandedPoints: 4, gameWinningGoals: 1, shootingPctg: 0.098, gamesPlayed: 35 }
        ],
        plusMinusLeaders: [
          { name: 'Jack Eichel', value: 15, position: 'C', playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Shea Theodore', value: 12, position: 'D', playerId: 8478475, goals: 8, assists: 20, points: 28, powerPlayGoals: 2, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 1, shootingPctg: 0.065, gamesPlayed: 35 },
          { name: 'Alex Pietrangelo', value: 8, position: 'D', playerId: 8474565, goals: 5, assists: 15, points: 20, powerPlayGoals: 1, powerPlayPoints: 8, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 0, shootingPctg: 0.042, gamesPlayed: 35 },
          { name: 'Mark Stone', value: 6, position: 'RW', playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'Ivan Barbashev', value: 4, position: 'LW', playerId: 8477367, goals: 18, assists: 14, points: 32, powerPlayGoals: 6, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 2, shootingPctg: 0.145, gamesPlayed: 35 }
        ],
        avgShiftsLeaders: [
          { name: 'Jack Eichel', value: 22.5, position: 'C', playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Shea Theodore', value: 25.8, position: 'D', playerId: 8478475, goals: 8, assists: 20, points: 28, powerPlayGoals: 2, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 1, shootingPctg: 0.065, gamesPlayed: 35 },
          { name: 'Alex Pietrangelo', value: 24.2, position: 'D', playerId: 8474565, goals: 5, assists: 15, points: 20, powerPlayGoals: 1, powerPlayPoints: 8, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 0, shootingPctg: 0.042, gamesPlayed: 35 },
          { name: 'Mark Stone', value: 21.1, position: 'RW', playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'William Karlsson', value: 20.3, position: 'C', playerId: 8476525, goals: 12, assists: 12, points: 24, powerPlayGoals: 2, powerPlayPoints: 6, shorthandedGoals: 2, shorthandedPoints: 4, gameWinningGoals: 1, shootingPctg: 0.098, gamesPlayed: 35 }
        ],
        goalieStats: [
          { name: 'Adin Hill', value: 0.912, position: 'G', playerId: 8477850, gamesPlayed: 20, wins: 12, losses: 6, otLosses: 2, savePctg: 0.912, goalsAgainstAvg: 2.58, shutouts: 2, shotsAgainst: 620, saves: 565, goalsAgainst: 55 },
          { name: 'Logan Thompson', value: 0.908, position: 'G', playerId: 8480886, gamesPlayed: 15, wins: 8, losses: 5, otLosses: 2, savePctg: 0.908, goalsAgainstAvg: 2.73, shutouts: 1, shotsAgainst: 450, saves: 409, goalsAgainst: 41 },
          { name: 'Laurent Brossoit', value: 0.895, position: 'G', playerId: 8476891, gamesPlayed: 8, wins: 4, losses: 3, otLosses: 1, savePctg: 0.895, goalsAgainstAvg: 3.12, shutouts: 0, shotsAgainst: 240, saves: 215, goalsAgainst: 25 }
        ],
        injuries: [
          { name: 'Mark Stone', daysOut: 14 },
          { name: 'Zach Whitecloud', daysOut: 7 }
        ],
        roster: [
          { name: 'Jack Eichel', position: 'C', number: 9, playerId: 8478403, goals: 22, assists: 23, points: 45, powerPlayGoals: 8, powerPlayPoints: 18, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 4, shootingPctg: 0.157, gamesPlayed: 35 },
          { name: 'Mark Stone', position: 'RW', number: 61, playerId: 8475913, goals: 16, assists: 22, points: 38, powerPlayGoals: 5, powerPlayPoints: 14, shorthandedGoals: 0, shorthandedPoints: 1, gameWinningGoals: 3, shootingPctg: 0.128, gamesPlayed: 33 },
          { name: 'Ivan Barbashev', position: 'LW', number: 49, playerId: 8477367, goals: 18, assists: 14, points: 32, powerPlayGoals: 6, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 2, shootingPctg: 0.145, gamesPlayed: 35 },
          { name: 'Tomas Hertl', position: 'C', number: 48, playerId: 8476881, goals: 14, assists: 14, points: 28, powerPlayGoals: 4, powerPlayPoints: 10, shorthandedGoals: 1, shorthandedPoints: 2, gameWinningGoals: 2, shootingPctg: 0.112, gamesPlayed: 32 },
          { name: 'William Karlsson', position: 'C', number: 71, playerId: 8476525, goals: 12, assists: 12, points: 24, powerPlayGoals: 2, powerPlayPoints: 6, shorthandedGoals: 2, shorthandedPoints: 4, gameWinningGoals: 1, shootingPctg: 0.098, gamesPlayed: 35 },
          { name: 'Shea Theodore', position: 'D', number: 27, playerId: 8478475, goals: 8, assists: 20, points: 28, powerPlayGoals: 2, powerPlayPoints: 12, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 1, shootingPctg: 0.065, gamesPlayed: 35 },
          { name: 'Alex Pietrangelo', position: 'D', number: 7, playerId: 8474565, goals: 5, assists: 15, points: 20, powerPlayGoals: 1, powerPlayPoints: 8, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 0, shootingPctg: 0.042, gamesPlayed: 35 },
          { name: 'Brayden McNabb', position: 'D', number: 3, playerId: 8475683, goals: 2, assists: 8, points: 10, powerPlayGoals: 0, powerPlayPoints: 2, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 0, shootingPctg: 0.025, gamesPlayed: 35 },
          { name: 'Nicolas Hague', position: 'D', number: 14, playerId: 8479325, goals: 4, assists: 10, points: 14, powerPlayGoals: 1, powerPlayPoints: 5, shorthandedGoals: 0, shorthandedPoints: 0, gameWinningGoals: 0, shootingPctg: 0.038, gamesPlayed: 32 },
          { name: 'Adin Hill', position: 'G', number: 33, playerId: 8477850, gamesPlayed: 20, wins: 12, losses: 6, otLosses: 2, savePctg: 0.912, goalsAgainstAvg: 2.58, shutouts: 2, shotsAgainst: 620, saves: 565, goalsAgainst: 55 },
          { name: 'Laurent Brossoit', position: 'G', number: 39, playerId: 8476891, gamesPlayed: 8, wins: 4, losses: 3, otLosses: 1, savePctg: 0.895, goalsAgainstAvg: 3.12, shutouts: 0, shotsAgainst: 240, saves: 215, goalsAgainst: 25 }
        ]
      }
    : {
        pointLeaders: Array.from({ length: 5 }, (_, idx) => ({
          name: `${team.name} Skater ${idx + 1}`,
          value: 40 - idx * 5
        })),
        goalLeaders: Array.from({ length: 5 }, (_, idx) => ({
          name: `${team.name} Goal ${idx + 1}`,
          value: 20 - idx * 3
        })),
        assistLeaders: Array.from({ length: 5 }, (_, idx) => ({
          name: `${team.name} Assist ${idx + 1}`,
          value: 15 - idx * 2
        })),
        plusMinusLeaders: Array.from({ length: 5 }, (_, idx) => ({
          name: `${team.name} PlusMinus ${idx + 1}`,
          value: 10 - idx * 2
        })),
        avgShiftsLeaders: Array.from({ length: 5 }, (_, idx) => ({
          name: `${team.name} Shifts ${idx + 1}`,
          value: 20.5 - idx * 1.2
        })),
        goalieStats: Array.from({ length: 3 }, (_, idx) => ({
          name: `${team.name} Goalie ${idx + 1}`,
          value: parseFloat((0.920 - idx * 0.008).toFixed(3))
        })),
        injuries: [
          { name: `${team.name} Player A`, daysOut: 10 },
          { name: `${team.name} Player B`, daysOut: 5 }
        ],
        roster: Array.from({ length: 10 }, (_, idx) => ({
          name: `${team.name} Player ${idx + 1}`,
          position: idx % 5 === 0 ? 'C' : idx % 5 === 1 ? 'LW' : idx % 5 === 2 ? 'RW' : idx % 5 === 3 ? 'D' : 'G',
          number: 10 + idx
        }))
      }

  return {
    games: mockGames,
    pointLeaders: basePlayers.pointLeaders,
    goalLeaders: basePlayers.goalLeaders,
    assistLeaders: basePlayers.assistLeaders,
    plusMinusLeaders: basePlayers.plusMinusLeaders,
    avgShiftsLeaders: basePlayers.avgShiftsLeaders,
    goalieStats: basePlayers.goalieStats,
    injuries: basePlayers.injuries,
    roster: basePlayers.roster,
    standings: {
      conferencePosition: 3,
      isWildcard: false,
      divisionPosition: 2,
      wins: 35,
      losses: 12,
      otLosses: 5,
      points: 75
    }
  }
}

export default getMockData;
