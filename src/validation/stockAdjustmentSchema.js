import * as Yup from 'yup'
import { MAX_ADJUSTMENT, MAX_STOCK } from '../utils/constants'

export function createStockAdjustmentSchema(currentQuantity) {
  return Yup.object({
    operation: Yup.string()
      .oneOf(['increase', 'decrease'], 'Choose an operation.')
      .required('Operation is required.'),
    quantity: Yup.number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value,
      )
      .typeError('Enter a valid quantity.')
      .required('Quantity is required.')
      .integer('Quantity must be a whole number.')
      .positive('Quantity must be greater than zero.')
      .max(
        MAX_ADJUSTMENT,
        `Quantity cannot exceed ${MAX_ADJUSTMENT.toLocaleString()}.`,
      )
      .test(
        'available-stock',
        `Only ${currentQuantity.toLocaleString()} units are available.`,
        function validateAvailableStock(value) {
          if (this.parent.operation !== 'decrease' || value === undefined) {
            return true
          }
          return value <= currentQuantity
        },
      )
      .test(
        'maximum-stock',
        `Resulting stock cannot exceed ${MAX_STOCK.toLocaleString()} units.`,
        function validateMaximumStock(value) {
          if (this.parent.operation !== 'increase' || value === undefined) {
            return true
          }
          return currentQuantity + value <= MAX_STOCK
        },
      ),
    reason: Yup.string()
      .trim()
      .required('Reason is required.')
      .min(3, 'Reason must be at least 3 characters.')
      .max(150, 'Reason cannot exceed 150 characters.'),
  })
}
