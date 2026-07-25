import { Box, Button, Typography } from '@mui/material'
import CategoryRounded from '@mui/icons-material/CategoryRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import Inventory2Rounded from '@mui/icons-material/Inventory2Rounded'
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded'
import ProductionQuantityLimitsRounded from '@mui/icons-material/ProductionQuantityLimitsRounded'
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded'
import { Link } from 'react-router-dom'
import CategoryDistributionChart from '../components/dashboard/CategoryDistributionChart'
import CategoryInventoryBreakdown from '../components/dashboard/CategoryInventoryBreakdown'
import RecentStockActivity from '../components/dashboard/RecentStockActivity'
import StockStatusChart from '../components/dashboard/StockStatusChart'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import { useInventory } from '../hooks/useInventory'
import { formatCurrency } from '../utils/currency'

export default function DashboardPage() {
  const { categories, products, stockHistory, stats } = useInventory()
  const activeCategoryCount = new Set(
    products.map((product) => product.categoryId),
  ).size
  const emptyCategoryCount = Math.max(
    0,
    stats.totalCategories - activeCategoryCount,
  )
  const percentageOfProducts = (count) =>
    stats.totalProducts === 0
      ? 0
      : Math.round((count / stats.totalProducts) * 100)
  const averageStock =
    stats.totalProducts === 0
      ? 0
      : Math.round(stats.totalStockUnits / stats.totalProducts)

  const inventoryCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts.toLocaleString('en-LK'),
      helper: `${activeCategoryCount} active ${
        activeCategoryCount === 1 ? 'category' : 'categories'
      }`,
      icon: Inventory2Rounded,
      color: 'primary',
    },
    {
      label: 'Stock Units',
      value: stats.totalStockUnits.toLocaleString('en-LK'),
      helper: `${averageStock.toLocaleString('en-LK')} units per product on average`,
      icon: ProductionQuantityLimitsRounded,
      color: 'secondary',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(stats.totalInventoryValue),
      helper: 'Current value of all on-hand stock',
      icon: MonetizationOnRounded,
      color: 'primary',
    },
  ]

  const healthCards = [
    {
      label: 'In Stock',
      value: stats.inStockProducts,
      helper:
        stats.totalProducts === 0
          ? 'No products to evaluate'
          : stats.inStockProducts === 0
          ? 'No products are fully stocked'
          : `${percentageOfProducts(stats.inStockProducts)}% of catalog available`,
      progress: percentageOfProducts(stats.inStockProducts),
      icon: CheckCircleRounded,
      color: 'success',
      compact: true,
    },
    {
      label: 'Low Stock',
      value: stats.lowStockProducts,
      helper:
        stats.totalProducts === 0
          ? 'No products to evaluate'
          : stats.lowStockProducts === 0
          ? 'No products need restocking'
          : `${percentageOfProducts(stats.lowStockProducts)}% needs attention`,
      progress: percentageOfProducts(stats.lowStockProducts),
      icon: WarningAmberRounded,
      color: 'warning',
      compact: true,
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockProducts,
      helper:
        stats.totalProducts === 0
          ? 'No products to evaluate'
          : stats.outOfStockProducts === 0
          ? 'Everything is currently available'
          : `${percentageOfProducts(stats.outOfStockProducts)}% unavailable`,
      progress: percentageOfProducts(stats.outOfStockProducts),
      icon: ErrorRounded,
      color: 'error',
      compact: true,
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories,
      helper: `${activeCategoryCount} active · ${emptyCategoryCount} empty`,
      icon: CategoryRounded,
      color: 'secondary',
      compact: true,
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Monitor inventory value, stock health, and recent movement from one clear view."
        actions={
          <Button component={Link} to="/products" variant="contained">
            Manage products
          </Button>
        }
      />

      <Box sx={{ mb: 1.25 }}>
        <Typography variant="h6">Inventory overview</Typography>
        <Typography variant="body2" color="text.secondary">
          Core totals across the complete product catalog
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 2,
          mb: 3,
        }}
      >
        {inventoryCards.map((card, index) => (
          <StatCard
            key={card.label}
            {...card}
            sx={{
              gridColumn: {
                sm: index === 2 ? 'span 2' : 'auto',
                lg: 'auto',
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ mb: 1.25 }}>
        <Typography variant="h6">Stock health</Typography>
        <Typography variant="body2" color="text.secondary">
          Availability, attention items, and category usage
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          mb: 2,
        }}
      >
        {healthCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1.45fr) minmax(340px, 0.85fr)',
          },
          gap: 2,
          mb: 2,
        }}
      >
        <CategoryDistributionChart
          categories={categories}
          products={products}
        />
        <StockStatusChart stats={stats} />
      </Box>

      <CategoryInventoryBreakdown
        categories={categories}
        products={products}
      />

      <RecentStockActivity history={stockHistory} />
    </>
  )
}
