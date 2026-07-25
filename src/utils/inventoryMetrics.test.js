import { describe, expect, it } from 'vitest'
import {
  calculateCategoryAnalytics,
  calculateCategoryMetrics,
  calculateInventoryStats,
} from './inventoryMetrics'

const products = [
  { categoryId: 'electronics', price: 1200.5, quantity: 8 },
  { categoryId: 'office', price: 2000, quantity: 6 },
  { categoryId: 'electronics', price: 500, quantity: 5 },
  { categoryId: 'other', price: 999, quantity: 0 },
]

describe('inventory metrics', () => {
  it('calculates exact dashboard totals and stock-status counts', () => {
    expect(calculateInventoryStats(products, 6)).toEqual({
      totalProducts: 4,
      totalStockUnits: 19,
      totalInventoryValue: 24104,
      inStockProducts: 2,
      lowStockProducts: 1,
      outOfStockProducts: 1,
      totalCategories: 6,
    })
  })

  it('calculates exact per-category count, units, and value', () => {
    expect(calculateCategoryMetrics('electronics', products)).toEqual({
      productCount: 2,
      stockUnits: 13,
      inventoryValue: 12104,
    })
  })

  it('explains the stock-status mix inside a category', () => {
    expect(calculateCategoryAnalytics('electronics', products)).toEqual({
      productCount: 2,
      stockUnits: 13,
      inventoryValue: 12104,
      inStockProducts: 1,
      lowStockProducts: 1,
      outOfStockProducts: 0,
    })
  })
})
