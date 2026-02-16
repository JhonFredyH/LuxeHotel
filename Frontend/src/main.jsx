import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { RoomProvider } from './context/RoomContext'  // ← Agregar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>  {/* ← Envolver App */}
        <App />
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>,
)