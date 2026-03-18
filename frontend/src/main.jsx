import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import favicon from './assets/Team4mation_Logo_Clear_Background.svg'

// Set favicon
document.querySelector('link[rel="icon"]').href = favicon

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
