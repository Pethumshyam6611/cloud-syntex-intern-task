import { describe, expect, it } from 'vitest'
import { createProductsCsv, escapeCsvValue } from './csv'

describe('escapeCsvValue', () => {
  it('escapes commas, quotes, and line breaks', () => {
    expect(escapeCsvValue('Mouse, wireless')).toBe('"Mouse, wireless"')
    expect(escapeCsvValue('12" monitor')).toBe('"12"" monitor"')
    expect(escapeCsvValue('Line 1\nLine 2')).toBe('"Line 1\nLine 2"')
  })
})

describe('createProductsCsv', () => {
  it('exports every product field, derived status, and inventory value', () => {
    const timestamp = '2026-01-01T00:00:00.000Z'
    const csv = createProductsCsv(
      [
        {
          id: 'product-1',
          name: 'Mouse, wireless',
          sku: 'AUDIT-001',
          categoryId: 'category-1',
          price: 1200.5,
          quantity: 8,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      [{ id: 'category-1', name: 'Electronics' }],
    )

    const [headers, row] = csv.split('\r\n')
    expect(headers).toBe(
      'Product Name,SKU,Category,Price (LKR),Stock Quantity,Stock Status,Inventory Value (LKR),Created At,Updated At',
    )
    expect(row).toContain('"Mouse, wireless",AUDIT-001,Electronics,1200.50,8,In Stock,9604.00')
  })
})
