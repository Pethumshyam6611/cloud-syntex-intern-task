export function generateUniqueSku(products, random = Math.random) {
  const existingSkus = new Set(
    products.map((product) => product.sku.toLowerCase()),
  )

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const digits = Math.floor(random() * 1_000_000)
      .toString()
      .padStart(6, '0')
    const sku = `PRD-${digits}`
    if (!existingSkus.has(sku.toLowerCase())) return sku
  }

  const startingNumber = Date.now() % 1_000_000
  for (let offset = 0; offset < 1_000_000; offset += 1) {
    const digits = ((startingNumber + offset) % 1_000_000)
      .toString()
      .padStart(6, '0')
    const sku = `PRD-${digits}`
    if (!existingSkus.has(sku.toLowerCase())) return sku
  }

  throw new Error('No unique Product IDs are available.')
}
