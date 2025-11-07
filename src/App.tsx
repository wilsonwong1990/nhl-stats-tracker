import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Timer
} from '@phosphor-icons/react'

interface Game {
  id: string
  opponent: string
  date: string
  time: string
  isHome: boolean
}

interface PlayerStat {
  name: string
  value: number
}

interface InjuredPlayer {
  name: string
  daysOut: number
}

function App() {
  const [currentPage, setCurrentPage] = useKV<number>('schedule-page', 0)
  
  const games: Game[] = [
    { id: '1', opponent: 'Anaheim Ducks', date: '2025-02-01', time: '7:00 PM', isHome: true },
    { id: '2', opponent: 'Seattle Kraken', date: '2025-02-03', time: '7:30 PM', isHome: false },
    { id: '3', opponent: 'Calgary Flames', date: '2025-02-05', time: '6:00 PM', isHome: true },
    { id: '4', opponent: 'Edmonton Oilers', date: '2025-02-08', time: '5:00 PM', isHome: false },
    { id: '5', opponent: 'Los Angeles Kings', date: '2025-02-10', time: '7:00 PM', isHome: true },
    { id: '6', opponent: 'San Jose Sharks', date: '2025-02-12', time: '7:30 PM', isHome: false },
    { id: '7', opponent: 'Vancouver Canucks', date: '2025-02-14', time: '7:00 PM', isHome: true },
    { id: '8', opponent: 'Colorado Avalanche', date: '2025-02-16', time: '6:00 PM', isHome: false },
    { id: '9', opponent: 'Arizona Coyotes', date: '2025-02-18', time: '7:00 PM', isHome: true },
    { id: '10', opponent: 'Dallas Stars', date: '2025-02-20', time: '5:30 PM', isHome: false },
    { id: '11', opponent: 'Minnesota Wild', date: '2025-02-22', time: '7:00 PM', isHome: true },
    { id: '12', opponent: 'Winnipeg Jets', date: '2025-02-24', time: '6:00 PM', isHome: false },
    { id: '13', opponent: 'Nashville Predators', date: '2025-02-26', time: '7:00 PM', isHome: true },
    { id: '14', opponent: 'St. Louis Blues', date: '2025-02-28', time: '7:30 PM', isHome: false },
    { id: '15', opponent: 'Chicago Blackhawks', date: '2025-03-02', time: '7:00 PM', isHome: true },
    { id: '16', opponent: 'Anaheim Ducks', date: '2025-03-04', time: '7:00 PM', isHome: false },
    { id: '17', opponent: 'Seattle Kraken', date: '2025-03-06', time: '7:30 PM', isHome: true },
    { id: '18', opponent: 'Calgary Flames', date: '2025-03-08', time: '6:00 PM', isHome: false },
    { id: '19', opponent: 'Edmonton Oilers', date: '2025-03-10', time: '7:00 PM', isHome: true },
    { id: '20', opponent: 'Los Angeles Kings', date: '2025-03-12', time: '7:00 PM', isHome: false },
  ]

  const pointLeaders: PlayerStat[] = [
    { name: 'Jack Eichel', value: 68 },
    { name: 'Mark Stone', value: 54 },
    { name: 'Jonathan Marchessault', value: 52 },
    { name: 'William Karlsson', value: 48 },
    { name: 'Chandler Stephenson', value: 45 },
  ]

  const goalLeaders: PlayerStat[] = [
    { name: 'Jonathan Marchessault', value: 28 },
    { name: 'Jack Eichel', value: 26 },
    { name: 'Mark Stone', value: 22 },
    { name: 'William Karlsson', value: 20 },
    { name: 'Reilly Smith', value: 18 },
  ]

  const assistLeaders: PlayerStat[] = [
    { name: 'Jack Eichel', value: 42 },
    { name: 'Mark Stone', value: 32 },
    { name: 'William Karlsson', value: 28 },
    { name: 'Chandler Stephenson', value: 27 },
    { name: 'Jonathan Marchessault', value: 24 },
  ]

  const blockLeaders: PlayerStat[] = [
    { name: 'Brayden McNabb', value: 142 },
    { name: 'Alex Pietrangelo', value: 128 },
    { name: 'Shea Theodore', value: 115 },
    { name: 'Zach Whitecloud', value: 98 },
    { name: 'Alec Martinez', value: 92 },
  ]

  const hitLeaders: PlayerStat[] = [
    { name: 'Keegan Kolesar', value: 186 },
    { name: 'Brayden McNabb', value: 164 },
    { name: 'William Carrier', value: 152 },
    { name: 'Nicolas Roy', value: 138 },
    { name: 'Zach Whitecloud', value: 124 },
  ]

  const goalieStats: PlayerStat[] = [
    { name: 'Adin Hill', value: 0.918 },
    { name: 'Logan Thompson', value: 0.912 },
    { name: 'Laurent Brossoit', value: 0.908 },
  ]

  const injuries: InjuredPlayer[] = [
    { name: 'Max Pacioretty', daysOut: 14 },
    { name: 'Nolan Patrick', daysOut: 7 },
  ]

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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-accent tracking-tight">
            Vegas Golden Knights
          </h1>
          <p className="text-muted-foreground">2024-25 Season Stats Tracker</p>
        </header>

        <Separator className="bg-border" />

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="text-accent" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Upcoming Games</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Offensive Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendUp className="text-accent" size={20} weight="bold" />
                  Point Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pointLeaders.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {player.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="text-accent" size={20} weight="bold" />
                  Goal Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {goalLeaders.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {player.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HandsClapping className="text-accent" size={20} weight="bold" />
                  Assist Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assistLeaders.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {player.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Defensive & Goalie Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="text-accent" size={20} weight="bold" />
                  Block Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {blockLeaders.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {player.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightning className="text-accent" size={20} weight="bold" />
                  Hit Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hitLeaders.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {player.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crosshair className="text-accent" size={20} weight="bold" />
                  Goalie Save %
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {goalieStats.map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-accent">
                      {(player.value * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FirstAid className="text-destructive" size={24} weight="bold" />
            <h2 className="text-xl font-semibold">Injury Report</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {injuries.length === 0 ? (
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
