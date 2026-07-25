import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatDateTime } from '../../utils/date'

function OperationChip({ record }) {
  const increasing = record.operation === 'increase'
  return (
    <Chip
      size="small"
      variant="outlined"
      color={increasing ? 'success' : 'error'}
      label={`${increasing ? '+' : '−'}${record.quantityChanged}`}
    />
  )
}

export default function StockHistoryList({ history }) {
  return (
    <>
      <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table aria-label="Stock history">
          <TableHead>
            <TableRow>
              <TableCell>Date and time</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell align="right">Previous</TableCell>
              <TableCell align="right">New</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {formatDateTime(record.timestamp)}
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    {record.productName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {record.sku}
                  </Typography>
                </TableCell>
                <TableCell>
                  <OperationChip record={record} />
                </TableCell>
                <TableCell align="right">{record.previousQuantity}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700}>{record.newQuantity}</Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2">{record.reason}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={1.5} sx={{ display: { md: 'none' }, p: 1.5 }}>
        {history.map((record) => (
          <Card key={record.id} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                gap={1}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={750} noWrap>
                    {record.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.sku}
                  </Typography>
                </Box>
                <OperationChip record={record} />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                {record.reason}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {record.previousQuantity} → {record.newQuantity}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Recorded
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(record.timestamp)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </>
  )
}
