import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import TimelineRounded from '@mui/icons-material/TimelineRounded'
import { Link } from 'react-router-dom'
import { formatDateTime } from '../../utils/date'
import EmptyState from '../common/EmptyState'

export default function RecentStockActivity({ history }) {
  const recentHistory = history.slice(0, 5)

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          sx={{
            mb: 1.5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6">Recent stock activity</Typography>
            <Typography variant="body2" color="text.secondary">
              The latest inventory movements
            </Typography>
          </Box>
          {history.length > 0 && (
            <Button
              component={Link}
              to="/stock-history"
              endIcon={<ArrowForwardRounded />}
            >
              View all
            </Button>
          )}
        </Stack>

        {recentHistory.length === 0 ? (
          <EmptyState
            icon={TimelineRounded}
            title="No stock activity yet"
            description="Stock increases and decreases will appear here."
          />
        ) : (
          <Stack divider={<Divider flexItem />}>
            {recentHistory.map((record) => (
              <Stack
                key={record.id}
                direction={{ xs: 'column', sm: 'row' }}
                gap={1.5}
                sx={{
                  py: 1.5,
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Typography variant="subtitle2" noWrap>
                      {record.productName}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={
                        record.operation === 'increase' ? 'success' : 'error'
                      }
                      label={
                        record.operation === 'increase'
                          ? `+${record.quantityChanged}`
                          : `−${record.quantityChanged}`
                      }
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {record.reason}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {formatDateTime(record.timestamp)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
