import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

export default function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  color,
  progress,
  compact = false,
  sx,
}) {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 4,
          bgcolor: theme.palette[color].main,
        })}
      />
      <CardContent sx={{ p: compact ? 2 : 2.5, pl: compact ? 2.25 : 2.75 }}>
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: 'center' }}
        >
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: compact ? 38 : 42,
              height: compact ? 38 : 42,
              bgcolor: alpha(theme.palette[color].main, 0.12),
              color: theme.palette[color].main,
            })}
          >
            <Icon fontSize="small" />
          </Avatar>
          <Typography
            variant={compact ? 'body2' : 'subtitle2'}
            color="text.secondary"
            fontWeight={700}
          >
            {label}
          </Typography>
        </Stack>

        <Typography
          variant={compact ? 'h4' : 'h3'}
          component="p"
          sx={{
            mt: compact ? 1.5 : 2,
            fontSize: compact
              ? { xs: '1.6rem', md: '1.8rem' }
              : { xs: '1.75rem', md: '2rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            overflowWrap: 'anywhere',
          }}
        >
          {value}
        </Typography>

        {helper && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, minHeight: compact ? 40 : 20 }}
          >
            {helper}
          </Typography>
        )}

        {typeof progress === 'number' && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, progress))}
            color={color}
            aria-label={`${label}: ${Math.round(progress)}% of products`}
            sx={{
              mt: 1.5,
              height: 6,
              borderRadius: 999,
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
