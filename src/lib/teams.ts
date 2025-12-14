export type TeamId =
  | 'ANA'
  | 'BOS'
  | 'BUF'
  | 'CGY'
  | 'CAR'
  | 'CHI'
  | 'COL'
  | 'CBJ'
  | 'DAL'
  | 'DET'
  | 'EDM'
  | 'FLA'
  | 'LAK'
  | 'MIN'
  | 'MTL'
  | 'NSH'
  | 'NJD'
  | 'NYI'
  | 'NYR'
  | 'OTT'
  | 'PHI'
  | 'PIT'
  | 'SEA'
  | 'SJS'
  | 'STL'
  | 'TBL'
  | 'TOR'
  | 'VAN'
  | 'VGK'
  | 'WSH'
  | 'WPG'
    | 'UTA'

export interface TeamTheme {
  primary: string
  onPrimary: string
  secondary: string
  onSecondary: string
  background: string
  foreground: string
  foregroundMuted?: string
}

export interface TeamInfo {
  id: TeamId
  city: string
  name: string
  fullName: string
  nhlAbbrev: TeamId
  puckpediaSlug?: string
  theme: TeamTheme
}

interface ThemeOverrides {
  prefix: string
  color: string
  contrast: string
}

const defaultTheme: ThemeOverrides = {
  prefix: 'accent',
  color: '#0EA5E9',
  contrast: '#FFFFFF'
}

const defaultSecondary: ThemeOverrides = {
  prefix: 'accent-secondary',
  color: '#6366F1',
  contrast: '#FFFFFF'
}

export const TEAMS: readonly TeamInfo[] = [
  {
    id: 'ANA',
    city: 'Anaheim',
    name: 'Ducks',
    fullName: 'Anaheim Ducks',
    nhlAbbrev: 'ANA',
    puckpediaSlug: 'anaheim-ducks',
    theme: {
      primary: '#F47A38',
      onPrimary: '#111111',
      secondary: '#111111',
      onSecondary: '#FFFFFF',
      background: '#090909',
      foreground: '#F6F6F6'
    }
  },
  {
    id: 'UTA',
    city: 'Utah',
    name: 'Mammoth',
    fullName: 'Utah Mammoth',
    nhlAbbrev: 'UTA',
    puckpediaSlug: 'utah-mammoth',
    theme: {
      primary: '#5E0F7A',
      onPrimary: '#FCEFFF',
      secondary: '#0F5E50',
      onSecondary: '#E8FFF9',
      background: '#0A040C',
      foreground: '#F8F4FF'
    }
  },
  {
    id: 'BOS',
    city: 'Boston',
    name: 'Bruins',
    fullName: 'Boston Bruins',
    nhlAbbrev: 'BOS',
    puckpediaSlug: 'boston-bruins',
    theme: {
      primary: '#FFB81C',
      onPrimary: '#111111',
      secondary: '#111111',
      onSecondary: '#FFFFFF',
      background: '#050505',
      foreground: '#F8F8F8'
    }
  },
  {
    id: 'BUF',
    city: 'Buffalo',
    name: 'Sabres',
    fullName: 'Buffalo Sabres',
    nhlAbbrev: 'BUF',
    puckpediaSlug: 'buffalo-sabres',
    theme: {
      primary: '#002654',
      onPrimary: '#FFFFFF',
      secondary: '#FCB514',
      onSecondary: '#102041',
      background: '#040812',
      foreground: '#F8FAFC'
    }
  },
  {
    id: 'CGY',
    city: 'Calgary',
    name: 'Flames',
    fullName: 'Calgary Flames',
    nhlAbbrev: 'CGY',
    puckpediaSlug: 'calgary-flames',
    theme: {
      primary: '#C8102E',
      onPrimary: '#FFE5D9',
      secondary: '#F1BE48',
      onSecondary: '#341108',
      background: '#220606',
      foreground: '#FFFAF5'
    }
  },
  {
    id: 'CAR',
    city: 'Carolina',
    name: 'Hurricanes',
    fullName: 'Carolina Hurricanes',
    nhlAbbrev: 'CAR',
    puckpediaSlug: 'carolina-hurricanes',
    theme: {
      primary: '#CC0000',
      onPrimary: '#FFECEC',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#080808',
      foreground: '#F6F6F6'
    }
  },
  {
    id: 'CHI',
    city: 'Chicago',
    name: 'Blackhawks',
    fullName: 'Chicago Blackhawks',
    nhlAbbrev: 'CHI',
    puckpediaSlug: 'chicago-blackhawks',
    theme: {
      primary: '#CF0A2C',
      onPrimary: '#FFE6EB',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#0B0B0B',
      foreground: '#F7F7F7'
    }
  },
  {
    id: 'COL',
    city: 'Colorado',
    name: 'Avalanche',
    fullName: 'Colorado Avalanche',
    nhlAbbrev: 'COL',
    puckpediaSlug: 'colorado-avalanche',
    theme: {
      primary: '#6F263D',
      onPrimary: '#F8E4EC',
      secondary: '#236192',
      onSecondary: '#EFF7FF',
      background: '#120813',
      foreground: '#F3F6FB'
    }
  },
  {
    id: 'CBJ',
    city: 'Columbus',
    name: 'Blue Jackets',
    fullName: 'Columbus Blue Jackets',
    nhlAbbrev: 'CBJ',
    puckpediaSlug: 'columbus-blue-jackets',
    theme: {
      primary: '#002654',
      onPrimary: '#FFFFFF',
      secondary: '#CE1126',
      onSecondary: '#FDEDEE',
      background: '#03060E',
      foreground: '#F8FAFC'
    }
  },
  {
    id: 'DAL',
    city: 'Dallas',
    name: 'Stars',
    fullName: 'Dallas Stars',
    nhlAbbrev: 'DAL',
    puckpediaSlug: 'dallas-stars',
    theme: {
      primary: '#006847',
      onPrimary: '#E6FFF6',
      secondary: '#8F8F8C',
      onSecondary: '#111111',
      background: '#05100C',
      foreground: '#F6F9F8'
    }
  },
  {
    id: 'DET',
    city: 'Detroit',
    name: 'Red Wings',
    fullName: 'Detroit Red Wings',
    nhlAbbrev: 'DET',
    puckpediaSlug: 'detroit-red-wings',
    theme: {
      primary: '#CE1126',
      onPrimary: '#FFE6EA',
      secondary: '#FFFFFF',
      onSecondary: '#B70B1E',
      background: '#130203',
      foreground: '#FFF8F9'
    }
  },
  {
    id: 'EDM',
    city: 'Edmonton',
    name: 'Oilers',
    fullName: 'Edmonton Oilers',
    nhlAbbrev: 'EDM',
    puckpediaSlug: 'edmonton-oilers',
    theme: {
      primary: '#041E42',
      onPrimary: '#FFFFFF',
      secondary: '#FF4C00',
      onSecondary: '#1A0B00',
      background: '#030610',
      foreground: '#F6F8FF'
    }
  },
  {
    id: 'FLA',
    city: 'Florida',
    name: 'Panthers',
    fullName: 'Florida Panthers',
    nhlAbbrev: 'FLA',
    puckpediaSlug: 'florida-panthers',
    theme: {
      primary: '#041E42',
      onPrimary: '#FFFFFF',
      secondary: '#C8102E',
      onSecondary: '#FFE7EC',
      background: '#070D1B',
      foreground: '#F6F8FF'
    }
  },
  {
    id: 'LAK',
    city: 'Los Angeles',
    name: 'Kings',
    fullName: 'Los Angeles Kings',
    nhlAbbrev: 'LAK',
    puckpediaSlug: 'los-angeles-kings',
    theme: {
      primary: '#111111',
      onPrimary: '#FFFFFF',
      secondary: '#A2AAAD',
      onSecondary: '#141A1D',
      background: '#040404',
      foreground: '#F7F7F7'
    }
  },
  {
    id: 'MIN',
    city: 'Minnesota',
    name: 'Wild',
    fullName: 'Minnesota Wild',
    nhlAbbrev: 'MIN',
    puckpediaSlug: 'minnesota-wild',
    theme: {
      primary: '#154734',
      onPrimary: '#E6FFF6',
      secondary: '#A6192E',
      onSecondary: '#FFE7EC',
      background: '#06100B',
      foreground: '#F5FAF7'
    }
  },
  {
    id: 'MTL',
    city: 'Montréal',
    name: 'Canadiens',
    fullName: 'Montréal Canadiens',
    nhlAbbrev: 'MTL',
    puckpediaSlug: 'montreal-canadiens',
    theme: {
      primary: '#AF1E2D',
      onPrimary: '#FFE6EA',
      secondary: '#192168',
      onSecondary: '#E6EDFF',
      background: '#0A0F24',
      foreground: '#F7F9FF'
    }
  },
  {
    id: 'NSH',
    city: 'Nashville',
    name: 'Predators',
    fullName: 'Nashville Predators',
    nhlAbbrev: 'NSH',
    puckpediaSlug: 'nashville-predators',
    theme: {
      primary: '#FFB81C',
      onPrimary: '#13213B',
      secondary: '#041E42',
      onSecondary: '#FFFFFF',
      background: '#0B0F1C',
      foreground: '#FFF9E5'
    }
  },
  {
    id: 'NJD',
    city: 'New Jersey',
    name: 'Devils',
    fullName: 'New Jersey Devils',
    nhlAbbrev: 'NJD',
    puckpediaSlug: 'new-jersey-devils',
    theme: {
      primary: '#CE1126',
      onPrimary: '#FFE5EA',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#0A090A',
      foreground: '#F6F6F6'
    }
  },
  {
    id: 'NYI',
    city: 'New York',
    name: 'Islanders',
    fullName: 'New York Islanders',
    nhlAbbrev: 'NYI',
    puckpediaSlug: 'new-york-islanders',
    theme: {
      primary: '#00539B',
      onPrimary: '#FFFFFF',
      secondary: '#F47D30',
      onSecondary: '#211104',
      background: '#041021',
      foreground: '#F5F9FF'
    }
  },
  {
    id: 'NYR',
    city: 'New York',
    name: 'Rangers',
    fullName: 'New York Rangers',
    nhlAbbrev: 'NYR',
    puckpediaSlug: 'new-york-rangers',
    theme: {
      primary: '#0038A8',
      onPrimary: '#FFFFFF',
      secondary: '#C8102E',
      onSecondary: '#FFE6EA',
      background: '#030A1A',
      foreground: '#F5F9FF'
    }
  },
  {
    id: 'OTT',
    city: 'Ottawa',
    name: 'Senators',
    fullName: 'Ottawa Senators',
    nhlAbbrev: 'OTT',
    puckpediaSlug: 'ottawa-senators',
    theme: {
      primary: '#C52032',
      onPrimary: '#FFE6EA',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#0B090B',
      foreground: '#F7F5F2'
    }
  },
  {
    id: 'PHI',
    city: 'Philadelphia',
    name: 'Flyers',
    fullName: 'Philadelphia Flyers',
    nhlAbbrev: 'PHI',
    puckpediaSlug: 'philadelphia-flyers',
    theme: {
      primary: '#F74902',
      onPrimary: '#160600',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#0D0704',
      foreground: '#FFF7F2'
    }
  },
  {
    id: 'PIT',
    city: 'Pittsburgh',
    name: 'Penguins',
    fullName: 'Pittsburgh Penguins',
    nhlAbbrev: 'PIT',
    puckpediaSlug: 'pittsburgh-penguins',
    theme: {
      primary: '#FCB514',
      onPrimary: '#111111',
      secondary: '#000000',
      onSecondary: '#FFFFFF',
      background: '#060504',
      foreground: '#F8F6F2'
    }
  },
  {
    id: 'SEA',
    city: 'Seattle',
    name: 'Kraken',
    fullName: 'Seattle Kraken',
    nhlAbbrev: 'SEA',
    puckpediaSlug: 'seattle-kraken',
    theme: {
      primary: '#001628',
      onPrimary: '#E6F8FF',
      secondary: '#99D9D9',
      onSecondary: '#002C39',
      background: '#020914',
      foreground: '#F2FBFF'
    }
  },
  {
    id: 'SJS',
    city: 'San Jose',
    name: 'Sharks',
    fullName: 'San Jose Sharks',
    nhlAbbrev: 'SJS',
    puckpediaSlug: 'san-jose-sharks',
    theme: {
      primary: '#006D75',
      onPrimary: '#E6FBFF',
      secondary: '#EA7200',
      onSecondary: '#1A0A00',
      background: '#031314',
      foreground: '#F2FCFC'
    }
  },
  {
    id: 'STL',
    city: 'St. Louis',
    name: 'Blues',
    fullName: 'St. Louis Blues',
    nhlAbbrev: 'STL',
    puckpediaSlug: 'st-louis-blues',
    theme: {
      primary: '#002F87',
      onPrimary: '#FFFFFF',
      secondary: '#FCB514',
      onSecondary: '#1A1202',
      background: '#040A18',
      foreground: '#F6F9FF'
    }
  },
  {
    id: 'TBL',
    city: 'Tampa Bay',
    name: 'Lightning',
    fullName: 'Tampa Bay Lightning',
    nhlAbbrev: 'TBL',
    puckpediaSlug: 'tampa-bay-lightning',
    theme: {
      primary: '#002868',
      onPrimary: '#FFFFFF',
      secondary: '#0A1A2F',
      onSecondary: '#E6F0FF',
      background: '#010612',
      foreground: '#F5F8FF'
    }
  },
  {
    id: 'TOR',
    city: 'Toronto',
    name: 'Maple Leafs',
    fullName: 'Toronto Maple Leafs',
    nhlAbbrev: 'TOR',
    puckpediaSlug: 'toronto-maple-leafs',
    theme: {
      primary: '#00205B',
      onPrimary: '#FFFFFF',
      secondary: '#FFFFFF',
      onSecondary: '#003C8F',
      background: '#020816',
      foreground: '#F2F6FF'
    }
  },
  {
    id: 'VAN',
    city: 'Vancouver',
    name: 'Canucks',
    fullName: 'Vancouver Canucks',
    nhlAbbrev: 'VAN',
    puckpediaSlug: 'vancouver-canucks',
    theme: {
      primary: '#00205B',
      onPrimary: '#FFFFFF',
      secondary: '#00843D',
      onSecondary: '#E6FFEE',
      background: '#020916',
      foreground: '#F3F8FF'
    }
  },
  {
    id: 'VGK',
    city: 'Vegas',
    name: 'Golden Knights',
    fullName: 'Vegas Golden Knights',
    nhlAbbrev: 'VGK',
    puckpediaSlug: 'vegas-golden-knights',
    theme: {
      primary: '#B4975A',
      onPrimary: '#111722',
      secondary: '#333F48',
      onSecondary: '#F8F9FA',
      background: '#0B0D16',
      foreground: '#F5FAFF'
    }
  },
  {
    id: 'WSH',
    city: 'Washington',
    name: 'Capitals',
    fullName: 'Washington Capitals',
    nhlAbbrev: 'WSH',
    puckpediaSlug: 'washington-capitals',
    theme: {
      primary: '#041E42',
      onPrimary: '#FFFFFF',
      secondary: '#C8102E',
      onSecondary: '#FFE7EC',
      background: '#070E1E',
      foreground: '#F4F8FF'
    }
  },
  {
    id: 'WPG',
    city: 'Winnipeg',
    name: 'Jets',
    fullName: 'Winnipeg Jets',
    nhlAbbrev: 'WPG',
    puckpediaSlug: 'winnipeg-jets',
    theme: {
      primary: '#041E42',
      onPrimary: '#FFFFFF',
      secondary: '#AC162C',
      onSecondary: '#FFE6EC',
      background: '#050C1A',
      foreground: '#F5F9FF'
    }
  }
]

const DEFAULT_TEAM_ID_FALLBACK: TeamId = 'VGK'

const DEFAULT_TEAM = TEAMS.find(team => team.id === DEFAULT_TEAM_ID_FALLBACK) ?? TEAMS[0]

export const DEFAULT_TEAM_ID: TeamId = (DEFAULT_TEAM?.id ?? DEFAULT_TEAM_ID_FALLBACK) as TeamId

const TEAM_MAP: Record<TeamId, TeamInfo> = TEAMS.reduce((acc, team) => {
  acc[team.id] = team
  return acc
}, {} as Record<TeamId, TeamInfo>)

const TEAMS_SORTED: readonly TeamInfo[] = [...TEAMS].sort((a, b) =>
  a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' })
)

const clamp = (value: number, min = 0, max = 255) => Math.min(Math.max(value, min), max)

const normalizeHex = (hex: string): string => {
  const clean = hex.trim().replace('#', '')
  if (clean.length === 3) {
    return clean.split('').map(char => char + char).join('')
  }
  return clean.padEnd(6, '0').slice(0, 6)
}

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = normalizeHex(hex)
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ]
}

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (value: number) => clamp(Math.round(value)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const mixWith = (base: string, target: [number, number, number], ratio: number): string => {
  const [r, g, b] = hexToRgb(base)
  const safeRatio = Math.max(0, Math.min(ratio, 1))
  const mixed = [r, g, b].map((component, index) => {
    const targetComponent = target[index]
    return component + (targetComponent - component) * safeRatio
  }) as [number, number, number]
  return rgbToHex(mixed[0], mixed[1], mixed[2])
}

const generateColorScale = (base: string): string[] => {
  const lightenStops = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35]
  const darkenStops = [0.25, 0.4, 0.55, 0.7, 0.82, 0.92]
  return [
    ...lightenStops.map((value) => mixWith(base, [255, 255, 255], value)),
    ...darkenStops.map((value) => mixWith(base, [0, 0, 0], value))
  ]
}

const buildBasePalette = (team: TeamInfo) => {
  const surfaceLight = mixWith(team.theme.background, [255, 255, 255], 0.12)
  const surfaceLighter = mixWith(team.theme.background, [255, 255, 255], 0.18)
  const surfaceMuted = mixWith(team.theme.background, [255, 255, 255], 0.25)
  const accent = mixWith(team.theme.primary, [255, 255, 255], 0.35)
  return {
    '--background': team.theme.background,
    '--foreground': team.theme.foreground,
    '--card': surfaceLight,
    '--card-foreground': team.theme.foreground,
    '--popover': surfaceLight,
    '--popover-foreground': team.theme.foreground,
    '--primary': team.theme.primary,
    '--primary-foreground': team.theme.onPrimary,
    '--secondary': team.theme.secondary,
    '--secondary-foreground': team.theme.onSecondary,
    '--muted': surfaceMuted,
    '--muted-foreground': mixWith(team.theme.foreground, [0, 0, 0], 0.35),
    '--accent': accent,
    '--accent-foreground': team.theme.onPrimary,
    '--destructive': '#B00020',
    '--destructive-foreground': '#FFFFFF',
    '--border': surfaceLighter,
    '--input': surfaceLighter,
    '--ring': team.theme.primary
  } as Record<string, string>
}

const BASE_PALETTE_KEYS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring'
]

const getThemeTargets = (): HTMLElement[] => {
  if (typeof document === 'undefined') return []
  const targets = [
    document.getElementById('spark-app'),
    document.getElementById('root'),
    document.body,
    document.documentElement
  ]
  return targets.filter(Boolean) as HTMLElement[]
}

const setColorScale = ({ prefix, color, contrast }: ThemeOverrides) => {
  const targets = getThemeTargets()
  if (targets.length === 0) return
  const scale = generateColorScale(color)
  scale.forEach((value, index) => {
    targets.forEach(target => target.style.setProperty(`--color-${prefix}-${index + 1}`, value))
  })
  targets.forEach(target => target.style.setProperty(`--color-${prefix}-contrast`, contrast))
}

export function applyTeamTheme(team: TeamInfo) {
  const targets = getThemeTargets()
  if (targets.length === 0) return

  const accent: ThemeOverrides = {
    ...defaultTheme,
    color: team.theme.primary,
    contrast: team.theme.onPrimary
  }

  const accentSecondary: ThemeOverrides = {
    ...defaultSecondary,
    color: team.theme.secondary,
    contrast: team.theme.onSecondary
  }

  setColorScale(accent)
  setColorScale(accentSecondary)

  targets.forEach(target => {
    target.style.setProperty('--color-bg', team.theme.background)
    target.style.setProperty('--color-bg-inset', team.theme.background)
    target.style.setProperty('--color-bg-overlay', team.theme.background)
    target.style.setProperty('--color-fg', team.theme.foreground)
    target.style.setProperty(
      '--color-fg-secondary',
      team.theme.foregroundMuted ?? 'rgba(255,255,255,0.72)'
    )
    target.style.setProperty('--color-focus-ring', team.theme.secondary || team.theme.primary)

    const basePalette = buildBasePalette(team)
    Object.entries(basePalette).forEach(([variable, value]) => {
      target.style.setProperty(variable, value)
    })
  })
}

export function resetTeamTheme() {
  const targets = getThemeTargets()
  if (targets.length === 0) return
  setColorScale(defaultTheme)
  setColorScale(defaultSecondary)
  targets.forEach(target => {
    target.style.removeProperty('--color-bg')
    target.style.removeProperty('--color-bg-inset')
    target.style.removeProperty('--color-bg-overlay')
    target.style.removeProperty('--color-fg')
    target.style.removeProperty('--color-fg-secondary')
    target.style.removeProperty('--color-focus-ring')
    BASE_PALETTE_KEYS.forEach(variable => target.style.removeProperty(variable))
  })
}

export function getTeamInfo(id: string | undefined | null): TeamInfo {
  if (!id) {
    return TEAM_MAP[DEFAULT_TEAM_ID]
  }
  const key = id.toUpperCase() as TeamId
  return TEAM_MAP[key] ?? TEAM_MAP[DEFAULT_TEAM_ID]
}

export function listTeams(): readonly TeamInfo[] {
  return TEAMS_SORTED
}
