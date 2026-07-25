import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material'
import ClearAllRounded from '@mui/icons-material/ClearAllRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'

export default function ProductFilters({ filters, categories, onChange, onClear }) {
  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'repeat(2, minmax(0, 1fr))',
              xl: 'minmax(220px, 1.4fr) repeat(3, minmax(150px, 1fr)) auto',
            },
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            name="search"
            label="Search products"
            placeholder="Name or SKU"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
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
            label="Category"
            value={filters.categoryId}
            onChange={(event) => onChange('categoryId', event.target.value)}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Stock status"
            value={filters.stockStatus}
            onChange={(event) => onChange('stockStatus', event.target.value)}
          >
            <MenuItem value="all">All stock</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Sort by"
            value={filters.sortBy}
            onChange={(event) => onChange('sortBy', event.target.value)}
          >
            <MenuItem value="name-asc">Name A–Z</MenuItem>
            <MenuItem value="name-desc">Name Z–A</MenuItem>
            <MenuItem value="price-asc">Price Low–High</MenuItem>
            <MenuItem value="price-desc">Price High–Low</MenuItem>
            <MenuItem value="stock-asc">Stock Low–High</MenuItem>
            <MenuItem value="stock-desc">Stock High–Low</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </TextField>
          <Button
            variant="text"
            startIcon={<ClearAllRounded />}
            onClick={onClear}
            sx={{
              whiteSpace: 'nowrap',
              justifySelf: { xs: 'start', sm: 'end', xl: 'stretch' },
            }}
          >
            Clear filters
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
