import { describe, it, expect } from 'vitest'
import { formatGameDate, formatGameTime, getGameDateInPST } from './date-utils'

describe('Date Utils', () => {
  describe('formatGameDate', () => {
    it('should format YYYY-MM-DD date string correctly in long format', () => {
      // YYYY-MM-DD strings are treated as midnight UTC which becomes previous day in PST
      // The +1 day workaround corrects this to show the intended game date
      const result = formatGameDate('2025-12-09', 'long')
      // When parsing '2025-12-09' as Date, JS treats it as midnight UTC (Dec 9 00:00 UTC)
      // Adding 1 day makes it Dec 10 00:00 UTC, which displays as Dec 10 in local time
      expect(result).toBe('Wednesday, December 10, 2025')
    })

    it('should format YYYY-MM-DD date string correctly in short format', () => {
      const result = formatGameDate('2025-12-09', 'short')
      expect(result).toBe('Dec 10, 2025')
    })

    it('should format YYYYMMDD date string correctly', () => {
      const result = formatGameDate('20251209', 'short')
      expect(result).toBe('Dec 10, 2025')
    })

    it('should handle UTC timestamps and convert to PST', () => {
      // This is 12:00 AM UTC on Dec 9, which is 4:00 PM PST on Dec 8
      const result = formatGameDate('2025-12-09T00:00:00Z', 'long')
      expect(result).toBe('Monday, December 8, 2025')
    })

    it('should return "Date TBD" for undefined input', () => {
      const result = formatGameDate(undefined)
      expect(result).toBe('Date TBD')
    })

    it('should return "Date TBD" for empty string', () => {
      const result = formatGameDate('')
      expect(result).toBe('Date TBD')
    })

    it('should return "Date TBD" for invalid date string', () => {
      const result = formatGameDate('invalid-date')
      expect(result).toBe('Date TBD')
    })

    it('should default to long format when format is not specified', () => {
      const result = formatGameDate('2025-12-09')
      expect(result).toBe('Wednesday, December 10, 2025')
    })
  })

  describe('formatGameTime', () => {
    it('should format UTC time to PST correctly', () => {
      // 3:00 AM UTC = 7:00 PM PST (previous day during winter)
      const result = formatGameTime('2025-12-09T03:00:00Z')
      expect(result).toMatch(/7:00 PM/)
    })

    it('should handle different times correctly', () => {
      // 2:00 AM UTC = 6:00 PM PST (previous day during winter)
      const result = formatGameTime('2025-12-09T02:00:00Z')
      expect(result).toMatch(/6:00 PM/)
    })
  })

  describe('getGameDateInPST', () => {
    it('should convert UTC timestamp to PST date in YYYY-MM-DD format', () => {
      // 3:00 AM UTC on Dec 9 = 7:00 PM PST on Dec 8
      const result = getGameDateInPST('2025-12-09T03:00:00Z')
      expect(result).toBe('2025-12-08')
    })

    it('should handle midnight UTC correctly', () => {
      // Midnight UTC on Dec 9 = 4:00 PM PST on Dec 8
      const result = getGameDateInPST('2025-12-09T00:00:00Z')
      expect(result).toBe('2025-12-08')
    })

    it('should handle dates that stay the same day in PST', () => {
      // 10:00 AM UTC on Dec 9 = 2:00 AM PST on Dec 9
      const result = getGameDateInPST('2025-12-09T10:00:00Z')
      expect(result).toBe('2025-12-09')
    })
  })
})
