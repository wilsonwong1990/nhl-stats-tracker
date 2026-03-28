import { getCurrentSeason } from './seasons'

export const NHL_API_BASE = '/nhl-api/v1'
export const DEFAULT_SEASON = getCurrentSeason().id
export const SCHEDULE_FETCH_TIMEOUT_MS = 10_000

export const STANDINGS_LOCALE = 'en-CA'
export const STANDINGS_TIME_ZONE = 'America/New_York'
