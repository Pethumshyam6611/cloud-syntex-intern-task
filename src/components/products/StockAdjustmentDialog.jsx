import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import RemoveRounded from '@mui/icons-material/RemoveRounded'
import { Form, Formik } from 'formik'
import toast from 'react-hot-toast'
import { useInventory } from '../../hooks/useInventory'
import {
  CUSTOM_STOCK_REASON,
  MAX_ADJUSTMENT,
  MAX_STOCK,
  STOCK_ADJUSTMENT_REASONS,
} from '../../utils/constants'
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
      <DialogTitle>Update stock</DialogTitle>
      <Formik
        initialValues={{
          operation:
            product.quantity >= MAX_STOCK ? 'decrease' : 'increase',
          quantity: '',
          reason: '',
          note: '',
        }}
        validationSchema={createStockAdjustmentSchema(product.quantity)}
        onSubmit={async (values, helpers) => {
          try {
            const note = values.note.trim()
            const reason =
              values.reason === CUSTOM_STOCK_REASON
                ? note
                : `${values.reason}${note ? `: ${note}` : ''}`
            const record = adjustStock(product.id, { ...values, reason })
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
          setFieldTouched,
          setFieldValue,
        }) => {
          const operationIsIncrease = values.operation === 'increase'
          const parsedQuantity = Number(values.quantity)
          const hasValidQuantity =
            values.quantity !== '' &&
            Number.isInteger(parsedQuantity) &&
            parsedQuantity > 0 &&
            parsedQuantity <= MAX_ADJUSTMENT
          const projectedQuantity = operationIsIncrease
            ? product.quantity + parsedQuantity
            : product.quantity - parsedQuantity
          const previewIsSafe =
            hasValidQuantity &&
            projectedQuantity >= 0 &&
            projectedQuantity <= MAX_STOCK
          const maximumAdjustment = operationIsIncrease
            ? Math.min(MAX_ADJUSTMENT, MAX_STOCK - product.quantity)
            : Math.min(MAX_ADJUSTMENT, product.quantity)
          const operationLabel = operationIsIncrease
            ? 'Stock In'
            : 'Stock Out'
          const actionVerb = operationIsIncrease ? 'Add' : 'Remove'
          const quantityLabel = hasValidQuantity
            ? `${parsedQuantity.toLocaleString()} ${
                parsedQuantity === 1 ? 'unit' : 'units'
              }`
            : 'stock'

          const handleOperationChange = (_, operation) => {
            if (!operation) return
            setFieldValue('operation', operation)
            setFieldValue('quantity', '')
            setFieldValue('reason', '')
            setFieldValue('note', '')
          }

          return (
            <Form noValidate>
              <DialogContent dividers>
                <Stack spacing={2.25}>
                  <Alert severity="info">
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Typography variant="body2">
                      {product.sku} | Current stock:{' '}
                      {product.quantity.toLocaleString()} units
                    </Typography>
                  </Alert>

                  <Box>
                    <Typography
                      id="stock-operation-label"
                      variant="body2"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      Choose stock movement
                    </Typography>
                    <ToggleButtonGroup
                      exclusive
                      fullWidth
                      value={values.operation}
                      onChange={handleOperationChange}
                      aria-labelledby="stock-operation-label"
                    >
                      <ToggleButton
                        value="increase"
                        aria-label="Stock in"
                        disabled={product.quantity >= MAX_STOCK}
                        sx={{
                          gap: 0.75,
                          '&.Mui-selected, &.Mui-selected:hover': {
                            bgcolor: 'success.main',
                            color: 'success.contrastText',
                          },
                        }}
                      >
                        <AddRounded fontSize="small" />
                        Stock In
                      </ToggleButton>
                      <ToggleButton
                        value="decrease"
                        aria-label="Stock out"
                        disabled={product.quantity === 0}
                        sx={{
                          gap: 0.75,
                          '&.Mui-selected, &.Mui-selected:hover': {
                            bgcolor: 'warning.main',
                            color: 'warning.contrastText',
                          },
                        }}
                      >
                        <RemoveRounded fontSize="small" />
                        Stock Out
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="flex-start">
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
                      helperText={
                        (touched.quantity && errors.quantity) ||
                        `Up to ${maximumAdjustment.toLocaleString()} units per adjustment`
                      }
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          max: maximumAdjustment,
                          step: 1,
                        },
                      }}
                    />
                    {!operationIsIncrease && (
                      <Button
                        type="button"
                        variant="outlined"
                        sx={{ minWidth: 76, height: 56 }}
                        onClick={() => {
                          setFieldValue('quantity', maximumAdjustment)
                          setFieldTouched('quantity', true, false)
                        }}
                      >
                        Use max
                      </Button>
                    )}
                  </Stack>

                  <Box
                    role="status"
                    aria-live="polite"
                    sx={{
                      border: 1,
                      borderColor:
                        hasValidQuantity && !previewIsSafe
                          ? 'error.main'
                          : 'divider',
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      STOCK PREVIEW
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1.5}
                      sx={{ mt: 0.5 }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                          {product.quantity.toLocaleString()}
                        </Typography>
                      </Box>
                      <ArrowForwardRounded color="action" />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          After {operationLabel.toLowerCase()}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          color={
                            hasValidQuantity && !previewIsSafe
                              ? 'error.main'
                              : operationIsIncrease
                                ? 'success.main'
                                : 'warning.main'
                          }
                        >
                          {hasValidQuantity
                            ? projectedQuantity.toLocaleString()
                            : '--'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <TextField
                    required
                    select
                    fullWidth
                    name="reason"
                    label="Reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reason && Boolean(errors.reason)}
                    helperText={
                      (touched.reason && errors.reason) ||
                      'This reason will appear in stock history.'
                    }
                  >
                    {STOCK_ADJUSTMENT_REASONS[values.operation].map(
                      (reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
                        </MenuItem>
                      ),
                    )}
                  </TextField>

                  <TextField
                    required={values.reason === CUSTOM_STOCK_REASON}
                    fullWidth
                    multiline
                    minRows={2}
                    name="note"
                    label={
                      values.reason === CUSTOM_STOCK_REASON
                        ? 'Reason details'
                        : 'Note (optional)'
                    }
                    placeholder={
                      values.reason === CUSTOM_STOCK_REASON
                        ? 'Explain why the stock is changing'
                        : 'Add any useful details'
                    }
                    value={values.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.note && Boolean(errors.note)}
                    helperText={
                      (touched.note && errors.note) ||
                      `${values.note.length}/100 characters`
                    }
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color={operationIsIncrease ? 'success' : 'warning'}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Updating...'
                    : `${actionVerb} ${quantityLabel}`}
                </Button>
              </DialogActions>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
