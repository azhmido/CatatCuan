import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppRouter from './routes/AppRouter'

import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '70472348333-co81i85lvrst77ojthrabaih0lv3dlhh.apps.googleusercontent.com'

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
