import { beforeEach, describe, expect, it } from 'vitest'
import { applyTeamTheme, DEFAULT_TEAM_ID, getTeamInfo, listTeams, resetTeamTheme } from './teams'

const ensureRoots = () => {
  if (!document.getElementById('spark-app')) {
    const sparkApp = document.createElement('div')
    sparkApp.id = 'spark-app'
    document.body.appendChild(sparkApp)
  }

  if (!document.getElementById('root')) {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  }
}

describe('teams utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    ensureRoots()
    resetTeamTheme()
  })

  it('returns teams sorted alphabetically by full name', () => {
    const teams = listTeams()
    const names = teams.map(team => team.fullName)
    const sorted = [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    expect(names).toEqual(sorted)
  })

  it('falls back to default team when identifier is unknown', () => {
    const unknown = getTeamInfo('XYZ')
    expect(unknown.id).toBe(DEFAULT_TEAM_ID)
  })

  it('applies team theme to root elements', () => {
    const team = getTeamInfo('BOS')
    ensureRoots()

    applyTeamTheme(team)

    const html = document.documentElement
    const body = document.body
    const sparkRoot = document.getElementById('spark-app')!

    expect(html.style.getPropertyValue('--background')).toBe(team.theme.background)
    expect(body.style.getPropertyValue('--color-bg')).toBe(team.theme.background)
    expect(sparkRoot.style.getPropertyValue('--color-bg')).toBe(team.theme.background)
    expect(html.style.getPropertyValue('--primary')).toBe(team.theme.primary)

    resetTeamTheme()

    expect(html.style.getPropertyValue('--background')).toBe('')
    expect(body.style.getPropertyValue('--color-bg')).toBe('')
  })
})
