import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { register, login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setTokens } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const field = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password })
      // Auto-login after registration
      const tokens = await login({ email: form.email, password: form.password })
      setTokens(tokens.access_token, tokens.refresh_token)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        ?? 'Registration failed. The email may already be in use.'
      setError(typeof msg === 'string' ? msg : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">Start managing your energy today</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={field('full_name')}
              required
              autoFocus
              className={inputCls}
              placeholder="Jane Smith"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={field('email')}
              required
              className={inputCls}
              placeholder="jane@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={field('password')}
              required
              minLength={8}
              className={inputCls}
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={field('confirm')}
              required
              className={inputCls}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
