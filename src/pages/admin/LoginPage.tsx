import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { user, isLoading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isLoading && user) {
    return <Navigate to="/admin/vehicles" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await signIn(email, password)
      navigate('/admin/vehicles', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko prisijungti. Bandykite dar kartą.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Administratoriaus prisijungimas</h1>
        <p className="mt-1 text-sm text-slate-600">Įveskite el. paštą ir slaptažodį.</p>

        {errorMessage && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            El. paštas
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Slaptažodis
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
          </button>
        </form>
      </main>
    </div>
  )
}
