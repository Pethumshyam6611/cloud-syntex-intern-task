import { useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CategoryRounded from '@mui/icons-material/CategoryRounded'
import DarkModeRounded from '@mui/icons-material/DarkModeRounded'
import DashboardRounded from '@mui/icons-material/DashboardRounded'
import Inventory2Rounded from '@mui/icons-material/Inventory2Rounded'
import LightModeRounded from '@mui/icons-material/LightModeRounded'
import MenuRounded from '@mui/icons-material/MenuRounded'
import TimelineRounded from '@mui/icons-material/TimelineRounded'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useThemeMode } from '../../hooks/useThemeMode'

const drawerWidth = 268
const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardRounded },
  { label: 'Products', path: '/products', icon: Inventory2Rounded },
  { label: 'Categories', path: '/categories', icon: CategoryRounded },
  { label: 'Stock History', path: '/stock-history', icon: TimelineRounded },
]

function Navigation({ onNavigate }) {
  return (
    <Box sx={{ px: 2, py: 2.5 }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ px: 1, mb: 4, alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Inventory2Rounded />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>
            Stockwise
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Inventory control
          </Typography>
        </Box>
      </Stack>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 1.5, letterSpacing: '0.12em' }}
      >
        Workspace
      </Typography>
      <List sx={{ mt: 0.75 }}>
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            onClick={onNavigate}
            sx={{
              mb: 0.5,
              borderRadius: 2.5,
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
                bgcolor: 'action.selected',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { fontWeight: 700, fontSize: 14 } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const { mode, toggleMode } = useThemeMode()
  const location = useLocation()
  const currentPage = useMemo(
    () =>
      navigationItems.find((item) => location.pathname.startsWith(item.path))
        ?.label ?? 'Inventory',
    [location.pathname],
  )

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }}>
          {!isDesktop && (
            <Tooltip title="Open navigation">
              <IconButton
                edge="start"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuRounded />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Inventory Management System
            </Typography>
            <Typography variant="h6" component="p" sx={{ lineHeight: 1.25 }}>
              {currentPage}
            </Typography>
          </Box>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
              onClick={toggleMode}
            >
              {mode === 'light' ? <DarkModeRounded /> : <LightModeRounded />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        aria-label="Primary navigation"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
        >
          <Navigation onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          pt: { xs: '88px', md: '104px' },
          px: { xs: 2, sm: 3, lg: 4 },
          pb: 5,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1480, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
