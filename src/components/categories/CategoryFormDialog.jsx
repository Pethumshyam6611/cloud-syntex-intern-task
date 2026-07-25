import {
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
import { createCategorySchema } from '../../validation/categorySchema'

export default function CategoryFormDialog({ open, onClose }) {
  const { categories, addCategory } = useInventory()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add category</DialogTitle>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={createCategorySchema(categories)}
        onSubmit={async (values, helpers) => {
          try {
            addCategory(values.name)
            toast.success(`${values.name.trim()} was created.`)
            helpers.resetForm()
            onClose()
          } catch (error) {
            toast.error(error.message || 'The category could not be created.')
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
              <TextField
                required
                fullWidth
                name="name"
                label="Category name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={
                  (touched.name && errors.name) ||
                  `${values.name.length}/50 characters`
                }
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create category'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
