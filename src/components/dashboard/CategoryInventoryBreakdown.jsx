import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { calculateCategoryAnalytics } from '../../utils/inventoryMetrics'
import { formatCurrency } from '../../utils/currency'
import EmptyState from '../common/EmptyState'

function Metric({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={750} noWrap>
        {value}
      </Typography>
    </Box>
  )
}

export default function CategoryInventoryBreakdown({ categories, products }) {
  const rows = categories
    .map((category) => ({
      ...category,
      ...calculateCategoryAnalytics(category.id, products),
    }))
    .filter((category) => category.productCount > 0)

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Category inventory breakdown</Typography>
        <Typography variant="body2" color="text.secondary">
          See where products, units, value, and stock-health counts come from
        </Typography>

        {rows.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <EmptyState
              title="No category breakdown yet"
              description="Add products to compare category-level inventory."
            />
          </Box>
        ) : (
          <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
            {rows.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'minmax(160px, 1.25fr) repeat(3, minmax(90px, 0.7fr)) minmax(260px, 1.5fr)',
                  },
                  gap: { xs: 1.5, md: 2 },
                  alignItems: 'center',
                  py: 1.75,
                }}
              >
                <Box>
                  <Typography variant="subtitle2">{row.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.productCount}{' '}
                    {row.productCount === 1 ? 'product' : 'products'} in this
                    category
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(3, minmax(0, 1fr))',
                      md: 'repeat(3, minmax(90px, 1fr))',
                    },
                    gridColumn: { md: 'span 3' },
                    gap: 2,
                  }}
                >
                  <Metric label="Products" value={row.productCount} />
                  <Metric
                    label="Stock units"
                    value={row.stockUnits.toLocaleString('en-LK')}
                  />
                  <Metric
                    label="Inventory value"
                    value={formatCurrency(row.inventoryValue)}
                  />
                </Box>

                <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`In Stock ${row.inStockProducts}`}
                  />
                  <Chip
                    size="small"
                    color="warning"
                    variant="outlined"
                    label={`Low ${row.lowStockProducts}`}
                  />
                  <Chip
                    size="small"
                    color="error"
                    variant="outlined"
                    label={`Out ${row.outOfStockProducts}`}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
