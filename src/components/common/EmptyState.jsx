import { Box, Button, Typography } from '@mui/material'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inventory2Outlined,
}) {
  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8 },
        px: 2,
        textAlign: 'center',
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 58,
          height: 58,
          display: 'grid',
          placeItems: 'center',
          mx: 'auto',
          mb: 2,
          borderRadius: 3,
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }}
      >
        <Icon />
      </Box>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.75, mb: actionLabel ? 2.5 : 0 }}>
        {description}
      </Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
