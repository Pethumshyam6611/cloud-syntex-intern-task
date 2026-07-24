import {
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlined from '@mui/icons-material/EditOutlined'
import SyncAltRounded from '@mui/icons-material/SyncAltRounded'
import { formatCurrency } from '../../utils/currency'
import StockStatusChip from '../common/StockStatusChip'

export default function ProductTable({
  products,
  categories,
  selectedIds,
  onToggle,
  onToggleAll,
  onEdit,
  onAdjust,
  onDelete,
}) {
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  )
  const selectedVisibleCount = products.filter((product) =>
    selectedIds.has(product.id),
  ).length
  const allVisibleSelected =
    products.length > 0 && selectedVisibleCount === products.length

  return (
    <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
      <Table aria-label="Products">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                aria-label="Select all visible products"
                checked={allVisibleSelected}
                indeterminate={
                  selectedVisibleCount > 0 && !allVisibleSelected
                }
                onChange={onToggleAll}
              />
            </TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Inventory value</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              hover
              selected={selectedIds.has(product.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  aria-label={`Select ${product.name}`}
                  checked={selectedIds.has(product.id)}
                  onChange={() => onToggle(product.id)}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{product.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.sku}
                </Typography>
              </TableCell>
              <TableCell>
                {categoryNames.get(product.categoryId) ?? 'Unknown category'}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={700}>{product.quantity}</Typography>
              </TableCell>
              <TableCell>
                <StockStatusChip quantity={product.quantity} />
              </TableCell>
              <TableCell align="right">
                {formatCurrency(product.price * product.quantity)}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit product">
                    <IconButton
                      size="small"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Adjust stock">
                    <IconButton
                      size="small"
                      aria-label={`Adjust stock for ${product.name}`}
                      onClick={() => onAdjust(product)}
                    >
                      <SyncAltRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete product">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDelete(product)}
                    >
                      <DeleteOutlineRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
