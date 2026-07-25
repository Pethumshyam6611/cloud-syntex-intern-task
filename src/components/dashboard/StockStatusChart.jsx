import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import EmptyState from '../common/EmptyState'

export default function StockStatusChart({ stats }) {
  const theme = useTheme()
  const totalProducts = stats.totalProducts
  const allStatuses = [
    {
      name: 'In Stock',
      value: stats.inStockProducts,
      color: theme.palette.success.main,
    },
    {
      name: 'Low Stock',
      value: stats.lowStockProducts,
      color: theme.palette.warning.main,
    },
    {
      name: 'Out of Stock',
      value: stats.outOfStockProducts,
      color: theme.palette.error.main,
    },
  ]
  const data = allStatuses.filter((item) => item.value > 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6">Stock health</Typography>
        <Typography variant="body2" color="text.secondary">
          Product availability with exact counts and percentages
        </Typography>
        {data.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <EmptyState
              title="No stock data yet"
              description="Stock health appears after products are added."
            />
          </Box>
        ) : (
          <Stack
            role="img"
            aria-label="Donut chart showing product stock status"
            sx={{ mt: 2 }}
          >
            <Box sx={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={4}
                    isAnimationActive={false}
                  >
                    {data.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} product${value === 1 ? '' : 's'} (${Math.round(
                        (value / totalProducts) * 100,
                      )}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: theme.palette.divider,
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    }}
                  />
                  <text
                    x="50%"
                    y="47%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme.palette.text.primary}
                    fontSize="24"
                    fontWeight="750"
                  >
                    {totalProducts}
                  </text>
                  <text
                    x="50%"
                    y="57%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme.palette.text.secondary}
                    fontSize="12"
                  >
                    products
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1}>
              {allStatuses.map((item) => {
                const percentage =
                  totalProducts === 0
                    ? 0
                    : Math.round((item.value / totalProducts) * 100)
                return (
                  <Stack
                    key={item.name}
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: item.color,
                        }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={750}>
                      {item.value} · {percentage}%
                    </Typography>
                  </Stack>
                )
              })}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
