import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import ClearAllRounded from '@mui/icons-material/ClearAllRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'

export default function StockHistoryFilters({
  search,
  operation,
  onSearchChange,
  onOperationChange,
  onClear,
}) {
  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            label="Search history"
            placeholder="Product name or SKU"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            fullWidth
            label="Operation"
            value={operation}
            onChange={(event) => onOperationChange(event.target.value)}
            sx={{ maxWidth: { sm: 220 } }}
          >
            <MenuItem value="all">All operations</MenuItem>
            <MenuItem value="increase">Increase</MenuItem>
            <MenuItem value="decrease">Decrease</MenuItem>
          </TextField>
          <Button
            startIcon={<ClearAllRounded />}
            onClick={onClear}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Clear filters
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
