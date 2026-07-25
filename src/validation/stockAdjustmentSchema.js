import * as Yup from 'yup'
import {
  CUSTOM_STOCK_REASON,
  MAX_ADJUSTMENT,
  MAX_STOCK,
  STOCK_ADJUSTMENT_REASONS,
} from '../utils/constants'

const allowedReasons = [
  ...new Set(Object.values(STOCK_ADJUSTMENT_REASONS).flat()),
]

export function createStockAdjustmentSchema(currentQuantity) {
  const availableStockMessage = `Only ${currentQuantity.toLocaleString()} ${
    currentQuantity === 1 ? 'unit is' : 'units are'
  } available.`

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
        availableStockMessage,
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
      .oneOf(allowedReasons, 'Choose a valid reason.')
      .required('Reason is required.'),
    note: Yup.string()
      .trim()
      .max(100, 'Note cannot exceed 100 characters.')
      .when('reason', {
        is: CUSTOM_STOCK_REASON,
        then: (schema) =>
          schema
            .required('Enter a reason for this adjustment.')
            .min(3, 'Reason must be at least 3 characters.'),
      }),
  })
}
