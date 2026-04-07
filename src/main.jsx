import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0B3C5D',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
