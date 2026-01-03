import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Start MSW in dev
if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start()
  })
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
