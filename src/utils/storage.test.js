import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from './constants'
import {
  loadInventoryState,
  loadThemeMode,
  writeStoredValue,
} from './storage'

const category = {
  id: 'category-1',
  name: 'Electronics',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const product = {
  id: 'product-1',
  name: 'Wireless Mouse',
  sku: 'PRD-100',
  categoryId: category.id,
  price: 1250.5,
  quantity: 4,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('inventory storage', () => {
  it('loads valid persisted values and writes JSON values', () => {
    expect(writeStoredValue(STORAGE_KEYS.categories, [category])).toBe(true)
    expect(writeStoredValue(STORAGE_KEYS.products, [product])).toBe(true)
    expect(loadInventoryState()).toMatchObject({
      categories: [category],
      products: [product],
      stockHistory: [],
    })
  })

  it('falls back safely when stored JSON is malformed or not an array', () => {
    window.localStorage.setItem(STORAGE_KEYS.products, '{broken')
    window.localStorage.setItem(STORAGE_KEYS.categories, '"not-an-array"')

    const state = loadInventoryState()
    expect(state.products).toEqual([])
    expect(state.categories.map(({ name }) => name)).toEqual([
      'Electronics',
      'Furniture',
      'Clothing',
      'Food & Beverages',
      'Other',
    ])
  })

  it('filters structurally corrupt records from valid arrays', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.products,
      JSON.stringify([null, { ...product, quantity: -1 }, product]),
    )
    window.localStorage.setItem(
      STORAGE_KEYS.categories,
      JSON.stringify([null, { id: '', name: 'Broken' }, category]),
    )
    window.localStorage.setItem(
      STORAGE_KEYS.stockHistory,
      JSON.stringify([null, { id: 'broken' }]),
    )

    expect(loadInventoryState()).toEqual({
      products: [product],
      categories: [category],
      stockHistory: [],
    })
  })
})

describe('theme storage', () => {
  it('persists dark mode and falls back to light for corrupt values', () => {
    writeStoredValue(STORAGE_KEYS.theme, 'dark')
    expect(loadThemeMode()).toBe('dark')

    window.localStorage.setItem(STORAGE_KEYS.theme, '{broken')
    expect(loadThemeMode()).toBe('light')
  })
})
