import { Link } from 'react-router-dom'
import RegisterForm from './RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-[100dvh] bg-bg text-text flex flex-col justify-between p-4 sm:p-6 transition-colors">
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto pb-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-base bg-emerald-700 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
            CC
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-text">
            CatatCuan
          </span>
        </Link>
        <Link to="/login" className="text-xs text-text-muted hover:text-text transition-colors">
          Sudah punya akun? Masuk →
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <RegisterForm />
      </main>

      <footer className="text-center text-xs text-text-muted py-4 font-sans">
        &copy; {new Date().getFullYear()} CatatCuan
      </footer>
    </div>
  )
}

export default RegisterPage
