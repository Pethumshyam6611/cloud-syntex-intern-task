import { MAX_STOCK } from './constants'

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
}

export function getStockStatus(quantity) {
  if (quantity === 0) return STOCK_STATUS.OUT_OF_STOCK
  if (quantity <= 5) return STOCK_STATUS.LOW_STOCK
  return STOCK_STATUS.IN_STOCK
}

export function calculateInventoryValue(price, quantity) {
  return Number(price) * Number(quantity)
}

export function calculateAdjustedQuantity(currentQuantity, operation, amount) {
  const quantity = Number(amount)
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive integer.')
  }
  if (operation === 'decrease' && quantity > currentQuantity) {
    throw new Error('Stock cannot be decreased below zero.')
  }
  const newQuantity = operation === 'increase'
    ? currentQuantity + quantity
    : currentQuantity - quantity
  if (newQuantity > MAX_STOCK) {
    throw new Error(
      `Stock quantity cannot exceed ${MAX_STOCK.toLocaleString()}.`,
    )
  }
  return newQuantity
}
