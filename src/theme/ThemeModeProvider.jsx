import { useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { STORAGE_KEYS } from '../utils/constants'
import { loadThemeMode, writeStoredValue } from '../utils/storage'
import { createAppTheme } from './theme'
import { ThemeModeContext } from './themeModeContext'

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(loadThemeMode)
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const value = useMemo(
    () => ({
      mode,
      toggleMode() {
        setMode((currentMode) => {
          const nextMode = currentMode === 'light' ? 'dark' : 'light'
          writeStoredValue(STORAGE_KEYS.theme, nextMode)
          return nextMode
        })
      },
    }),
    [mode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
