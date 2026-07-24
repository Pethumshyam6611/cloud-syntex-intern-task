import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Form, Formik } from 'formik'
import toast from 'react-hot-toast'
import { useInventory } from '../../hooks/useInventory'
import { createStockAdjustmentSchema } from '../../validation/stockAdjustmentSchema'

export default function StockAdjustmentDialog({ open, product, onClose }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { adjustStock } = useInventory()

  if (!product) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Adjust stock</DialogTitle>
      <Formik
        initialValues={{ operation: 'increase', quantity: '', reason: '' }}
        validationSchema={createStockAdjustmentSchema(product.quantity)}
        onSubmit={async (values, helpers) => {
          try {
            const record = adjustStock(product.id, values)
            toast.success(
              `Stock updated from ${record.previousQuantity} to ${record.newQuantity}.`,
            )
            helpers.resetForm()
            onClose()
          } catch (error) {
            toast.error(error.message || 'Stock could not be updated.')
          } finally {
            helpers.setSubmitting(false)
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form noValidate>
            <DialogContent dividers>
              <Stack spacing={2.25}>
                <Alert severity="info">
                  <Typography variant="subtitle2">{product.name}</Typography>
                  <Typography variant="body2">
                    {product.sku} · Current stock: {product.quantity}
                  </Typography>
                </Alert>
                <TextField
                  required
                  select
                  fullWidth
                  name="operation"
                  label="Operation"
                  value={values.operation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.operation && Boolean(errors.operation)}
                  helperText={touched.operation && errors.operation}
                >
                  <MenuItem value="increase">Increase stock</MenuItem>
                  <MenuItem value="decrease">Decrease stock</MenuItem>
                </TextField>
                <TextField
                  required
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
                <TextField
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  name="reason"
                  label="Reason"
                  placeholder="For example, supplier restock"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.reason && Boolean(errors.reason)}
                  helperText={
                    (touched.reason && errors.reason) ||
                    `${values.reason.length}/150 characters`
                  }
                  slotProps={{ htmlInput: { maxLength: 150 } }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Updating…' : 'Confirm adjustment'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
