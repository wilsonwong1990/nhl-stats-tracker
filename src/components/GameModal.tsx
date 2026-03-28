import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Target, Clock, Trophy, Warning, MapPin, Star, Shield } from '@phosphor-icons/react'
import { fetchGameDetails, type GameDetails } from '@/lib/nhl-api'
import { formatGameDate } from '@/lib/date-utils'

interface GameModalProps {
  isOpen: boolean
  onClose: () => void
  gameId: string | null
}

export function GameModal({ isOpen, onClose, gameId }: GameModalProps) {
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !gameId) {
      setGameDetails(null)
      setError(null)
      return
    }

    const loadGameDetails = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const details = await fetchGameDetails(gameId)
        if (details) {
          setGameDetails(details)
        } else {
          setError('Unable to load game details')
        }
      } catch (err) {
        console.error('Error loading game details:', err)
        setError('Failed to load game information')
      } finally {
        setIsLoading(false)
      }
    }

    loadGameDetails()
  }, [isOpen, gameId])

  const parseToSeconds = (value?: string) => {
    if (!value) return 0
    const parts = value.split(':').map((segment) => Number(segment))
    if (parts.some((segment) => Number.isNaN(segment))) {
      return 0
    }
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts
      return (hours * 3600) + (minutes * 60) + seconds
    }
    if (parts.length === 2) {
      const [minutes, seconds] = parts
      return (minutes * 60) + seconds
    }
    return parts[0] ?? 0
  }

  const describePeriodType = (periodType?: string) => {
    if (!periodType) return null
    const upper = periodType.toUpperCase()
    if (upper === 'OT') return 'Overtime'
    if (upper === 'SO') return 'Shootout'
    if (upper === 'REG') return null
    return upper
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent pr-8">
            Game Details
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-950/30 px-4 py-3 rounded-lg border border-amber-900/50">
            <Warning size={20} weight="bold" />
            <span>{error}</span>
          </div>
        ) : gameDetails ? (
          <div className="space-y-4">
            {/* Game Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} weight="bold" />
                <span>{formatGameDate(gameDetails.gameDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} weight="bold" />
                <span>{gameDetails.venue}</span>
              </div>
              <Badge variant={gameDetails.gameState === 'FUT' ? 'secondary' : 'default'} className="text-xs">
                {gameDetails.gameState === 'FUT' ? 'Scheduled' : 
                 gameDetails.gameState === 'LIVE' ? 'Live' : 'Final'}
              </Badge>
              {describePeriodType(gameDetails.periodType) && (
                <Badge variant="outline" className="text-xs uppercase border-amber-500 text-amber-400">
                  {describePeriodType(gameDetails.periodType)}
                </Badge>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Score Display */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`space-y-2 p-4 rounded-lg border transition-colors ${
                  typeof gameDetails.awayTeam.score === 'number' && typeof gameDetails.homeTeam.score === 'number' && gameDetails.awayTeam.score > gameDetails.homeTeam.score
                    ? 'bg-accent/10 border-accent/70 shadow-[0_0_0_1px_rgba(14,165,233,0.35)]'
                    : 'bg-card/50 border-border'
                }`}
              >
                <div className="text-sm font-medium text-muted-foreground">Away</div>
                <div className="text-lg font-bold">{gameDetails.awayTeam.name}</div>
                {gameDetails.awayTeam.score !== undefined && (
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-accent tabular-nums">
                      {gameDetails.awayTeam.score}
                    </div>
                    {gameDetails.awayTeam.shots !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        {gameDetails.awayTeam.shots} SOG
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`space-y-2 p-4 rounded-lg border transition-colors ${
                  typeof gameDetails.awayTeam.score === 'number' && typeof gameDetails.homeTeam.score === 'number' && gameDetails.homeTeam.score > gameDetails.awayTeam.score
                    ? 'bg-accent/10 border-accent/70 shadow-[0_0_0_1px_rgba(14,165,233,0.35)]'
                    : 'bg-card/50 border-border'
                }`}
              >
                <div className="text-sm font-medium text-muted-foreground">Home</div>
                <div className="text-lg font-bold">{gameDetails.homeTeam.name}</div>
                {gameDetails.homeTeam.score !== undefined && (
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-accent tabular-nums">
                      {gameDetails.homeTeam.score}
                    </div>
                    {gameDetails.homeTeam.shots !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        {gameDetails.homeTeam.shots} SOG
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Three Stars */}
            {gameDetails.threeStars && gameDetails.threeStars.length > 0 && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="text-accent" size={20} weight="fill" />
                    <h3 className="text-lg font-semibold">Three Stars</h3>
                  </div>
                  <div className="space-y-2">
                    {gameDetails.threeStars.map((star, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            ⭐ {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{star.name}</span>
                        </div>
                        {star.position && (
                          <Badge variant="outline" className="text-xs">
                            {star.position}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Goal Scorers */}
            {gameDetails.goalScorers && gameDetails.goalScorers.length > 0 && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="text-accent" size={20} weight="bold" />
                    <h3 className="text-lg font-semibold">Goals</h3>
                  </div>
                  <div className="space-y-2">
                    {gameDetails.goalScorers.map((goal, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-mono">
                            {goal.team}
                          </Badge>
                          <span className="text-sm font-medium">{goal.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          P{goal.period} - {goal.timeInPeriod}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Goaltending */}
            {gameDetails.goaltenders && gameDetails.goaltenders.length > 0 && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="text-accent" size={20} weight="bold" />
                    <h3 className="text-lg font-semibold">Goaltending</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[gameDetails.awayTeam, gameDetails.homeTeam].map((team) => {
                      const teamGoalies = (gameDetails.goaltenders ?? []).filter((goalie) => goalie.team === team.abbrev)
                      if (teamGoalies.length === 0) return null

                      const meaningfulGoalies = teamGoalies.map((goalie) => ({
                        ...goalie,
                        secondsPlayed: parseToSeconds(goalie.timeOnIce)
                      }))
                      const swapped = meaningfulGoalies.filter((goalie) => goalie.secondsPlayed > 0).length > 1

                      return (
                        <div key={team.abbrev} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              {team.name}
                            </h4>
                            {swapped && (
                              <Badge variant="outline" className="text-[10px] uppercase border-amber-500 text-amber-400">
                                Goalie Swap
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            {meaningfulGoalies.map((goalie) => (
                              <div
                                key={`${team.abbrev}-${goalie.name}`}
                                className="rounded-lg border border-border bg-card/40 p-3 space-y-2"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-sm font-medium text-foreground">
                                    {goalie.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {goalie.isStarter && (
                                      <Badge variant="outline" className="text-[10px] uppercase">Starter</Badge>
                                    )}
                                    {!goalie.isStarter && goalie.secondsPlayed > 0 && (
                                      <Badge variant="secondary" className="text-[10px] uppercase">Relief</Badge>
                                    )}
                                    {goalie.decision && (
                                      <Badge variant="default" className="text-[10px] uppercase">
                                        {goalie.decision}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                  <span>TOI: {goalie.timeOnIce ?? '—'}</span>
                                  <span>Saves: {goalie.saves ?? 0} / {goalie.shotsAgainst ?? 0} SA</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                  <span>Goals Against: {goalie.goalsAgainst ?? 0}</span>
                                  {typeof goalie.savePctg === 'number' && (
                                    <span>SV%: {(goalie.savePctg).toFixed(3)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Future Game Message */}
            {gameDetails.gameState === 'FUT' && (
              <div className="text-center text-sm text-muted-foreground py-4">
                This game has not been played yet. Details will be available after the game.
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}