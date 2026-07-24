import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlined from '@mui/icons-material/EditOutlined'
import SyncAltRounded from '@mui/icons-material/SyncAltRounded'
import StockStatusChip from '../common/StockStatusChip'
import { formatCurrency } from '../../utils/currency'

export default function ProductCardList({
  products,
  categories,
  selectedIds,
  onToggle,
  onEdit,
  onAdjust,
  onDelete,
}) {
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  )

  return (
    <Stack spacing={1.5} sx={{ display: { md: 'none' } }}>
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'flex-start' }}
            >
              <Checkbox
                edge="start"
                aria-label={`Select ${product.name}`}
                checked={selectedIds.has(product.id)}
                onChange={() => onToggle(product.id)}
              />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  gap={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={750} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.sku}
                    </Typography>
                  </Box>
                  <StockStatusChip quantity={product.quantity} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {categoryNames.get(product.categoryId) ?? 'Unknown category'}
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              sx={{ mt: 2, mb: 1.75, justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Unit price
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatCurrency(product.price)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  In stock
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {product.quantity}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  Total value
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {formatCurrency(product.price * product.quantity)}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              gap={0.5}
              sx={{ pt: 1.25, justifyContent: 'flex-end', flexWrap: 'wrap' }}
            >
              <Button
                size="small"
                startIcon={<EditOutlined />}
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button
                size="small"
                startIcon={<SyncAltRounded />}
                onClick={() => onAdjust(product)}
              >
                Stock
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineRounded />}
                onClick={() => onDelete(product)}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
