import { DEFAULT_CATEGORY_NAMES, STORAGE_KEYS } from './constants'
import { createId } from './id'

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidTimestamp(value) {
  return (
    isNonEmptyString(value) &&
    Number.isFinite(Date.parse(value))
  )
}

function isCategory(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isValidTimestamp(value.createdAt)
  )
}

function isProduct(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.sku) &&
    isNonEmptyString(value.categoryId) &&
    Number.isFinite(value.price) &&
    value.price > 0 &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 0 &&
    isValidTimestamp(value.createdAt) &&
    isValidTimestamp(value.updatedAt)
  )
}

function isStockHistoryRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.productId) &&
    isNonEmptyString(value.productName) &&
    isNonEmptyString(value.sku) &&
    ['increase', 'decrease'].includes(value.operation) &&
    Number.isInteger(value.quantityChanged) &&
    value.quantityChanged > 0 &&
    Number.isInteger(value.previousQuantity) &&
    value.previousQuantity >= 0 &&
    Number.isInteger(value.newQuantity) &&
    value.newQuantity >= 0 &&
    isNonEmptyString(value.reason) &&
    isValidTimestamp(value.timestamp)
  )
}

function readStoredArray(key, fallback, isValidEntry) {
  if (typeof window === 'undefined') return fallback

  try {
    const rawValue = window.localStorage.getItem(key)
    if (rawValue === null) return fallback
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue)
      ? parsedValue.filter(isValidEntry)
      : fallback
  } catch {
    return fallback
  }
}

export function writeStoredValue(key, value) {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function createDefaultCategories() {
  const timestamp = new Date().toISOString()
  return DEFAULT_CATEGORY_NAMES.map((name) => ({
    id: createId(),
    name,
    createdAt: timestamp,
  }))
}

export function loadInventoryState() {
  return {
    products: readStoredArray(STORAGE_KEYS.products, [], isProduct),
    categories: readStoredArray(
      STORAGE_KEYS.categories,
      createDefaultCategories(),
      isCategory,
    ),
    stockHistory: readStoredArray(
      STORAGE_KEYS.stockHistory,
      [],
      isStockHistoryRecord,
    ),
  }
}

export function loadThemeMode() {
  if (typeof window === 'undefined') return 'light'

  try {
    const storedMode = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (storedMode === null) return 'light'
    const parsedMode = JSON.parse(storedMode)
    return parsedMode === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}
