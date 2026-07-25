import { formatDateTime } from './date'
import { getStockStatus } from './stock'

export function escapeCsvValue(value) {
  const stringValue = String(value ?? '')
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`
  }
  return stringValue
}

export function createProductsCsv(products, categories) {
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  )
  const rows = products.map((product) => [
    product.name,
    product.sku,
    categoryNames.get(product.categoryId) ?? 'Unknown category',
    product.price.toFixed(2),
    product.quantity,
    getStockStatus(product.quantity),
    (product.price * product.quantity).toFixed(2),
    formatDateTime(product.createdAt),
    formatDateTime(product.updatedAt),
  ])
  const headers = [
    'Product Name',
    'SKU',
    'Category',
    'Price (LKR)',
    'Stock Quantity',
    'Stock Status',
    'Inventory Value (LKR)',
    'Created At',
    'Updated At',
  ]

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n')
}

export function downloadProductsCsv(products, categories) {
  const csv = createProductsCsv(products, categories)
  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
