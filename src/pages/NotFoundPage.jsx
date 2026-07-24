import { Button, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Stack
        spacing={2}
        sx={{
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="overline" color="primary.main">
          Error 404
        </Typography>
        <Typography variant="h3" component="h1">
          This page is not in stock
        </Typography>
        <Typography color="text.secondary">
          The address may be incorrect, or the page may have moved.
        </Typography>
        <Button component={Link} to="/dashboard" variant="contained">
          Return to dashboard
        </Button>
      </Stack>
    </Container>
  )
}
