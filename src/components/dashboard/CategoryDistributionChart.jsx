import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../common/EmptyState'
import { calculateCategoryAnalytics } from '../../utils/inventoryMetrics'
import { formatCurrency } from '../../utils/currency'

function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload

  return (
    <Box
      sx={{
        minWidth: 210,
        p: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 4,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {item.name}
      </Typography>
      <Typography variant="body2">{item.products} products</Typography>
      <Typography variant="body2">
        {item.stockUnits.toLocaleString('en-LK')} stock units
      </Typography>
      <Typography variant="body2">
        {formatCurrency(item.inventoryValue)} inventory value
      </Typography>
      <Typography variant="caption" color="text.secondary">
        In Stock {item.inStockProducts} · Low {item.lowStockProducts} · Out{' '}
        {item.outOfStockProducts}
      </Typography>
    </Box>
  )
}

export default function CategoryDistributionChart({ categories, products }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const data = categories
    .map((category) => {
      const analytics = calculateCategoryAnalytics(category.id, products)
      return {
        name: category.name,
        products: analytics.productCount,
        ...analytics,
      }
    })
    .filter((item) => item.products > 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6">Products by category</Typography>
        <Typography variant="body2" color="text.secondary">
          Product count by category; select a bar for stock and value details
        </Typography>
        {data.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <EmptyState
              title="No category data yet"
              description="Add products to see their distribution."
            />
          </Box>
        ) : (
          <Box
            role="img"
            aria-label="Bar chart showing product count by category"
            sx={{
              height: isMobile ? Math.max(280, data.length * 58) : 320,
              mt: 2,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout={isMobile ? 'vertical' : 'horizontal'}
                margin={
                  isMobile
                    ? { top: 8, right: 28, bottom: 8, left: 4 }
                    : { top: 24, right: 8, left: -16 }
                }
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={!isMobile}
                  horizontal={isMobile}
                  stroke={theme.palette.divider}
                />
                {isMobile ? (
                  <>
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={112}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                  </>
                )}
                <Tooltip
                  cursor={{ fill: theme.palette.action.hover }}
                  content={<CategoryTooltip />}
                />
                <Bar
                  dataKey="products"
                  name="Products"
                  fill={theme.palette.primary.main}
                  radius={isMobile ? [2, 8, 8, 2] : [8, 8, 2, 2]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="products"
                    position={isMobile ? 'right' : 'top'}
                    fill={theme.palette.text.primary}
                    fontSize={12}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
