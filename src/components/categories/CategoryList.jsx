import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import CategoryRounded from '@mui/icons-material/CategoryRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import { formatCurrency } from '../../utils/currency'
import { calculateCategoryMetrics } from '../../utils/inventoryMetrics'

export default function CategoryList({ categories, products, onDelete }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {categories.map((category) => {
        const { productCount, stockUnits, inventoryValue } =
          calculateCategoryMetrics(
            category.id,
            products,
          )
        return (
          <Card key={category.id}>
            <CardContent>
              <Stack
                direction="row"
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{ bgcolor: 'action.selected', color: 'primary.main' }}
                  >
                    <CategoryRounded />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {productCount}{' '}
                      {productCount === 1 ? 'product' : 'products'}
                    </Typography>
                  </Box>
                </Stack>
                <Tooltip title="Delete category">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label={`Delete ${category.name}`}
                    onClick={() =>
                      onDelete({
                        ...category,
                        productCount,
                      })
                    }
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stock units
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={750}>
                    {stockUnits.toLocaleString('en-LK')}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    Inventory value
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={750}>
                    {formatCurrency(inventoryValue)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}
