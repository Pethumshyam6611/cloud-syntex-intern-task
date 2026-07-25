import { useEffect, useMemo, useReducer } from 'react'
import { createId } from '../utils/id'
import { loadInventoryState, writeStoredValue } from '../utils/storage'
import { calculateAdjustedQuantity } from '../utils/stock'
import { calculateInventoryStats } from '../utils/inventoryMetrics'
import { MAX_STOCK, STORAGE_KEYS } from '../utils/constants'
import { INVENTORY_ACTIONS, inventoryReducer } from './inventoryReducer'
import { InventoryContext } from './inventoryContextValue'

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(
    inventoryReducer,
    undefined,
    loadInventoryState,
  )

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.products, state.products)
  }, [state.products])

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.categories, state.categories)
  }, [state.categories])

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.stockHistory, state.stockHistory)
  }, [state.stockHistory])

  const actions = useMemo(
    () => ({
      addProduct(values) {
        const timestamp = new Date().toISOString()
        const normalizedSku = values.sku.trim().toUpperCase()
        if (
          state.products.some(
            (product) => product.sku.trim().toUpperCase() === normalizedSku,
          )
        ) {
          throw new Error('This Product ID is already in use.')
        }
        if (
          !state.categories.some(
            (category) => category.id === values.categoryId,
          )
        ) {
          throw new Error('Choose an existing category.')
        }
        const product = {
          id: createId(),
          name: values.name.trim(),
          sku: normalizedSku,
          categoryId: values.categoryId,
          price: Number(values.price),
          quantity: Number(values.quantity),
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        dispatch({ type: INVENTORY_ACTIONS.ADD_PRODUCT, payload: product })
        return product
      },
      updateProduct(id, values) {
        const existingProduct = state.products.find(
          (product) => product.id === id,
        )
        if (!existingProduct) throw new Error('Product could not be found.')
        const normalizedSku = values.sku.trim().toUpperCase()
        if (
          state.products.some(
            (product) =>
              product.id !== id &&
              product.sku.trim().toUpperCase() === normalizedSku,
          )
        ) {
          throw new Error('This Product ID is already in use.')
        }
        if (
          !state.categories.some(
            (category) => category.id === values.categoryId,
          )
        ) {
          throw new Error('Choose an existing category.')
        }
        const product = {
          ...existingProduct,
          name: values.name.trim(),
          sku: normalizedSku,
          categoryId: values.categoryId,
          price: Number(values.price),
          quantity: Number(values.quantity),
          updatedAt: new Date().toISOString(),
        }
        dispatch({ type: INVENTORY_ACTIONS.UPDATE_PRODUCT, payload: product })
        return product
      },
      deleteProduct(id) {
        dispatch({ type: INVENTORY_ACTIONS.DELETE_PRODUCT, payload: id })
      },
      adjustStock(productId, values) {
        const product = state.products.find((item) => item.id === productId)
        if (!product) throw new Error('Product could not be found.')
        const quantity = Number(values.quantity)
        const newQuantity = calculateAdjustedQuantity(
          product.quantity,
          values.operation,
          quantity,
        )
        const timestamp = new Date().toISOString()
        const historyRecord = {
          id: createId(),
          productId,
          productName: product.name,
          sku: product.sku,
          operation: values.operation,
          quantityChanged: quantity,
          previousQuantity: product.quantity,
          newQuantity,
          reason: values.reason.trim(),
          timestamp,
        }
        dispatch({
          type: INVENTORY_ACTIONS.ADJUST_STOCK,
          payload: {
            productId,
            operation: values.operation,
            quantity,
            timestamp,
            historyRecord,
          },
        })
        return historyRecord
      },
      addCategory(name) {
        const normalizedName = name.trim().toLowerCase()
        if (
          state.categories.some(
            (category) =>
              category.name.trim().toLowerCase() === normalizedName,
          )
        ) {
          throw new Error('A category with this name already exists.')
        }
        const category = {
          id: createId(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
        }
        dispatch({ type: INVENTORY_ACTIONS.ADD_CATEGORY, payload: category })
        return category
      },
      deleteCategory(id) {
        if (state.categories.length <= 1) {
          throw new Error('At least one category must remain.')
        }
        if (state.products.some((product) => product.categoryId === id)) {
          throw new Error(
            'Reassign products before deleting this category.',
          )
        }
        dispatch({ type: INVENTORY_ACTIONS.DELETE_CATEGORY, payload: id })
      },
      bulkDeleteProducts(ids) {
        dispatch({
          type: INVENTORY_ACTIONS.BULK_DELETE_PRODUCTS,
          payload: ids,
        })
      },
      bulkRestockProducts(ids, quantity) {
        const amount = Number(quantity)
        if (!Number.isInteger(amount) || amount <= 0) {
          throw new Error('Quantity must be a positive integer.')
        }
        const timestamp = new Date().toISOString()
        const selectedIds = new Set(ids)
        const exceedsMaximum = state.products.some(
          (product) =>
            selectedIds.has(product.id) &&
            product.quantity + amount > MAX_STOCK,
        )
        if (exceedsMaximum) {
          throw new Error(
            `Restock would exceed the ${MAX_STOCK.toLocaleString()} unit limit.`,
          )
        }
        const historyRecords = state.products
          .filter((product) => selectedIds.has(product.id))
          .map((product) => ({
            id: createId(),
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            operation: 'increase',
            quantityChanged: amount,
            previousQuantity: product.quantity,
            newQuantity: product.quantity + amount,
            reason: 'Bulk restock',
            timestamp,
          }))
        dispatch({
          type: INVENTORY_ACTIONS.BULK_RESTOCK_PRODUCTS,
          payload: {
            selectedIds: ids,
            quantity: amount,
            timestamp,
            historyRecords,
          },
        })
        return historyRecords.length
      },
      clearStockHistory() {
        dispatch({ type: INVENTORY_ACTIONS.CLEAR_STOCK_HISTORY })
      },
    }),
    [state.categories, state.products],
  )

  const stats = useMemo(
    () => calculateInventoryStats(state.products, state.categories.length),
    [state.categories.length, state.products],
  )

  const value = useMemo(
    () => ({ ...state, ...actions, stats }),
    [actions, state, stats],
  )

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}
