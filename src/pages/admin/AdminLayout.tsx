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
        <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-4 px-4 py-3">
          <p className="text-lg font-semibold text-slate-900">Administravimas</p>
          <nav className="flex flex-wrap items-start gap-4">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Duomenų įvedimas</p>
              <div className="flex flex-wrap gap-2">
                <NavLink to="/admin/vehicles" className={navClassName}>
                  Automobiliai
                </NavLink>
                <NavLink to="/admin/drivers" className={navClassName}>
                  Vairuotojai
                </NavLink>
              </div>
            </div>
            <div className="hidden h-12 w-px self-center bg-slate-200 sm:block" />
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Peržiūra</p>
              <div className="flex flex-wrap gap-2">
                <NavLink to="/admin/trips" className={navClassName}>
                  Reisai
                </NavLink>
                <NavLink to="/admin/invoices" className={navClassName}>
                  Sąskaitos
                </NavLink>
              </div>
            </div>
            <div className="hidden h-12 w-px self-center bg-slate-200 sm:block" />
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Redagavimas</p>
              <div className="flex flex-wrap gap-2">
                <NavLink to="/admin/manage-trips" className={navClassName}>
                  Tvarkyti reisus
                </NavLink>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                void handleSignOut()
              }}
              className="self-end rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
