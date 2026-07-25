import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Form, Formik } from 'formik'
import toast from 'react-hot-toast'
import { useInventory } from '../../hooks/useInventory'
import { bulkRestockSchema } from '../../validation/bulkRestockSchema'

export default function BulkRestockDialog({
  open,
  selectedIds,
  onClose,
  onComplete,
}) {
  const { bulkRestockProducts } = useInventory()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Bulk restock</DialogTitle>
      <Formik
        initialValues={{ quantity: '' }}
        validationSchema={bulkRestockSchema}
        onSubmit={async (values, helpers) => {
          try {
            const count = bulkRestockProducts(selectedIds, values.quantity)
            toast.success(
              `${count} ${count === 1 ? 'product' : 'products'} restocked.`,
            )
            helpers.resetForm()
            onComplete()
          } catch (error) {
            toast.error(error.message || 'Products could not be restocked.')
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
              <Alert severity="info" sx={{ mb: 2 }}>
                The same quantity will be added to {selectedIds.length}{' '}
                {selectedIds.length === 1 ? 'product' : 'products'}. Each change
                will be recorded in stock history.
              </Alert>
              <TextField
                required
                fullWidth
                name="quantity"
                label="Quantity to add"
                type="number"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Restocking…' : 'Restock products'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
