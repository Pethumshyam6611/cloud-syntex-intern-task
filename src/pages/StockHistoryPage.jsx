import { useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import DeleteSweepRounded from '@mui/icons-material/DeleteSweepRounded'
import TimelineRounded from '@mui/icons-material/TimelineRounded'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import StockHistoryFilters from '../components/history/StockHistoryFilters'
import StockHistoryList from '../components/history/StockHistoryList'
import { useInventory } from '../hooks/useInventory'

export default function StockHistoryPage() {
  const { stockHistory, clearStockHistory } = useInventory()
  const [search, setSearch] = useState('')
  const [operation, setOperation] = useState('all')
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)

  const filteredHistory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return [...stockHistory]
      .filter((record) => {
        const matchesSearch =
          normalizedSearch === '' ||
          record.productName.toLowerCase().includes(normalizedSearch) ||
          record.sku.toLowerCase().includes(normalizedSearch)
        const matchesOperation =
          operation === 'all' || record.operation === operation
        return matchesSearch && matchesOperation
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [operation, search, stockHistory])

  const confirmClearHistory = () => {
    clearStockHistory()
    toast.success('Stock history was cleared.')
    setClearConfirmOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Stock History"
        description="A permanent snapshot of each increase and decrease—even after a product is deleted."
        actions={
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepRounded />}
            disabled={stockHistory.length === 0}
            onClick={() => setClearConfirmOpen(true)}
          >
            Clear history
          </Button>
        }
      />

      {stockHistory.length > 0 && (
        <StockHistoryFilters
          search={search}
          operation={operation}
          onSearchChange={setSearch}
          onOperationChange={setOperation}
          onClear={() => {
            setSearch('')
            setOperation('all')
          }}
        />
      )}

      <Card>
        <CardContent sx={{ py: 1.75 }}>
          <Typography variant="subtitle1" fontWeight={750}>
            Activity log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredHistory.length} of {stockHistory.length}{' '}
            {stockHistory.length === 1 ? 'record' : 'records'} shown
          </Typography>
        </CardContent>
        <Divider />
        {stockHistory.length === 0 ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <EmptyState
              icon={TimelineRounded}
              title="No stock history yet"
              description="Every successful stock adjustment will be recorded here."
            />
          </Box>
        ) : filteredHistory.length === 0 ? (
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <EmptyState
              icon={TimelineRounded}
              title="No history records found"
              description="Try changing your search or operation filter."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch('')
                setOperation('all')
              }}
            />
          </Box>
        ) : (
          <StockHistoryList history={filteredHistory} />
        )}
      </Card>

      <ConfirmDialog
        open={clearConfirmOpen}
        title="Clear all stock history?"
        description="Every stock movement record will be permanently deleted. Product quantities will not change. This cannot be undone."
        confirmLabel="Clear all history"
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={confirmClearHistory}
      />
    </>
  )
}
