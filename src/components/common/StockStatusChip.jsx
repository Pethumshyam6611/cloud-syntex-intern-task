import { Chip } from '@mui/material'
import { getStockStatus } from '../../utils/stock'

const statusColors = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'error',
}

export default function StockStatusChip({ quantity }) {
  const status = getStockStatus(quantity)
  return (
    <Chip
      label={status}
      color={statusColors[status]}
      size="small"
      variant="outlined"
    />
  )
}
