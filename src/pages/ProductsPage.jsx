import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'
import InventoryRounded from '@mui/icons-material/InventoryRounded'
import RestartAltRounded from '@mui/icons-material/RestartAltRounded'
import toast from 'react-hot-toast'
import BulkRestockDialog from '../components/products/BulkRestockDialog'
import ProductCardList from '../components/products/ProductCardList'
import ProductFilters from '../components/products/ProductFilters'
import ProductFormDialog from '../components/products/ProductFormDialog'
import ProductTable from '../components/products/ProductTable'
import StockAdjustmentDialog from '../components/products/StockAdjustmentDialog'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import { useInventory } from '../hooks/useInventory'
import { downloadProductsCsv } from '../utils/csv'
import { generateUniqueSku } from '../utils/sku'
import { getStockStatus } from '../utils/stock'

const sortFunctions = {
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'stock-asc': (a, b) => a.quantity - b.quantity,
  'stock-desc': (a, b) => b.quantity - a.quantity,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
}

const defaultProductFilters = {
  search: '',
  categoryId: 'all',
  stockStatus: 'all',
  sortBy: 'newest',
}

export default function ProductsPage() {
  const { products, categories, deleteProduct, bulkDeleteProducts } =
    useInventory()
  const [filters, setFilters] = useState(defaultProductFilters)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [formState, setFormState] = useState({
    open: false,
    product: null,
    initialSku: '',
  })
  const [stockProduct, setStockProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkRestockOpen, setBulkRestockOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()
    return [...products]
      .filter((product) => {
        const matchesSearch =
          normalizedSearch === '' ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.sku.toLowerCase().includes(normalizedSearch)
        const matchesCategory =
          filters.categoryId === 'all' ||
          product.categoryId === filters.categoryId
        const matchesStatus =
          filters.stockStatus === 'all' ||
          getStockStatus(product.quantity) === filters.stockStatus
        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort(sortFunctions[filters.sortBy])
  }, [filters, products])

  const openAddProduct = () => {
    if (categories.length === 0) {
      toast.error('Create a category before adding a product.')
      return
    }
    setFormState({
      open: true,
      product: null,
      initialSku: generateUniqueSku(products),
    })
  }

  const openEditProduct = (product) => {
    setFormState({ open: true, product, initialSku: product.sku })
  }

  const toggleSelected = (id) => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(id)) nextIds.delete(id)
      else nextIds.add(id)
      return nextIds
    })
  }

  const toggleAllVisible = () => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      const allVisibleSelected = filteredProducts.every((product) =>
        nextIds.has(product.id),
      )
      filteredProducts.forEach((product) => {
        if (allVisibleSelected) nextIds.delete(product.id)
        else nextIds.add(product.id)
      })
      return nextIds
    })
  }

  const confirmSingleDelete = () => {
    deleteProduct(deleteTarget.id)
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(deleteTarget.id)
      return nextIds
    })
    toast.success(`${deleteTarget.name} was deleted.`)
    setDeleteTarget(null)
  }

  const confirmBulkDelete = () => {
    const ids = [...selectedIds]
    bulkDeleteProducts(ids)
    toast.success(
      `${ids.length} ${ids.length === 1 ? 'product' : 'products'} deleted.`,
    )
    setSelectedIds(new Set())
    setBulkDeleteOpen(false)
  }

  const exportProducts = () => {
    downloadProductsCsv(filteredProducts, categories)
    toast.success(
      `${filteredProducts.length} ${
        filteredProducts.length === 1 ? 'product' : 'products'
      } exported.`,
    )
  }

  const selectedCount = selectedIds.size
  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIds.has(product.id))

  return (
    <>
      <PageHeader
        title="Products"
        description="Search the catalog, make safe stock changes, and export exactly what you see."
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<DownloadRounded />}
              onClick={exportProducts}
              disabled={filteredProducts.length === 0}
            >
              Export filtered CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={openAddProduct}
            >
              Add product
            </Button>
          </>
        }
      />

      {products.length > 0 && (
        <ProductFilters
          filters={filters}
          categories={categories}
          onChange={(name, value) =>
            setFilters((currentFilters) => ({
              ...currentFilters,
              [name]: value,
            }))
          }
          onClear={() => setFilters(defaultProductFilters)}
        />
      )}

      <Card>
        <CardContent sx={{ px: { xs: 2, sm: 2.5 }, py: 1.75 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={1.5}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={750}>
                Inventory catalog
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} of {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'} shown
              </Typography>
            </Box>
            {selectedCount > 0 && (
              <Stack
                direction="row"
                gap={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              >
                <Typography variant="body2" color="primary.main" fontWeight={700}>
                  {selectedCount} selected
                </Typography>
                <Button
                  size="small"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RestartAltRounded />}
                  onClick={() => setBulkRestockOpen(true)}
                >
                  Restock
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRounded />}
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Stack>
          {filteredProducts.length > 0 && (
            <Button
              size="small"
              onClick={toggleAllVisible}
              sx={{ display: { md: 'none' }, mt: 1 }}
            >
              {allVisibleSelected ? 'Clear visible selection' : 'Select all visible'}
            </Button>
          )}
        </CardContent>
        <Divider />

        {products.length === 0 ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <EmptyState
              title="Your inventory is ready for its first product"
              description="Add your first product to start tracking inventory and stock activity."
              actionLabel="Add product"
              onAction={openAddProduct}
            />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <EmptyState
              icon={InventoryRounded}
              title="No products found"
              description="Try changing your search or filter options."
              actionLabel="Clear filters"
              onAction={() => setFilters(defaultProductFilters)}
            />
          </Box>
        ) : (
          <>
            <ProductTable
              products={filteredProducts}
              categories={categories}
              selectedIds={selectedIds}
              onToggle={toggleSelected}
              onToggleAll={toggleAllVisible}
              onEdit={openEditProduct}
              onAdjust={setStockProduct}
              onDelete={setDeleteTarget}
            />
            <Box sx={{ p: 1.5 }}>
              <ProductCardList
                products={filteredProducts}
                categories={categories}
                selectedIds={selectedIds}
                onToggle={toggleSelected}
                onEdit={openEditProduct}
                onAdjust={setStockProduct}
                onDelete={setDeleteTarget}
              />
            </Box>
          </>
        )}
      </Card>

      <ProductFormDialog
        open={formState.open}
        product={formState.product}
        initialSku={formState.initialSku}
        onClose={() =>
          setFormState({ open: false, product: null, initialSku: '' })
        }
      />
      <StockAdjustmentDialog
        open={Boolean(stockProduct)}
        product={stockProduct}
        onClose={() => setStockProduct(null)}
      />
      <BulkRestockDialog
        open={bulkRestockOpen}
        selectedIds={[...selectedIds]}
        onClose={() => setBulkRestockOpen(false)}
        onComplete={() => {
          setBulkRestockOpen(false)
          setSelectedIds(new Set())
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        description={
          deleteTarget
            ? `${deleteTarget.name} will be permanently removed. Existing stock history will be preserved. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete product"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmSingleDelete}
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Delete ${selectedCount} ${
          selectedCount === 1 ? 'product' : 'products'
        }?`}
        description="The selected products will be permanently removed. Their existing stock history will remain available."
        confirmLabel="Delete selected"
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
      />
    </>
  )
}
