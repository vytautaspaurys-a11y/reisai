import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-slate-700 hover:bg-slate-100'
  }`

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSignOut() {
    setErrorMessage('')

    try {
      await signOut()
      navigate('/admin/login', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko atsijungti. Bandykite dar kartą.'
      setErrorMessage(message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-lg font-semibold text-slate-900">Administravimas</p>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/admin/vehicles" className={navClassName}>
              Automobiliai
            </NavLink>
            <NavLink to="/admin/drivers" className={navClassName}>
              Vairuotojai
            </NavLink>
            <NavLink to="/admin/trips" className={navClassName}>
              Reisai
            </NavLink>
            <button
              type="button"
              onClick={() => {
                void handleSignOut()
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Atsijungti
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {errorMessage && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        <Outlet />
      </main>
    </div>
  )
}
