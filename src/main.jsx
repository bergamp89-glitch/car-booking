import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CarProvider } from './contexts/CarContext.jsx'
import { BookingProvider } from './contexts/BookingContext.jsx'
import { ChatProvider } from './contexts/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <CarProvider>
          <BookingProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </BookingProvider>
        </CarProvider>
      </AuthProvider>
  </StrictMode>,
)
