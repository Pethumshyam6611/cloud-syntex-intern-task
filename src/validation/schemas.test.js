import { describe, expect, it } from 'vitest'
import { createCategorySchema } from './categorySchema'
import { createProductSchema } from './productSchema'
import { createStockAdjustmentSchema } from './stockAdjustmentSchema'

const categories = [
  { id: 'category-1', name: 'Electronics', createdAt: new Date().toISOString() },
]

const validProduct = {
  name: 'Wireless Mouse',
  sku: 'PRD-482910',
  categoryId: 'category-1',
  price: 3500,
  quantity: 12,
}

describe('product validation', () => {
  const schema = createProductSchema({ products: [], categories })

  it('rejects invalid price', async () => {
    await expect(
      schema.validate({ ...validProduct, price: 0 }),
    ).rejects.toThrow('Price must be greater than zero.')
  })

  it('rejects decimal and negative stock quantities', async () => {
    await expect(
      schema.validate({ ...validProduct, quantity: 1.5 }),
    ).rejects.toThrow('Stock quantity must be a whole number.')
    await expect(
      schema.validate({ ...validProduct, quantity: -1 }),
    ).rejects.toThrow('Stock quantity cannot be negative.')
  })

  it('rejects duplicate SKUs case-insensitively but permits the edited product', async () => {
    const products = [{ id: 'product-1', sku: 'AUDIT-001' }]
    await expect(
      createProductSchema({ products, categories }).validate({
        ...validProduct,
        sku: 'audit-001',
      }),
    ).rejects.toThrow('This Product ID is already in use.')

    await expect(
      createProductSchema({
        products,
        categories,
        editingId: 'product-1',
      }).validate({ ...validProduct, sku: 'audit-001' }),
    ).resolves.toMatchObject({ sku: 'audit-001' })
  })
})

describe('category validation', () => {
  it('rejects an empty category name', async () => {
    await expect(
      createCategorySchema(categories).validate({ name: '   ' }),
    ).rejects.toThrow('Category name is required.')
  })

  it('rejects duplicate category names case-insensitively', async () => {
    await expect(
      createCategorySchema(categories).validate({ name: ' electronics ' }),
    ).rejects.toThrow('A category with this name already exists.')
  })
})

describe('stock adjustment validation', () => {
  it('prevents decreasing stock below zero', async () => {
    await expect(
      createStockAdjustmentSchema(1).validate({
        operation: 'decrease',
        quantity: 2,
        reason: 'Customer sale',
        note: '',
      }),
    ).rejects.toThrow('Only 1 unit is available.')
  })

  it('requires details when the custom reason is selected', async () => {
    await expect(
      createStockAdjustmentSchema(5).validate({
        operation: 'increase',
        quantity: 2,
        reason: 'Other',
        note: '',
      }),
    ).rejects.toThrow('Enter a reason for this adjustment.')
  })
})
