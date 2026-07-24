import { useContext } from 'react'
import { ThemeModeContext } from '../theme/themeModeContext'

export function useThemeMode() {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider.')
  }
  return context
}
