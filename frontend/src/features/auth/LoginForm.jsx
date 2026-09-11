import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardPerforation } from '../../components/ui'
import { GoogleLogin } from '@react-oauth/google'
import authService from '../../services/authService'
import authApi from './authApi'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      const token = credentialResponse.credential
      const response = await authService.googleLogin(token)
      
      const jwt = response?.token || response?.data?.token
      const tenant = response?.tenant || response?.data?.tenant || {
        id: response?.tenantId || response?.data?.tenantId,
        name: response?.businessName || response?.data?.businessName,
        tenantName: response?.businessName || response?.data?.businessName,
        email: response?.email || response?.data?.email,
      }
      
      login(jwt, tenant)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Gagal login menggunakan Google.')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login({ email, password })
      const token = response?.token || response?.data?.token
      const tenant = response?.tenant || response?.data?.tenant || {
        id: response?.tenantId || response?.data?.tenantId,
        name: response?.businessName || response?.data?.businessName,
        tenantName: response?.businessName || response?.data?.businessName,
        email: response?.email || response?.data?.email,
      }
      login(token, tenant)
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        err.message ||
        err.response?.data?.message ||
        'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@catatcuan.id')
    setPassword('password123')
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login({ email: 'demo@catatcuan.id', password: 'password123' })
      const token = response?.token || response?.data?.token
      const tenant = response?.tenant || response?.data?.tenant || {
        id: response?.tenantId || response?.data?.tenantId,
        name: response?.businessName || response?.data?.businessName || 'Studio Solusi Kreatif',
        tenantName: response?.businessName || response?.data?.businessName || 'Studio Solusi Kreatif',
        email: 'demo@catatcuan.id',
      }
      login(token, tenant)
      navigate(from, { replace: true })
    } catch {
      setError('Koneksi ke backend gagal atau akun demo belum terdaftar di database. Pastikan PostgreSQL & Spring Boot aktif.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-sm border-border">
        <CardHeader perforated className="text-center pb-3">
          <div className="mx-auto mb-3 w-10 h-10 rounded-base bg-emerald-700 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
            CC
          </div>
          <CardTitle as="h2" className="text-xl sm:text-2xl font-bold font-heading">
            Masuk
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-base bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans font-medium leading-relaxed">
              {error}
            </div>
          )}

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Gagal.')}
              useOneTap
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs text-text-muted font-mono">atau dengan email</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffixIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              }
            />

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="md">
              Masuk
            </Button>
          </form>

          {/* Perforation Line Before Demo Shortcut */}
          <CardPerforation className="my-4" />

          {/* Quick Demo Access */}
          <div>
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="sm"
              onClick={handleDemoLogin}
              className="border-dashed hover:border-slate-400 font-mono text-xs"
              icon={
                <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              Coba Akun Demo
            </Button>
          </div>

          <div className="pt-2 text-center text-xs text-text-muted">
            Belum punya akun?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Daftar →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
