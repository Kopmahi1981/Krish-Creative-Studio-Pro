import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import { useThemeStore } from '@/store/useThemeStore'
import '@/index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element "#root" was not found in index.html')
}

// Apply the persisted/initial theme to <html> before render to avoid a flash.
useThemeStore.getState().applyTheme(useThemeStore.getState().theme)

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
