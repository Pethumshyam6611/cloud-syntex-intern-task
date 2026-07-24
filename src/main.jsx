import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { InventoryProvider } from './context/InventoryContext'
import { ThemeModeProvider } from './theme/ThemeModeProvider'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <InventoryProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
        </InventoryProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
