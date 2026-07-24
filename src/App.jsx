import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/common/AppLayout'

const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const StockHistoryPage = lazy(() => import('./pages/StockHistoryPage'))

function PageLoader() {
  return (
    <Box
      role="status"
      aria-label="Loading page"
      sx={{ minHeight: 260, display: 'grid', placeItems: 'center' }}
    >
      <CircularProgress size={32} />
    </Box>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/stock-history" element={<StockHistoryPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
