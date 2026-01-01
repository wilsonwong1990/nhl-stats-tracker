import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Target, HandsClapping, TrendUp, Lightning, Crosshair, Trophy, Shield, XCircle, Clock } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { fetchPlayerCareerStats, type CareerStats } from '@/lib/nhl-api'

interface PlayerModalProps {
  isOpen: boolean
  onClose: () => void
  player: {
    name: string
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
    // Goalie stats
    wins?: number
    losses?: number
    otLosses?: number
    savePctg?: number
    goalsAgainstAvg?: number
    shutouts?: number
    shotsAgainst?: number
    saves?: number
    goalsAgainst?: number
  } | null
}

export function PlayerModal({ isOpen, onClose, player }: PlayerModalProps) {
  const [careerStats, setCareerStats] = useState<CareerStats | null>(null)
  const [isLoadingCareer, setIsLoadingCareer] = useState(false)
  const [activeTab, setActiveTab] = useState('current')

  useEffect(() => {
    // Reset career stats when modal opens/closes or player changes
    if (!isOpen || !player) {
      setCareerStats(null)
      setActiveTab('current')
      setIsLoadingCareer(false)
    }
  }, [isOpen, player])

  useEffect(() => {
    // Fetch career stats when Career tab is selected
    if (activeTab === 'career' && player?.playerId && !careerStats && !isLoadingCareer) {
      setIsLoadingCareer(true)
      fetchPlayerCareerStats(player.playerId).then(stats => {
        setCareerStats(stats)
        setIsLoadingCareer(false)
      }).catch((error) => {
        console.error('Error fetching career stats:', error)
        setIsLoadingCareer(false)
      })
    }
  }, [activeTab, player?.playerId, careerStats, isLoadingCareer])

  if (!player) return null

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A'
    if (value === 0) return '0.0%'
    return `${(value * 100).toFixed(1)}%`
  }

  const formatDecimal = (value: number | undefined, decimals: number = 2) => {
    if (value === undefined || value === 0) return '0.00'
    return value.toFixed(decimals)
  }

  const isGoalie = player.position === 'G'

  const statItems = isGoalie ? [
    { 
      label: 'Wins', 
      value: player.wins || 0, 
      icon: <Trophy className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Losses', 
      value: player.losses || 0, 
      icon: <XCircle className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'OT Losses', 
      value: player.otLosses || 0, 
      icon: <Clock className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Save Percentage', 
      value: formatPercentage(player.savePctg), 
      icon: <Shield className="text-accent" size={18} weight="bold" />
    },
    { 
      label: 'Goals Against Average', 
      value: formatDecimal(player.goalsAgainstAvg, 2), 
      icon: <Crosshair className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shutouts', 
      value: player.shutouts || 0, 
      icon: <Target className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Saves', 
      value: player.saves || 0, 
      icon: <Shield className="text-accent" size={18} weight="bold" /> 
    },
  ] : [
    { 
      label: 'Goals', 
      value: player.goals || 0, 
      icon: <Target className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Power Play Goals', 
      value: player.powerPlayGoals || 0, 
      icon: <Lightning className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Game Winning Goals', 
      value: player.gameWinningGoals || 0, 
      icon: <TrendUp className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shooting Percentage', 
      value: formatPercentage(player.shootingPctg), 
      icon: <Crosshair className="text-accent" size={18} weight="bold" />
    },
    { 
      label: 'Shorthanded Goals', 
      value: player.shorthandedGoals || 0, 
      icon: <XCircle className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Power Play Points', 
      value: player.powerPlayPoints || 0, 
      icon: <Lightning className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shorthanded Points', 
      value: player.shorthandedPoints || 0, 
      icon: <HandsClapping className="text-accent" size={18} weight="bold" /> 
    },
  ]

  const careerStatItems = careerStats ? (isGoalie ? [
    { 
      label: 'Wins', 
      value: careerStats.wins || 0, 
      icon: <Trophy className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Losses', 
      value: careerStats.losses || 0, 
      icon: <XCircle className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'OT Losses', 
      value: careerStats.otLosses || 0, 
      icon: <Clock className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shutouts', 
      value: careerStats.shutouts || 0, 
      icon: <Target className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Saves', 
      value: careerStats.saves || 0, 
      icon: <Shield className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shots Against', 
      value: careerStats.shotsAgainst || 0, 
      icon: <Crosshair className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Goals Against', 
      value: careerStats.goalsAgainst || 0, 
      icon: <XCircle className="text-accent" size={18} weight="bold" /> 
    },
  ] : [
    { 
      label: 'Goals', 
      value: careerStats.goals || 0, 
      icon: <Target className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Assists', 
      value: careerStats.assists || 0, 
      icon: <HandsClapping className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Points', 
      value: careerStats.points || 0, 
      icon: <TrendUp className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Power Play Goals', 
      value: careerStats.powerPlayGoals || 0, 
      icon: <Lightning className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Game Winning Goals', 
      value: careerStats.gameWinningGoals || 0, 
      icon: <TrendUp className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shorthanded Goals', 
      value: careerStats.shorthandedGoals || 0, 
      icon: <XCircle className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Power Play Points', 
      value: careerStats.powerPlayPoints || 0, 
      icon: <Lightning className="text-accent" size={18} weight="bold" /> 
    },
    { 
      label: 'Shorthanded Points', 
      value: careerStats.shorthandedPoints || 0, 
      icon: <HandsClapping className="text-accent" size={18} weight="bold" /> 
    },
  ]) : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent pr-8">
            {player.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {player.position && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                {player.position}
              </Badge>
            )}
            {player.gamesPlayed !== undefined && player.gamesPlayed > 0 && (
              <span className="text-sm text-muted-foreground">
                {player.gamesPlayed} {player.gamesPlayed === 1 ? 'game' : 'games'} played this season
              </span>
            )}
          </div>
          
          <Separator className="bg-border" />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Season</TabsTrigger>
              <TabsTrigger value="career">Career Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-3 mt-4">
              {statItems.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 active:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    {stat.icon}
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-accent">
                    {stat.value}
                  </span>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="career" className="space-y-3 mt-4">
              {isLoadingCareer && (
                <div className="text-center py-8 text-muted-foreground">
                  Loading career stats...
                </div>
              )}
              {!isLoadingCareer && !careerStats && player.playerId && (
                <div className="text-center py-8 text-muted-foreground">
                  Career stats unavailable
                </div>
              )}
              {!isLoadingCareer && !player.playerId && (
                <div className="text-center py-8 text-muted-foreground">
                  Career stats require player ID
                </div>
              )}
              {!isLoadingCareer && careerStats && (
                <>
                  {careerStats.gamesPlayed > 0 && (
                    <div className="text-sm text-muted-foreground mb-3">
                      {careerStats.gamesPlayed} career {careerStats.gamesPlayed === 1 ? 'game' : 'games'} played
                    </div>
                  )}
                  {careerStatItems.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 active:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        {stat.icon}
                        <span className="text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-accent">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
