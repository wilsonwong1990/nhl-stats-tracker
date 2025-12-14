// Centralized mock data for development/reference only.
// Import interfaces from nhl-api to preserve types.
import { type Game, type PlayerStat, type InjuredPlayer, type RosterPlayer, type StandingsInfo, type TeamStats } from './nhl-api'
import { DEFAULT_TEAM_ID, getTeamInfo, type TeamId } from './teams'

/**
 * getMockData returns a fully-populated TeamStats object with placeholder values.
 * This is separated from nhl-api.ts to keep production API code clean.
 * NOTE: Avoid using this in production paths; prefer real API data.
 */
export function getMockData(teamId: TeamId = DEFAULT_TEAM_ID): TeamStats {
  const team = getTeamInfo(teamId)
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

  const basePlayers = team.id === DEFAULT_TEAM_ID
    ? {
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
      wins: 10,
      losses: 5,
      otLosses: 0,
      points: 20
    }
  }
}

export default getMockData;
