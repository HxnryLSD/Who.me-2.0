import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

// Register Service Worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Neue Version verfügbar! Jetzt aktualisieren?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ App ist jetzt offline verfügbar!')
  },
  onRegistered(r) {
    console.log('📱 Service Worker registriert:', r)
  },
  onRegisterError(error) {
    console.error('❌ Service Worker Registrierung fehlgeschlagen:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
