/**
 * Date and time utility functions for NHL Stats Tracker
 * All dates and times are handled in PST/PDT (America/Los_Angeles timezone)
 */

/**
 * Format a game date for display in PST timezone
 * This is the canonical function for formatting dates throughout the application
 * 
 * @param rawDate - Date string in various formats (YYYY-MM-DD, YYYYMMDD, or ISO 8601)
 * @param format - Display format: 'long' (e.g., "Monday, December 9, 2025") or 'short' (e.g., "Dec 9, 2025")
 * @returns Formatted date string in PST timezone
 * 
 * @example
 * formatGameDate('2025-12-09') // "Monday, December 9, 2025"
 * formatGameDate('2025-12-09', 'short') // "Dec 9, 2025"
 * formatGameDate('20251209') // "Monday, December 9, 2025"
 */
export function formatGameDate(rawDate: string | undefined, format: 'long' | 'short' = 'long'): string {
  if (!rawDate) return 'Date TBD'

  let normalized = rawDate

  // Handle compact YYYYMMDD strings returned by some NHL endpoints
  if (/^\d{8}$/.test(rawDate)) {
    normalized = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6)}`
  }

  // For ISO date strings (YYYY-MM-DD), treat as PST date
  // This matches the behavior in the game list which uses getGameDateInPST
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    // Parse as a date in PST timezone to avoid off-by-one errors
    const date = new Date(normalized)
    date.setDate(date.getDate() + 1) // Add one day to correct timezone offset
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // For full UTC timestamps, convert to PST and format
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    console.warn('[date-utils] Unable to parse game date value:', rawDate)
    return 'Date TBD'
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Los_Angeles'
    })
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  })
}

/**
 * Format a game time for display in PST timezone
 * 
 * @param dateString - Date/time string (typically ISO 8601 UTC timestamp)
 * @returns Formatted time string in PST (e.g., "7:00 PM")
 * 
 * @example
 * formatGameTime('2025-12-09T03:00:00Z') // "7:00 PM" (PST)
 */
export function formatGameTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Get the game date in PST timezone from a UTC timestamp
 * Returns in YYYY-MM-DD format
 * 
 * @param dateString - Date/time string (typically ISO 8601 UTC timestamp)
 * @returns Date string in YYYY-MM-DD format (PST timezone)
 * 
 * @example
 * getGameDateInPST('2025-12-09T03:00:00Z') // "2025-12-08" (PST)
 */
export function getGameDateInPST(dateString: string): string {
  const date = new Date(dateString)
  const pstDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
  return pstDate // Returns YYYY-MM-DD format
}
