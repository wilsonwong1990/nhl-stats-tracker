import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { StatLeaderCard } from '@/components/StatLeaderCard'
import { 
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
  Warning
} from '@phosphor-icons/react'
import { fetchAllVGKData, type Game, type PlayerStat, type InjuredPlayer, type TeamStats } from '@/lib/nhl-api'
import { toast } from 'sonner'

interface CachedData {
  data: TeamStats
  timestamp: number
}

const CACHE_DURATION = 24 * 60 * 60 * 1000

function App() {
  const [currentPage, setCurrentPage] = useKV<number>('schedule-page', 0)
  const [cachedTeamData, setCachedTeamData] = useKV<CachedData | null>('vgk-team-data', null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [games, setGames] = useState<Game[]>([])
  const [pointLeaders, setPointLeaders] = useState<PlayerStat[]>([])
  const [goalLeaders, setGoalLeaders] = useState<PlayerStat[]>([])
  const [assistLeaders, setAssistLeaders] = useState<PlayerStat[]>([])
  const [blockLeaders, setBlockLeaders] = useState<PlayerStat[]>([])
  const [hitLeaders, setHitLeaders] = useState<PlayerStat[]>([])
  const [goalieStats, setGoalieStats] = useState<PlayerStat[]>([])
  const [injuries, setInjuries] = useState<InjuredPlayer[]>([])

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    const now = Date.now()
    const cached = cachedTeamData

    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('Using cached data')
      setGames(cached.data.games)
      setPointLeaders(cached.data.pointLeaders)
      setGoalLeaders(cached.data.goalLeaders)
      setAssistLeaders(cached.data.assistLeaders)
      setBlockLeaders(cached.data.blockLeaders)
      setHitLeaders(cached.data.hitLeaders)
      setGoalieStats(cached.data.goalieStats)
      setInjuries(cached.data.injuries)
      setIsLoading(false)
      return
    }

    try {
      console.log('Fetching fresh data from NHL API...')
      const data = await fetchAllVGKData()
      
      console.log('Data loaded successfully:', data)
      setGames(data.games)
      setPointLeaders(data.pointLeaders)
      setGoalLeaders(data.goalLeaders)
      setAssistLeaders(data.assistLeaders)
      setBlockLeaders(data.blockLeaders)
      setHitLeaders(data.hitLeaders)
      setGoalieStats(data.goalieStats)
      setInjuries(data.injuries)

      setCachedTeamData({
        data,
        timestamp: now
      })

      if (forceRefresh) {
        toast.success('Data refreshed successfully')
      }
    } catch (err) {
      console.error('Error loading VGK data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data from NHL API'
      setError(errorMessage)
      
      if (cached) {
        console.log('Falling back to cached data')
        setGames(cached.data.games)
        setPointLeaders(cached.data.pointLeaders)
        setGoalLeaders(cached.data.goalLeaders)
        setAssistLeaders(cached.data.assistLeaders)
        setBlockLeaders(cached.data.blockLeaders)
        setHitLeaders(cached.data.hitLeaders)
        setGoalieStats(cached.data.goalieStats)
        setInjuries(cached.data.injuries)
        toast.error('Using cached data - API unavailable')
      } else {
        toast.error('Failed to load data - please try again')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalPages = Math.ceil(games.length / 10)
  const page = currentPage ?? 0
  const startIndex = page * 10
  const currentGames = games.slice(startIndex, startIndex + 10)

  const handlePrevPage = () => {
    setCurrentPage((current) => Math.max(0, (current ?? 0) - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((current) => Math.min(totalPages - 1, (current ?? 0) + 1))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const lastUpdated = cachedTeamData ? new Date(cachedTeamData.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles'
  }) : null

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-accent tracking-tight">
            Vegas Golden Knights
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <p className="text-muted-foreground">2024-25 Season Stats Tracker</p>
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

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="text-accent" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Upcoming Games</h2>
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
                  No upcoming games scheduled
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
          <h2 className="text-xl font-semibold">Offensive Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatLeaderCard
              title="Point Leaders"
              icon={<TrendUp className="text-accent" size={20} weight="bold" />}
              leaders={pointLeaders}
              isLoading={isLoading}
            />
            <StatLeaderCard
              title="Goal Leaders"
              icon={<Target className="text-accent" size={20} weight="bold" />}
              leaders={goalLeaders}
              isLoading={isLoading}
            />
            <StatLeaderCard
              title="Assist Leaders"
              icon={<HandsClapping className="text-accent" size={20} weight="bold" />}
              leaders={assistLeaders}
              isLoading={isLoading}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Defensive & Goalie Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatLeaderCard
              title="Block Leaders"
              icon={<Shield className="text-accent" size={20} weight="bold" />}
              leaders={blockLeaders}
              isLoading={isLoading}
            />
            <StatLeaderCard
              title="Hit Leaders"
              icon={<Lightning className="text-accent" size={20} weight="bold" />}
              leaders={hitLeaders}
              isLoading={isLoading}
            />
            <StatLeaderCard
              title="Goalie Save %"
              icon={<Crosshair className="text-accent" size={20} weight="bold" />}
              leaders={goalieStats}
              isLoading={isLoading}
              formatValue={(value) => `${(value * 100).toFixed(1)}%`}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FirstAid className="text-destructive" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Injury Report</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : injuries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No players currently injured</p>
              ) : (
                <div className="space-y-3">
                  {injuries.map((injury) => (
                    <div key={injury.name} className="flex items-center justify-between">
                      <span className="text-sm">{injury.name}</span>
                      <Badge variant="destructive">
                        {injury.daysOut} {injury.daysOut === 1 ? 'day' : 'days'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default App
