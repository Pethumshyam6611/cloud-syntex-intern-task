import { describe, expect, it } from 'vitest'
import { generateUniqueSku } from './sku'

describe('generateUniqueSku', () => {
  it('creates a Product ID with six digits', () => {
    expect(generateUniqueSku([], () => 0.48291)).toBe('PRD-482910')
    expect(generateUniqueSku([], () => 0.48291)).toMatch(/^PRD-\d{6}$/)
  })
})
