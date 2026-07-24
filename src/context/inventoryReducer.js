import { calculateAdjustedQuantity } from '../utils/stock'

export const INVENTORY_ACTIONS = {
  INITIALIZE_DATA: 'INITIALIZE_DATA',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADJUST_STOCK: 'ADJUST_STOCK',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  BULK_DELETE_PRODUCTS: 'BULK_DELETE_PRODUCTS',
  BULK_RESTOCK_PRODUCTS: 'BULK_RESTOCK_PRODUCTS',
  CLEAR_STOCK_HISTORY: 'CLEAR_STOCK_HISTORY',
  LOAD_DEMO_DATA: 'LOAD_DEMO_DATA',
}

export function inventoryReducer(state, action) {
  switch (action.type) {
    case INVENTORY_ACTIONS.INITIALIZE_DATA:
      return action.payload
    case INVENTORY_ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] }
    case INVENTORY_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        ),
      }
    case INVENTORY_ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload,
        ),
      }
    case INVENTORY_ACTIONS.ADJUST_STOCK: {
      const { productId, operation, quantity, historyRecord, timestamp } =
        action.payload
      return {
        ...state,
        products: state.products.map((product) => {
          if (product.id !== productId) return product
          return {
            ...product,
            quantity: calculateAdjustedQuantity(
              product.quantity,
              operation,
              quantity,
            ),
            updatedAt: timestamp,
          }
        }),
        stockHistory: [historyRecord, ...state.stockHistory],
      }
    }
    case INVENTORY_ACTIONS.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] }
    case INVENTORY_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload,
        ),
      }
    case INVENTORY_ACTIONS.BULK_DELETE_PRODUCTS: {
      const selectedIds = new Set(action.payload)
      return {
        ...state,
        products: state.products.filter(
          (product) => !selectedIds.has(product.id),
        ),
      }
    }
    case INVENTORY_ACTIONS.BULK_RESTOCK_PRODUCTS: {
      const { selectedIds, quantity, timestamp, historyRecords } = action.payload
      const idSet = new Set(selectedIds)
      return {
        ...state,
        products: state.products.map((product) =>
          idSet.has(product.id)
            ? {
                ...product,
                quantity: product.quantity + quantity,
                updatedAt: timestamp,
              }
            : product,
        ),
        stockHistory: [...historyRecords, ...state.stockHistory],
      }
    }
    case INVENTORY_ACTIONS.CLEAR_STOCK_HISTORY:
      return { ...state, stockHistory: [] }
    case INVENTORY_ACTIONS.LOAD_DEMO_DATA:
      return {
        ...state,
        products: action.payload.products,
        stockHistory: action.payload.stockHistory,
      }
    default:
      return state
  }
}
