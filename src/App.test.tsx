import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '@/App'
import * as nhlApi from '@/lib/nhl-api'
import * as teams from '@/lib/teams'
import type { TeamStats, Game, PlayerStat } from '@/lib/nhl-api'

// Mock the Spark hooks with proper implementation
const mockUseKV = vi.fn((key: string, defaultValue: any) => {
  return [defaultValue, vi.fn()]
})

vi.mock('@github/spark/hooks', () => ({
  useKV: (key: string, defaultValue: any) => mockUseKV(key, defaultValue)
}))

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('App Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mockUseKV to default behavior
    mockUseKV.mockImplementation((key: string, defaultValue: any) => {
      return [defaultValue, vi.fn()]
    })
  })

  describe('Page Rendering', () => {
    it('should not be blank - renders main title', async () => {
      const mockData: TeamStats = {
        games: [],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      // Verify the page is not blank by checking for key elements
      expect(screen.getByText(/NHL Season Stats Tracker/i)).toBeInTheDocument()
    })

    it('should render stats sections', async () => {
      const mockData: TeamStats = {
        games: [],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        // Check for stat leader sections by their unique titles
        expect(screen.getByText(/Point Leaders/i)).toBeInTheDocument()
        expect(screen.getByText(/Goal Leaders/i)).toBeInTheDocument()
        expect(screen.getByText(/Assist Leaders/i)).toBeInTheDocument()
      })
    })
  })

  describe('Jack Eichel Stats - October 14, 2025 Game', () => {
    it('should display Jack Eichel stats from Oct 14, 2025 game', async () => {
      // Game on October 14, 2025 for Vegas Golden Knights
      // Based on NHL schedule, this would be a specific game ID
      // We'll mock the game data and verify Jack Eichel's stats
      const oct14Game: Game = {
        id: '2025020015', // Example game ID format
        opponent: 'St. Louis Blues',
        date: '2025-10-14',
        time: '7:00 PM',
        isHome: true,
        homeScore: 4,
        awayScore: 3,
        gameState: 'OFF',
        lastPeriodType: 'REG',
        gameType: 2
      }

      const jackEichelStats: PlayerStat = {
        name: 'Jack Eichel',
        position: 'C',
        playerId: 8478403,
        goals: 1,
        assists: 1,
        points: 2,
        value: 2, // value represents the stat being measured (points in this case)
        gamesPlayed: 1
      }

      const mockData: TeamStats = {
        games: [oct14Game],
        pointLeaders: [jackEichelStats],
        goalLeaders: [jackEichelStats],
        assistLeaders: [jackEichelStats],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      // Wait for data to load
      await waitFor(() => {
        // Verify the game exists
        expect(screen.getByText(/St. Louis Blues/i)).toBeInTheDocument()
        
        // Verify Jack Eichel appears in stat leaders
        const eichelElements = screen.getAllByText(/Jack Eichel/i)
        expect(eichelElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Vegas Golden Knights - 2022-2023 Stanley Cup Champions', () => {
    it('should show Vegas Golden Knights as Stanley Cup champions for 2022-2023 season', async () => {
      // Mock useKV to return the 2022-2023 season
      mockUseKV.mockImplementation((key: string, defaultValue: any) => {
        if (key === 'selected-season') {
          return ['20222023', vi.fn()]
        }
        if (key === 'selected-team') {
          return ['VGK', vi.fn()]
        }
        return [defaultValue, vi.fn()]
      })

      // In the 2022-2023 season, VGK won the Stanley Cup (16 playoff wins)
      // Create realistic playoff wins with varied home/away patterns
      const playoffGames: Game[] = Array.from({ length: 16 }, (_, i) => {
        const isHome = i % 3 !== 0 // More varied pattern, not just alternating
        const teamWon = true // All playoff games were wins
        
        return {
          id: `2023030${String(i + 1).padStart(3, '0')}`,
          opponent: 'Various Teams',
          date: '2023-06-01',
          time: '5:00 PM',
          isHome,
          homeScore: isHome ? (teamWon ? 4 : 2) : (teamWon ? 2 : 4),
          awayScore: isHome ? (teamWon ? 2 : 4) : (teamWon ? 4 : 2),
          gameState: 'OFF',
          lastPeriodType: 'REG',
          gameType: 3 // Playoff game
        }
      })

      // Add some regular season games
      const regularSeasonGames: Game[] = Array.from({ length: 5 }, (_, i) => ({
        id: `2023020${String(i + 1).padStart(3, '0')}`,
        opponent: 'Test Opponent',
        date: '2023-04-01',
        time: '7:00 PM',
        isHome: true,
        homeScore: 3,
        awayScore: 2,
        gameState: 'OFF',
        lastPeriodType: 'REG',
        gameType: 2
      }))

      const mockData: TeamStats = {
        games: [...regularSeasonGames, ...playoffGames],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 1, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        // Check for Stanley Cup trophy icon (Trophy component should be rendered)
        // The app shows trophy when playoff wins === 16
        const trophyTitle = screen.queryByTitle('Stanley Cup Champion')
        expect(trophyTitle).toBeInTheDocument()
      })
    })
  })

  describe('Arizona Coyotes - Team Cessation', () => {
    it('should show Arizona Coyotes did not exist in 2025-2026 season', async () => {
      // Arizona Coyotes ceased operations after 2023-2024 season (cessationYear: 2023)
      const arizonaTeam = teams.getTeamInfo('ARI')
      
      // Verify the team has a cessation year
      expect(arizonaTeam.cessationYear).toBe(2023)

      // Mock useKV to select Arizona and 2025-2026 season
      mockUseKV.mockImplementation((key: string, defaultValue: any) => {
        if (key === 'selected-season') {
          return ['20252026', vi.fn()]
        }
        if (key === 'selected-team') {
          return ['ARI', vi.fn()]
        }
        return [defaultValue, vi.fn()]
      })

      const mockData: TeamStats = {
        games: [],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        // Should show a message that the team didn't exist in that season
        expect(screen.getByText(/did not exist during/i)).toBeInTheDocument()
      }, { timeout: 5000 })
    })

    it('should verify Arizona Coyotes has cessation year of 2023', () => {
      const arizonaTeam = teams.getTeamInfo('ARI')
      
      expect(arizonaTeam.cessationYear).toBe(2023)
      expect(arizonaTeam.fullName).toBe('Arizona Coyotes')
      expect(arizonaTeam.inceptionYear).toBe(1996)
    })
  })

  describe('Additional Important Tests', () => {
    it('should load team data for Vegas Golden Knights', async () => {
      const vegasTeam = teams.getTeamInfo('VGK')
      
      expect(vegasTeam.fullName).toBe('Vegas Golden Knights')
      expect(vegasTeam.inceptionYear).toBe(2017)
      expect(vegasTeam.cessationYear).toBeUndefined() // Team still exists
    })

    it('should display roster when available', async () => {
      const mockData: TeamStats = {
        games: [],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [
          { name: 'Jack Eichel', position: 'C', number: 9, captaincy: null },
          { name: 'Mark Stone', position: 'RW', number: 61, captaincy: 'C' },
          { name: 'Adin Hill', position: 'G', number: 33, captaincy: null }
        ],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Roster/i)).toBeInTheDocument()
        expect(screen.getByText('Jack Eichel')).toBeInTheDocument()
        expect(screen.getByText('Mark Stone')).toBeInTheDocument()
        expect(screen.getByText('Adin Hill')).toBeInTheDocument()
      })
    })

    it('should display stat leaders correctly', async () => {
      const mockData: TeamStats = {
        games: [],
        pointLeaders: [
          { 
            name: 'Jack Eichel', 
            value: 50, 
            position: 'C', 
            goals: 25, 
            assists: 25, 
            points: 50,
            gamesPlayed: 50
          }
        ],
        goalLeaders: [
          { 
            name: 'Jonathan Marchessault', 
            value: 30, 
            position: 'RW', 
            goals: 30,
            assists: 15,
            points: 45,
            gamesPlayed: 50
          }
        ],
        assistLeaders: [
          { 
            name: 'Jack Eichel', 
            value: 35, 
            position: 'C', 
            goals: 20,
            assists: 35,
            points: 55,
            gamesPlayed: 50
          }
        ],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [
          { 
            name: 'Adin Hill', 
            value: 0.915, 
            position: 'G', 
            wins: 25,
            losses: 15,
            savePctg: 0.915,
            goalsAgainstAvg: 2.50,
            shutouts: 3,
            gamesPlayed: 40
          }
        ],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        // Check that stat leaders are displayed
        const eichelElements = screen.getAllByText(/Jack Eichel/i)
        expect(eichelElements.length).toBeGreaterThan(0)
        
        expect(screen.getByText(/Jonathan Marchessault/i)).toBeInTheDocument()
        expect(screen.getByText(/Adin Hill/i)).toBeInTheDocument()
      })
    })

    it('should handle games remaining count', async () => {
      const futureGame: Game = {
        id: '2025020100',
        opponent: 'Colorado Avalanche',
        date: '2025-12-25',
        time: '7:00 PM',
        isHome: true,
        gameState: 'FUT',
        gameType: 2
      }

      const mockData: TeamStats = {
        games: [futureGame],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Games Remaining:/i)).toBeInTheDocument()
      })
    })

    it('should display team selection dropdown', async () => {
      const mockData: TeamStats = {
        games: [],
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { conferencePosition: 0, isWildcard: false }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        // The team name should be displayed (default is VGK)
        expect(screen.getByText(/Vegas Golden Knights/i)).toBeInTheDocument()
      })
    })

    it('should show regular season record', async () => {
      const completedGames: Game[] = [
        {
          id: '2025020001',
          opponent: 'Team A',
          date: '2025-10-10',
          time: '7:00 PM',
          isHome: true,
          homeScore: 4,
          awayScore: 2,
          gameState: 'OFF',
          gameType: 2
        },
        {
          id: '2025020002',
          opponent: 'Team B',
          date: '2025-10-12',
          time: '7:00 PM',
          isHome: false,
          homeScore: 3,
          awayScore: 2,
          gameState: 'OFF',
          gameType: 2
        }
      ]

      const mockData: TeamStats = {
        games: completedGames,
        pointLeaders: [],
        goalLeaders: [],
        assistLeaders: [],
        plusMinusLeaders: [],
        avgShiftsLeaders: [],
        goalieStats: [],
        injuries: [],
        roster: [],
        standings: { 
          conferencePosition: 1, 
          isWildcard: false,
          wins: 2,
          losses: 0,
          otLosses: 0,
          points: 4
        }
      }

      vi.spyOn(nhlApi, 'fetchAllTeamData').mockResolvedValue(mockData)

      render(<App />)

      await waitFor(() => {
        expect(screen.getByText(/Regular Season:/i)).toBeInTheDocument()
        expect(screen.getByText(/Points:/i)).toBeInTheDocument()
      })
    })
  })
})
