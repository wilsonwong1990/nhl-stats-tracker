import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from 'react'
import { type PlayerStat } from '@/lib/nhl-api'

interface StatLeaderCardProps {
  title: string
  icon: ReactNode
  leaders: PlayerStat[]
  isLoading: boolean
  formatValue?: (value: number) => string
  onPlayerClick?: (player: PlayerStat) => void
}

export function StatLeaderCard({ title, icon, leaders, isLoading, formatValue, onPlayerClick }: StatLeaderCardProps) {
  const defaultFormat = (value: number) => value.toString()
  const formatter = formatValue || defaultFormat

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 flex-1 max-w-[150px]" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </>
        ) : leaders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          leaders.map((player, index) => (
            <div 
              key={player.name} 
              className={`flex items-center justify-between ${onPlayerClick ? 'group cursor-pointer rounded-md px-2 py-1 touch-manipulation transition-colors hover:bg-accent/15 active:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:bg-accent/20 hover:ring-1 hover:ring-ring/30' : ''}`}
              role={onPlayerClick ? 'button' : undefined}
              tabIndex={onPlayerClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (!onPlayerClick) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPlayerClick(player)
                }
              }}
              onClick={() => onPlayerClick?.(player)}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <span className="text-sm group-hover:underline group-active:underline">
                  {player.name}
                </span>
              </div>
              <span className="text-sm font-medium tabular-nums text-accent">
                {formatter(player.value)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
