import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded'
import { Form, Formik } from 'formik'
import toast from 'react-hot-toast'
import { useInventory } from '../../hooks/useInventory'
import { generateUniqueSku } from '../../utils/sku'
import { createProductSchema } from '../../validation/productSchema'

export default function ProductFormDialog({
  open,
  product,
  initialSku,
  onClose,
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { products, categories, addProduct, updateProduct } = useInventory()
  const isEditing = Boolean(product)
  const initialValues = {
    name: product?.name ?? '',
    sku: product?.sku ?? initialSku,
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    price: product?.price ?? '',
    quantity: product?.quantity ?? '',
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEditing ? 'Edit product' : 'Add product'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={createProductSchema({
          products,
          categories,
          editingId: product?.id,
        })}
        onSubmit={async (values, helpers) => {
          try {
            if (isEditing) {
              updateProduct(product.id, values)
              toast.success(`${values.name.trim()} was updated.`)
            } else {
              addProduct(values)
              toast.success(`${values.name.trim()} was added.`)
            }
            helpers.resetForm()
            onClose()
          } catch (error) {
            toast.error(error.message || 'The product could not be saved.')
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
          setFieldValue,
          isSubmitting,
        }) => (
          <Form noValidate>
            <DialogContent dividers>
              <Stack spacing={2.25}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Product name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
                <TextField
                  required
                  fullWidth
                  name="sku"
                  label="Product ID / SKU"
                  value={values.sku}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.sku && Boolean(errors.sku)}
                  helperText={
                    (touched.sku && errors.sku) ||
                    'Letters, numbers, and hyphens only.'
                  }
                  slotProps={{
                    htmlInput: { maxLength: 30 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            startIcon={<AutoAwesomeRounded />}
                            onClick={() =>
                              setFieldValue('sku', generateUniqueSku(products))
                            }
                          >
                            Generate
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  required
                  select
                  fullWidth
                  name="categoryId"
                  label="Category"
                  value={values.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.categoryId && Boolean(errors.categoryId)}
                  helperText={touched.categoryId && errors.categoryId}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    required
                    fullWidth
                    name="price"
                    label="Price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">LKR</InputAdornment>
                        ),
                      },
                      htmlInput: { min: 0, step: '0.01' },
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="quantity"
                    label="Stock quantity"
                    type="number"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isEditing}
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={
                      isEditing
                        ? 'Use Adjust Stock to keep a complete history.'
                        : touched.quantity && errors.quantity
                    }
                    slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving…'
                  : isEditing
                    ? 'Save changes'
                    : 'Add product'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
