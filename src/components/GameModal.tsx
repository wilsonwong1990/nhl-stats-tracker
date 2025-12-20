import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Target, Clock, Trophy, Warning, MapPin, Star } from '@phosphor-icons/react'
import { fetchGameDetails, type GameDetails } from '@/lib/nhl-api'

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

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
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
                <span>{formatDate(gameDetails.gameDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} weight="bold" />
                <span>{gameDetails.venue}</span>
              </div>
              <Badge variant={gameDetails.gameState === 'FUT' ? 'secondary' : 'default'} className="text-xs">
                {gameDetails.gameState === 'FUT' ? 'Scheduled' : 
                 gameDetails.gameState === 'LIVE' ? 'Live' : 'Final'}
              </Badge>
            </div>

            <Separator className="bg-border" />

            {/* Score Display */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg bg-card/50 border border-border">
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

              <div className="space-y-2 p-4 rounded-lg bg-card/50 border border-border">
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
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
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
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
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

            {/* Penalties */}
            {gameDetails.penalties && gameDetails.penalties.length > 0 && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Warning className="text-amber-400" size={20} weight="bold" />
                    <h3 className="text-lg font-semibold">Penalties</h3>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {gameDetails.penalties.map((penalty, index) => (
                      <div 
                        key={index}
                        className="flex items-start justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors gap-2"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <Badge variant="outline" className="text-xs font-mono">
                            {penalty.team}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{penalty.player}</div>
                            <div className="text-xs text-muted-foreground">{penalty.penalty}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          <div>P{penalty.period} - {penalty.timeInPeriod}</div>
                          <div className="text-accent">{penalty.duration} min</div>
                        </div>
                      </div>
                    ))}
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
