import { describe, it, expect } from 'vitest'
import { generateId, formatTime } from '@utils/helpers.js'

describe('Helper Functions', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
    expect(id1).toBeTruthy()
  })

  it('should format time correctly', () => {
    const date = new Date('2024-01-01T15:30:00')
    const formatted = formatTime(date)
    expect(formatted).toBe('15:30')
  })
})