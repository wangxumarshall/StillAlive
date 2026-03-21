import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateLifeSeconds,
  formatLifeTime
} from '../src/services/userService'

describe('userService', () => {
  describe('calculateLifeSeconds', () => {
    it('should calculate correct life seconds for a 25-year-old', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      const result = calculateLifeSeconds(birthDate.toISOString().split('T')[0])

      // Should be approximately 53 years * 365.25 * 24 * 60 * 60
      const expected = 53 * 365.25 * 24 * 60 * 60
      expect(result).toBeGreaterThan(expected - 10000)
      expect(result).toBeLessThan(expected + 10000)
    })

    it('should return 0 for someone over 78 years old', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 80)
      const result = calculateLifeSeconds(birthDate.toISOString().split('T')[0])

      expect(result).toBe(0)
    })
  })

  describe('formatLifeTime', () => {
    it('should format 0 seconds correctly', () => {
      const result = formatLifeTime(0)
      expect(result.years).toBe(0)
      expect(result.days).toBe(0)
      expect(result.hours).toBe(0)
      expect(result.minutes).toBe(0)
      expect(result.seconds).toBe(0)
    })

    it('should format 1 year correctly', () => {
      const secondsInYear = 365.25 * 24 * 60 * 60
      const result = formatLifeTime(secondsInYear)

      expect(result.years).toBe(1)
      expect(result.days).toBe(0)
    })

    it('should format 1 day correctly', () => {
      const secondsInDay = 24 * 60 * 60
      const result = formatLifeTime(secondsInDay)

      expect(result.days).toBe(1)
      expect(result.hours).toBe(0)
    })

    it('should format 1 hour correctly', () => {
      const secondsInHour = 60 * 60
      const result = formatLifeTime(secondsInHour)

      expect(result.hours).toBe(1)
      expect(result.minutes).toBe(0)
    })

    it('should format complex time correctly', () => {
      // 1 year, 100 days, 12 hours, 30 minutes, 45 seconds
      const seconds =
        (365.25 * 24 * 60 * 60) +
        (100 * 24 * 60 * 60) +
        (12 * 60 * 60) +
        (30 * 60) +
        45

      const result = formatLifeTime(seconds)

      expect(result.years).toBe(1)
      expect(result.days).toBe(100)
      expect(result.hours).toBe(12)
      expect(result.minutes).toBe(30)
      expect(result.seconds).toBe(45)
    })
  })

})
