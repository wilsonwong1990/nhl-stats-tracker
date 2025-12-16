import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Target, HandsClapping, TrendUp, Lightning, Crosshair } from '@phosphor-icons/react'

interface PlayerModalProps {
  isOpen: boolean
  onClose: () => void
  player: {
    name: string
    position?: string
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
  } | null
}

export function PlayerModal({ isOpen, onClose, player }: PlayerModalProps) {
  if (!player) return null

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === 0) return '0.0%'
    return `${(value * 100).toFixed(1)}%`
  }

  const statItems = [
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
      icon: <Target className="text-accent" size={18} weight="bold" /> 
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
                {player.gamesPlayed} {player.gamesPlayed === 1 ? 'game' : 'games'} played
              </span>
            )}
          </div>
          
          <Separator className="bg-border" />
          
          <div className="space-y-3">
            {statItems.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-bold tabular-nums text-accent">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
