import { Box, Stack, Typography } from '@mui/material'

export default function PageHeader({ title, description, actions }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        mb: 3,
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'flex-start' },
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 700 }}>
          {description}
        </Typography>
      </Box>
      {actions && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 1,
            rowGap: 1,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            '& .MuiButton-root': {
              flexShrink: 0,
              px: { xs: 1.5, sm: 2 },
            },
          }}
        >
          {actions}
        </Box>
      )}
    </Stack>
  )
}
