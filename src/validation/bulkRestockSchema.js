import * as Yup from 'yup'
import { MAX_ADJUSTMENT } from '../utils/constants'

export const bulkRestockSchema = Yup.object({
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
    ),
})
