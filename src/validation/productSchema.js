import * as Yup from 'yup'
import { MAX_PRICE, MAX_STOCK } from '../utils/constants'

function emptyToUndefined(_value, originalValue) {
  return originalValue === '' ? undefined : _value
}

export function createProductSchema({ products, categories, editingId = null }) {
  return Yup.object({
    name: Yup.string()
      .trim()
      .required('Product name is required.')
      .min(2, 'Product name must be at least 2 characters.')
      .max(100, 'Product name cannot exceed 100 characters.'),
    sku: Yup.string()
      .trim()
      .required('Product ID is required.')
      .min(3, 'Product ID must be at least 3 characters.')
      .max(30, 'Product ID cannot exceed 30 characters.')
      .matches(
        /^[A-Za-z0-9-]+$/,
        'Use only letters, numbers, and hyphens.',
      )
      .test('unique-sku', 'This Product ID is already in use.', (value) => {
        if (!value) return true
        const normalizedSku = value.trim().toLowerCase()
        return !products.some(
          (product) =>
            product.id !== editingId &&
            product.sku.trim().toLowerCase() === normalizedSku,
        )
      }),
    categoryId: Yup.string()
      .required('Category is required.')
      .oneOf(
        categories.map((category) => category.id),
        'Choose an existing category.',
      ),
    price: Yup.number()
      .transform(emptyToUndefined)
      .typeError('Enter a valid price.')
      .required('Price is required.')
      .moreThan(0, 'Price must be greater than zero.')
      .max(MAX_PRICE, `Price cannot exceed ${MAX_PRICE.toLocaleString()}.`)
      .test(
        'two-decimals',
        'Price can have at most two decimal places.',
        (value) =>
          value === undefined ||
          Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
      ),
    quantity: Yup.number()
      .transform(emptyToUndefined)
      .typeError('Enter a valid stock quantity.')
      .required('Stock quantity is required.')
      .integer('Stock quantity must be a whole number.')
      .min(0, 'Stock quantity cannot be negative.')
      .max(MAX_STOCK, `Stock quantity cannot exceed ${MAX_STOCK.toLocaleString()}.`),
  })
}
