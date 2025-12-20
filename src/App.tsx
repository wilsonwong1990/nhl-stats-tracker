import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { StatLeaderCard } from '@/components/StatLeaderCard'
import { PlayerModal } from '@/components/PlayerModal'
import { 
  Activity,
  CaretLeft, 
  CaretRight,
  TrendUp,
  Target,
  HandsClapping,
  Shield,
  Lightning,
  Crosshair,
  FirstAid,
  Timer,
  ArrowClockwise,
  Warning,
  PlusCircle,
  MinusCircle,
  Scales,
  Plus,
  Users,
  NumberZero,
  NumberOne, 
  NumberTwo,
  NumberThree,
  NumberFour,
  NumberFive,
  NumberSix,
  NumberSeven,
  NumberEight,
  NumberNine,
  Star,
  CheckCircle,
  XCircle,
  Circle,
  LinkSimple,
  Trophy
} from '@phosphor-icons/react'
import { fetchAllTeamData, type Game, type PlayerStat, type InjuredPlayer, type TeamStats, type RosterPlayer, type StandingsInfo, DEFAULT_SEASON } from '@/lib/nhl-api'
import { applyTeamTheme, getTeamInfo, listTeams, resetTeamTheme, DEFAULT_TEAM_ID, type TeamId } from '@/lib/teams'
import { getAvailableSeasons, getCurrentSeason, formatSeasonDisplay } from '@/lib/seasons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface CachedData {
  data: TeamStats
  timestamp: number
}

const CACHE_DURATION = 24 * 60 * 60 * 1000

function App() {
  const teams = useMemo(() => listTeams(), [])
  const availableSeasons = useMemo(() => getAvailableSeasons(25), [])
  const [selectedTeamId, setSelectedTeamId] = useKV<TeamId>('selected-team', DEFAULT_TEAM_ID)
  const [selectedSeason, setSelectedSeason] = useKV<string>('selected-season', DEFAULT_SEASON)
  const team = useMemo(() => getTeamInfo(selectedTeamId), [selectedTeamId])
  
  // Check if team existed in selected season
  const teamExistedInSeason = useMemo(() => {
    const seasonStartYear = parseInt(selectedSeason.substring(0, 4))
    const teamInceptionYear = team.inceptionYear
    const teamCessationYear = team.cessationYear
    
    // Team must have started by this season
    if (seasonStartYear < teamInceptionYear) {
      return false
    }
    
    // If team has a cessation year, it must not have ended before this season
    if (teamCessationYear && seasonStartYear > teamCessationYear) {
      return false
    }
    
    return true
  }, [selectedSeason, team])
  
  const [currentPage, setCurrentPage] = useKV<number>(`schedule-page-${team.id}-${selectedSeason}`, 0)
  const [cachedTeamData, setCachedTeamData] = useKV<CachedData | null>(`team-data-${team.id}-${selectedSeason}`, null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [games, setGames] = useState<Game[]>([])
  const [pointLeaders, setPointLeaders] = useState<PlayerStat[]>([])
  const [goalLeaders, setGoalLeaders] = useState<PlayerStat[]>([])
  const [assistLeaders, setAssistLeaders] = useState<PlayerStat[]>([])
  const [plusMinusLeaders, setPlusMinusLeaders] = useState<PlayerStat[]>([])
  const [avgShiftsLeaders, setAvgShiftsLeaders] = useState<PlayerStat[]>([])
  const [goalieStats, setGoalieStats] = useState<PlayerStat[]>([])
  const [injuries, setInjuries] = useState<InjuredPlayer[]>([])
  const [roster, setRoster] = useState<RosterPlayer[]>([])
  const [standings, setStandings] = useState<StandingsInfo>({ conferencePosition: 0, isWildcard: false })

  // Player modal state
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStat | RosterPlayer | null>(null)
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false)

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    // If team didn't exist in this season, clear data and don't fetch
    if (!teamExistedInSeason) {
      console.log(`${team.fullName} did not exist in ${selectedSeason}`)
      setGames([])
      setPointLeaders([])
      setGoalLeaders([])
      setAssistLeaders([])
      setPlusMinusLeaders([])
      setAvgShiftsLeaders([])
      setGoalieStats([])
      setInjuries([])
      setRoster([])
      setStandings({ conferencePosition: 0, isWildcard: false })
      setIsLoading(false)
      return
    }

    const now = Date.now()
    const cached = cachedTeamData

    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`Using cached data for ${team.nhlAbbrev}`)
      setGames(cached.data.games)
      setPointLeaders(cached.data.pointLeaders)
      setGoalLeaders(cached.data.goalLeaders)
      setAssistLeaders(cached.data.assistLeaders)
      setPlusMinusLeaders(cached.data.plusMinusLeaders)
      setAvgShiftsLeaders(cached.data.avgShiftsLeaders)
      setGoalieStats(cached.data.goalieStats)
      setInjuries(cached.data.injuries)
      setRoster(cached.data.roster)
      setStandings(cached.data.standings)
      setIsLoading(false)
      return
    }

    try {
      console.log(`Fetching fresh data from NHL API for ${team.nhlAbbrev} season ${selectedSeason}...`)
      const data = await fetchAllTeamData(team, selectedSeason)
      
      console.log('Data loaded successfully:', data)
      setGames(data.games)
      setPointLeaders(data.pointLeaders)
      setGoalLeaders(data.goalLeaders)
      setAssistLeaders(data.assistLeaders)
      setPlusMinusLeaders(data.plusMinusLeaders)
      setAvgShiftsLeaders(data.avgShiftsLeaders)
      setGoalieStats(data.goalieStats)
      setInjuries(data.injuries)
      setRoster(data.roster)
      setStandings(data.standings)

      setCachedTeamData({
        data,
        timestamp: now
      })

      if (forceRefresh) {
        toast.success('Data refreshed successfully')
      }
    } catch (err) {
      console.error(`Error loading ${team.nhlAbbrev} data:`, err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data from NHL API'
      setError(errorMessage)
      
      if (cached) {
        console.log('Falling back to cached data')
        setGames(cached.data.games)
        setPointLeaders(cached.data.pointLeaders)
        setGoalLeaders(cached.data.goalLeaders)
        setAssistLeaders(cached.data.assistLeaders)
        setPlusMinusLeaders(cached.data.plusMinusLeaders)
        setAvgShiftsLeaders(cached.data.avgShiftsLeaders)
        setGoalieStats(cached.data.goalieStats)
        setInjuries(cached.data.injuries)
        setRoster(cached.data.roster)
        setStandings(cached.data.standings)
        toast.error('Using cached data - API unavailable')
      } else {
        toast.error('Failed to load data - please try again')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    applyTeamTheme(team)
  }, [team])

  useEffect(() => {
    return () => {
      resetTeamTheme()
    }
  }, [])

  useEffect(() => {
    setCurrentPage(0)
    loadData(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.id, selectedSeason])

  // Set page to show upcoming games when data loads
  useEffect(() => {
    if (games.length === 0) return

    const todayParts = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').map(part => part.padStart(2, '0'))
    const todayPST = `${todayParts[2]}-${todayParts[0]}-${todayParts[1]}`

    const upcomingGameIndex = games.findIndex(game => game.date >= todayPST)
    const targetPage = upcomingGameIndex !== -1
      ? Math.floor(upcomingGameIndex / 10)
      : Math.max(0, Math.ceil(games.length / 10) - 1)

    setCurrentPage(targetPage)
  }, [games, setCurrentPage])

  const totalPages = Math.ceil(games.length / 10)
  const page = currentPage ?? 0
  const startIndex = page * 10
  const currentGames = games.slice(startIndex, startIndex + 10)

  // Helper function to determine if the selected team won the game
  const isSelectedTeamWin = (game: Game): boolean => {
    if (game.homeScore === undefined || game.awayScore === undefined || game.gameState === 'FUT') return false
    if (game.isHome) {
      return game.homeScore > game.awayScore
    } else {
      return game.awayScore > game.homeScore
    }
  }

  const isOvertimeDecision = (game: Game): boolean => {
    const type = game.lastPeriodType
    if (!type) return false
    const normalized = type.trim().toUpperCase()
    if (normalized === 'REG') return false
    return normalized === 'OT' || normalized === 'SO' || normalized === 'S/O' || normalized === 'SHOOTOUT' || normalized === 'OVERTIME'
  }

  // Helper function to check if game is completed
  const isGameCompleted = (game: Game): boolean => {
    return game.gameState !== 'FUT' && game.gameState !== 'LIVE' && (game.homeScore !== undefined && game.awayScore !== undefined)
  }

  const handlePrevPage = () => {
    setCurrentPage((current) => Math.max(0, (current ?? 0) - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((current) => Math.min(totalPages - 1, (current ?? 0) + 1))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1) // Add one day to correct timezone offset
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const lastUpdated = cachedTeamData ? new Date(cachedTeamData.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles'
  }) : null

  const getStandingsIcon = (standingsInfo: StandingsInfo) => {
    if (standingsInfo.conferencePosition === 0) return null;
    
    if (standingsInfo.isWildcard) {
      return <Star className="text-yellow-500" size={20} weight="fill" />;
    }
    
    const position = standingsInfo.conferencePosition;
    const iconProps = { size: 20, weight: "fill" as const, className: "text-accent" };
    
    switch (position) {
      case 1: return <NumberOne {...iconProps} />;
      case 2: return <NumberTwo {...iconProps} />;
      case 3: return <NumberThree {...iconProps} />;
      case 4: return <NumberFour {...iconProps} />;
      case 5: return <NumberFive {...iconProps} />;
      case 6: return <NumberSix {...iconProps} />;
      case 7: return <NumberSeven {...iconProps} />;
      case 8: return <NumberEight {...iconProps} />;
      case 9: return <NumberNine {...iconProps} />;
      default: return null;
    }
  };

  // Separate regular season and playoff games
  // Regular season is gameType 2, or undefined (for backwards compatibility with older data)
  const regularSeasonGames = games.filter(game => game.gameType === 2 || game.gameType === undefined)
  const playoffGames = games.filter(game => game.gameType === 3)
  
  // Compute regular season record from completed regular season games only
  const completedRegularSeasonGames = regularSeasonGames.filter(isGameCompleted)
  const derivedRegularSeasonWins = completedRegularSeasonGames.filter(isSelectedTeamWin).length
  const derivedRegularSeasonLosses = completedRegularSeasonGames.length - derivedRegularSeasonWins
  const derivedRegularSeasonOTLosses = completedRegularSeasonGames.filter(game => !isSelectedTeamWin(game) && isOvertimeDecision(game)).length
  const derivedRegularSeasonRegulationLosses = Math.max(0, derivedRegularSeasonLosses - derivedRegularSeasonOTLosses)
  
  // Compute playoff record from completed playoff games
  const completedPlayoffGames = playoffGames.filter(isGameCompleted)
  const playoffWins = completedPlayoffGames.filter(isSelectedTeamWin).length
  const playoffLosses = completedPlayoffGames.length - playoffWins
  
  // Check if this team won the Stanley Cup this season (16 playoff wins)
  const wonStanleyCup = playoffWins === 16
  
  const gamesRemaining = regularSeasonGames.filter(game => !isGameCompleted(game) && game.gameState !== 'LIVE').length
  
  // Use official standings for regular season record (standings are regular season only)
  const standingsWins = typeof standings.wins === 'number' ? standings.wins : undefined
  const standingsLosses = typeof standings.losses === 'number' ? standings.losses : undefined
  const standingsOTLosses = typeof standings.otLosses === 'number' ? standings.otLosses : undefined
  const hasStandingsRecord =
    standingsWins !== undefined &&
    standingsLosses !== undefined &&
    standingsOTLosses !== undefined &&
    (standingsWins + standingsLosses + standingsOTLosses) > 0

  // Prefer official standings record if available and non-empty, otherwise derive from regular season schedule
  const wins = hasStandingsRecord ? standingsWins! : derivedRegularSeasonWins
  const losses = hasStandingsRecord ? standingsLosses! : derivedRegularSeasonRegulationLosses
  const otLosses = hasStandingsRecord ? standingsOTLosses! : derivedRegularSeasonOTLosses
  // Regular season record (three-part format)
  const regularSeasonRecord = `${wins}-${losses}-${otLosses}`
  
  // Playoff record (if any playoff games exist)
  const playoffRecord = completedPlayoffGames.length > 0 ? `${playoffWins}-${playoffLosses}` : null

  const hasOfficialPoints = typeof standings.points === 'number' && standings.points > 0
  // Points are regular season only
  const points = hasOfficialPoints
    ? standings.points!
    : (wins * 2) + otLosses

  const ordinal = (n: number) => {
    if (!n) return ''
    const s = ['th','st','nd','rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  const injurySlug = team.puckpediaSlug ?? team.fullName.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')
  const injuryUrl = `https://puckpedia.com/team/${injurySlug}/injuries`

  const handlePlayerClick = (player: PlayerStat | RosterPlayer) => {
    setSelectedPlayer(player)
    setIsPlayerModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsPlayerModalOpen(false)
    setSelectedPlayer(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center">
              NHL Season Stats Tracker
            </h1>
            <Select
              value={selectedSeason}
              onValueChange={(value) => {
                setSelectedSeason(value)
              }}
            >
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                {availableSeasons.map((season) => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select
            value={team.id}
            onValueChange={(value) => {
              setSelectedTeamId(value as TeamId)
              toast.success(`${getTeamInfo(value).fullName} selected`)
            }}
          >
            <SelectTrigger className="w-full max-w-xl mx-auto bg-transparent border-none shadow-none p-0 focus:ring-0 focus:outline-none focus-visible:ring-0 data-[placeholder]:text-center">
              <h2 className="flex w-full items-center justify-center gap-2 text-2xl md:text-3xl font-semibold text-accent tracking-tight text-center">
                <SelectValue placeholder="Select a team" className="text-center" />
                {wonStanleyCup && (
                  <Trophy className="text-yellow-400" size={24} weight="fill" title="Stanley Cup Champion" />
                )}
              </h2>
            </SelectTrigger>
            <SelectContent className="max-h-[320px]">
              {teams.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {import.meta.env?.VITE_USE_MOCK === 'true' && (
            <div className="mx-auto max-w-xl px-4 py-2 rounded-md bg-red-600/15 border border-red-700 text-red-500 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Mock data active – live NHL stats disabled
            </div>
          )}
          {(completedRegularSeasonGames.length > 0 || wins > 0) && (
            <div className="text-sm text-muted-foreground flex flex-col items-center gap-1">
              <span>Regular Season: {regularSeasonRecord}</span>
              {playoffRecord && (
                <span>Playoffs: {playoffRecord}</span>
              )}
              {typeof points === 'number' && (
                <span>Points: {points}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated} PST
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isLoading}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Refresh data"
            >
              <ArrowClockwise className={isLoading ? 'animate-spin' : ''} size={16} weight="bold" />
            </Button>
          </div>
          {error && (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-400 bg-amber-950/30 px-4 py-2 rounded-lg border border-amber-900/50">
              <Warning size={16} weight="bold" />
              <span>{error}</span>
            </div>
          )}
        </header>

        <Separator className="bg-border" />

        {!teamExistedInSeason ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-muted-foreground text-lg">
              {team.fullName} did not exist during the {formatSeasonDisplay(selectedSeason)} season
            </div>
            <div className="text-sm text-muted-foreground">
              {team.fullName} started in the {team.inceptionYear}-{team.inceptionYear + 1} season
              {team.cessationYear && ` and played until the ${team.cessationYear}-${team.cessationYear + 1} season`}
            </div>
          </div>
        ) : (
          <>
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="text-accent" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Games Remaining: {gamesRemaining}</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : currentGames.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No games scheduled
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Time (PST)</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Opponent</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Location</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Score</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentGames.map((game, index) => (
                          <tr 
                            key={game.id} 
                            className={index % 2 === 0 ? 'bg-card/50' : 'bg-transparent'}
                          >
                            <td className="px-4 py-3 text-sm">{formatDate(game.date)}</td>
                            <td className="px-4 py-3 text-sm font-medium tabular-nums">{game.time}</td>
                            <td className="px-4 py-3 text-sm">{game.opponent}</td>
                            <td className="px-4 py-3">
                              <Badge 
                                variant={game.isHome ? 'default' : 'secondary'}
                                className={game.isHome ? 'bg-accent text-accent-foreground' : ''}
                              >
                                {game.isHome ? 'Home' : 'Away'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium tabular-nums">
                              {(game.gameState === 'LIVE' || isGameCompleted(game)) && game.homeScore !== undefined && game.awayScore !== undefined ? (
                                game.isHome 
                                  ? `${game.homeScore} - ${game.awayScore}`
                                  : `${game.awayScore} - ${game.homeScore}`
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {game.gameState === 'LIVE' ? (
                                <div className="flex items-center gap-1">
                                  <Circle className="text-red-500 animate-pulse" size={12} weight="fill" />
                                  <span className="text-xs text-red-500 font-medium">LIVE</span>
                                </div>
                              ) : isGameCompleted(game) ? (
                                isSelectedTeamWin(game) ? (
                                  <CheckCircle className="text-green-500" size={20} weight="fill" />
                                ) : (
                                  <XCircle className="text-red-500" size={20} weight="fill" />
                                )
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevPage}
                        disabled={page === 0}
                        className="hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <CaretLeft size={20} weight="bold" />
                      </Button>
                      
                      <span className="text-sm text-muted-foreground">
                        Page {page + 1} of {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
                        className="hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <CaretRight size={20} weight="bold" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="text-accent" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Stats</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatLeaderCard
              title="Point Leaders"
              icon={<TrendUp className="text-accent" size={20} weight="bold" />}
              leaders={pointLeaders}
              isLoading={isLoading}
              onPlayerClick={handlePlayerClick}
            />
            <StatLeaderCard
              title="Goal Leaders"
              icon={<Target className="text-accent" size={20} weight="bold" />}
              leaders={goalLeaders}
              isLoading={isLoading}
              onPlayerClick={handlePlayerClick}
            />
            <StatLeaderCard
              title="Assist Leaders"
              icon={<HandsClapping className="text-accent" size={20} weight="bold" />}
              leaders={assistLeaders}
              isLoading={isLoading}
              onPlayerClick={handlePlayerClick}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatLeaderCard
              title="Plus/Minus Leaders"
              icon={<Plus className="text-accent" size={20} weight="bold" />}
              leaders={plusMinusLeaders}
              isLoading={isLoading}
              onPlayerClick={handlePlayerClick}
            />
            <StatLeaderCard
              title="Avg Time on Ice"
              icon={<Lightning className="text-accent" size={20} weight="bold" />}
              leaders={avgShiftsLeaders}
              isLoading={isLoading}
              onPlayerClick={handlePlayerClick}
            />
            <StatLeaderCard
              title="Goalie Save %"
              icon={<Crosshair className="text-accent" size={20} weight="bold" />}
              leaders={goalieStats}
              isLoading={isLoading}
              formatValue={(value) => `${(value * 100).toFixed(1)}%`}
              onPlayerClick={handlePlayerClick}
            />
          </div>
        </section>


        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="text-primary" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Roster</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-6 w-8" />
                    </div>
                  ))}
                </div>
              ) : roster.length === 0 ? (
                <p className="text-sm text-muted-foreground">Roster information unavailable</p>
              ) : (
                (() => {
                  const forwards = roster.filter(p => ['C','LW','RW','F'].includes(p.position))
                  const defense = roster.filter(p => p.position === 'D')
                  const goalies = roster.filter(p => p.position === 'G')
                  const Section = ({ title, players }: { title: string; players: typeof roster }) => (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {players.map(player => (
                          <div 
                            key={`${player.name}-${player.number}`} 
                            className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handlePlayerClick(player)}
                          >
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-sm font-medium">{player.name}</div>
                                <div className="text-xs text-muted-foreground">{player.position}</div>
                              </div>
                              {player.captaincy && (
                                <Badge 
                                  variant="default" 
                                  className={`text-xs font-bold ${
                                    player.captaincy === 'C' 
                                      ? 'bg-yellow-600 text-white' 
                                      : 'bg-yellow-700 text-white'
                                  }`}
                                >
                                  {player.captaincy}
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">#{player.number}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                  return (
                    <div className="space-y-6">
                      <Section title="Forwards" players={forwards} />
                      <Section title="Defensemen" players={defense} />
                      <Section title="Goalies" players={goalies} />
                    </div>
                  )
                })()
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkSimple className="text-accent" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Links</h2>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <a
                  href={injuryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent hover:underline flex items-center gap-2"
                >
                  <FirstAid size={16} weight="bold" className="text-destructive" />
                  Injury Report (PuckPedia)
                </a>
                <p className="text-xs text-muted-foreground">External source for current injuries</p>
              </div>
            </CardContent>
          </Card>
        </section>
          </>
        )}
      </div>

      <PlayerModal 
        isOpen={isPlayerModalOpen}
        onClose={handleCloseModal}
        player={selectedPlayer}
      />
    </div>
  );
}

export default App
