import { describe, expect, it } from 'vitest'
import {
  calculateAdjustedQuantity,
  calculateInventoryValue,
  getStockStatus,
} from './stock'

describe('stock utilities', () => {
  it('calculates inventory value', () => {
    expect(calculateInventoryValue(3500, 12)).toBe(42000)
  })

  it.each([
    [8, 'In Stock'],
    [5, 'Low Stock'],
    [1, 'Low Stock'],
    [0, 'Out of Stock'],
  ])('maps quantity %s to %s', (quantity, expectedStatus) => {
    expect(getStockStatus(quantity)).toBe(expectedStatus)
  })

  it('prevents stock from being decreased below zero', () => {
    expect(() => calculateAdjustedQuantity(3, 'decrease', 4)).toThrow(
      'Stock cannot be decreased below zero.',
    )
  })
})
