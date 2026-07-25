import { describe, expect, it } from 'vitest'
import { INVENTORY_ACTIONS, inventoryReducer } from './inventoryReducer'

const initialState = {
  products: [],
  categories: [],
  stockHistory: [],
}

describe('inventoryReducer', () => {
  it('adds a product', () => {
    const product = {
      id: 'product-1',
      sku: 'PRD-482910',
      name: 'Wireless Mouse',
      categoryId: 'category-1',
      price: 3500,
      quantity: 10,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    const state = inventoryReducer(initialState, {
      type: INVENTORY_ACTIONS.ADD_PRODUCT,
      payload: product,
    })

    expect(state.products).toEqual([product])
  })

  it('updates stock and records history', () => {
    const product = {
      id: 'product-1',
      sku: 'PRD-482910',
      name: 'Wireless Mouse',
      categoryId: 'category-1',
      price: 3500,
      quantity: 10,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    const historyRecord = {
      id: 'history-1',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      operation: 'decrease',
      quantityChanged: 3,
      previousQuantity: 10,
      newQuantity: 7,
      reason: 'Customer order',
      timestamp: '2026-01-02T00:00:00.000Z',
    }
    const state = inventoryReducer(
      { ...initialState, products: [product] },
      {
        type: INVENTORY_ACTIONS.ADJUST_STOCK,
        payload: {
          productId: product.id,
          operation: 'decrease',
          quantity: 3,
          timestamp: historyRecord.timestamp,
          historyRecord,
        },
      },
    )

    expect(state.products[0].quantity).toBe(7)
    expect(state.stockHistory[0]).toEqual(historyRecord)
  })

  it('bulk-restocks selected products and records one history row per product', () => {
    const products = [
      {
        id: 'product-1',
        quantity: 0,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'product-2',
        quantity: 1,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'product-3',
        quantity: 8,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]
    const timestamp = '2026-01-02T00:00:00.000Z'
    const historyRecords = [
      { id: 'history-1', productId: 'product-1' },
      { id: 'history-2', productId: 'product-2' },
    ]

    const state = inventoryReducer(
      { ...initialState, products },
      {
        type: INVENTORY_ACTIONS.BULK_RESTOCK_PRODUCTS,
        payload: {
          selectedIds: ['product-1', 'product-2'],
          quantity: 5,
          timestamp,
          historyRecords,
        },
      },
    )

    expect(state.products.map(({ quantity }) => quantity)).toEqual([5, 6, 8])
    expect(state.products.slice(0, 2).every(
      ({ updatedAt }) => updatedAt === timestamp,
    )).toBe(true)
    expect(state.stockHistory).toEqual(historyRecords)
  })

  it('bulk-deletes only selected products without deleting history', () => {
    const history = [{ id: 'history-1' }]
    const state = inventoryReducer(
      {
        ...initialState,
        products: [{ id: 'product-1' }, { id: 'product-2' }],
        stockHistory: history,
      },
      {
        type: INVENTORY_ACTIONS.BULK_DELETE_PRODUCTS,
        payload: ['product-1'],
      },
    )

    expect(state.products).toEqual([{ id: 'product-2' }])
    expect(state.stockHistory).toEqual(history)
  })
})
