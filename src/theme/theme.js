import { alpha, createTheme } from '@mui/material/styles'

export function createAppTheme(mode) {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: '#6d5dfc', light: '#8b7fff', dark: '#5142dc' },
      secondary: { main: '#12a594' },
      background: {
        default: isDark ? '#0c101b' : '#f5f6fb',
        paper: isDark ? '#141a29' : '#ffffff',
      },
      success: { main: '#138a5b' },
      warning: { main: '#d17a00' },
      error: { main: '#c43d4d' },
      divider: isDark ? alpha('#ffffff', 0.1) : alpha('#172033', 0.1),
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 760, letterSpacing: '-0.035em' },
      h2: { fontWeight: 720, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.018em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${
              isDark ? alpha('#ffffff', 0.09) : alpha('#172033', 0.08)
            }`,
            boxShadow: isDark
              ? '0 12px 40px rgba(0,0,0,0.16)'
              : '0 12px 40px rgba(26,32,55,0.06)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 18, backgroundImage: 'none' },
        },
      },
      MuiTextField: { defaultProps: { size: 'small' } },
      MuiFormControl: { defaultProps: { size: 'small' } },
      MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    },
  })
}
