import { getStockStatus, STOCK_STATUS } from './stock'

export function calculateInventoryStats(products, categoryCount) {
  return products.reduce(
    (stats, product) => {
      stats.totalProducts += 1
      stats.totalStockUnits += product.quantity
      stats.totalInventoryValue += product.price * product.quantity

      const status = getStockStatus(product.quantity)
      if (status === STOCK_STATUS.IN_STOCK) stats.inStockProducts += 1
      if (status === STOCK_STATUS.LOW_STOCK) stats.lowStockProducts += 1
      if (status === STOCK_STATUS.OUT_OF_STOCK) stats.outOfStockProducts += 1
      return stats
    },
    {
      totalProducts: 0,
      totalStockUnits: 0,
      totalInventoryValue: 0,
      inStockProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalCategories: categoryCount,
    },
  )
}

export function calculateCategoryMetrics(categoryId, products) {
  const analytics = calculateCategoryAnalytics(categoryId, products)
  return {
    productCount: analytics.productCount,
    stockUnits: analytics.stockUnits,
    inventoryValue: analytics.inventoryValue,
  }
}

export function calculateCategoryAnalytics(categoryId, products) {
  return products.reduce(
    (metrics, product) => {
      if (product.categoryId !== categoryId) return metrics
      metrics.productCount += 1
      metrics.stockUnits += product.quantity
      metrics.inventoryValue += product.price * product.quantity

      const status = getStockStatus(product.quantity)
      if (status === STOCK_STATUS.IN_STOCK) metrics.inStockProducts += 1
      if (status === STOCK_STATUS.LOW_STOCK) metrics.lowStockProducts += 1
      if (status === STOCK_STATUS.OUT_OF_STOCK) {
        metrics.outOfStockProducts += 1
      }
      return metrics
    },
    {
      productCount: 0,
      stockUnits: 0,
      inventoryValue: 0,
      inStockProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
    },
  )
}
