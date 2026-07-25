import { createId } from './id'

export function createDemoProducts(categories) {
  const categoryByName = new Map(
    categories.map((category) => [category.name, category.id]),
  )
  const fallbackCategoryId = categories[0]?.id
  const now = Date.now()
  const samples = [
    ['Wireless Mouse', 'PRD-482910', 'Electronics', 3500, 18],
    ['Ergonomic Chair', 'PRD-183742', 'Furniture', 48500, 4],
    ['Classic Cotton Shirt', 'PRD-725604', 'Clothing', 4200, 9],
    ['Ceylon Tea Pack', 'PRD-349118', 'Food & Beverages', 1850, 0],
    ['USB-C Hub', 'PRD-916305', 'Electronics', 8900, 3],
    ['Standing Desk', 'PRD-570264', 'Furniture', 75000, 7],
  ]

  return samples.map(([name, sku, categoryName, price, quantity], index) => {
    const timestamp = new Date(now - index * 86_400_000).toISOString()
    return {
      id: createId(),
      name,
      sku,
      categoryId: categoryByName.get(categoryName) ?? fallbackCategoryId,
      price,
      quantity,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  })
}
