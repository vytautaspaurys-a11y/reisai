import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Driver = Database['public']['Tables']['drivers']['Row']

const emptyForm = {
  name: '',
  is_active: true,
}

function getDriverErrorMessage(error: unknown): string {
  const rawMessage =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : ''
  const rawCode =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : ''

  if (rawCode === '23503' || rawMessage.toLowerCase().includes('foreign key')) {
    return 'Šio vairuotojo negalima ištrinti, nes jis naudojamas reisuose.'
  }

  return 'Nepavyko išsaugoti vairuotojo. Bandykite dar kartą.'
}

export function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  async function loadDrivers() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('id, name, is_active, created_at')
        .order('name')

      if (error) {
        throw error
      }

      setDrivers(data ?? [])
    } catch {
      setErrorMessage('Nepavyko įkelti vairuotojų. Bandykite dar kartą.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDrivers()
  }, [])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
    setPendingDeleteId(null)
    setErrorMessage('')
  }

  function openEditForm(driver: Driver) {
    setEditingId(driver.id)
    setForm({
      name: driver.name,
      is_active: driver.is_active,
    })
    setIsFormOpen(true)
    setPendingDeleteId(null)
    setErrorMessage('')
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')

    const payload = {
      name: form.name.trim(),
      is_active: form.is_active,
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('drivers').update(payload).eq('id', editingId)
        if (error) {
          throw error
        }
      } else {
        const { error } = await supabase.from('drivers').insert(payload)
        if (error) {
          throw error
        }
      }

      closeForm()
      await loadDrivers()
    } catch (error) {
      setErrorMessage(getDriverErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(driverId: string) {
    setErrorMessage('')

    try {
      const { error } = await supabase.from('drivers').delete().eq('id', driverId)
      if (error) {
        throw error
      }

      setPendingDeleteId(null)
      await loadDrivers()
    } catch (error) {
      setErrorMessage(getDriverErrorMessage(error))
      setPendingDeleteId(null)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Vairuotojai</h1>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Pridėti vairuotoją
        </button>
      </div>

      {errorMessage && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isFormOpen && (
        <form className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4" onSubmit={handleSave}>
          <p className="text-sm font-semibold text-slate-800">
            {editingId ? 'Taisyti vairuotoją' : 'Naujas vairuotojas'}
          </p>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Vardas ir pavardė
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
              className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
            />
            Rodyti vairuotojo sąraše
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:bg-slate-300"
            >
              {isSaving ? 'Saugoma...' : 'Išsaugoti'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Atšaukti
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-slate-600">Kraunama...</p>
        ) : drivers.length === 0 ? (
          <p className="text-sm text-slate-600">Vairuotojų dar nėra.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-800">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 pr-3 font-medium">Vardas</th>
                <th className="py-2 pr-3 font-medium">Sąraše</th>
                <th className="py-2 font-medium">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-b border-slate-100">
                  <td className="py-3 pr-3 font-medium">{driver.name}</td>
                  <td className="py-3 pr-3">{driver.is_active ? 'Taip' : 'Ne'}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(driver)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Taisyti
                      </button>
                      {pendingDeleteId === driver.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              void handleDelete(driver.id)
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Patvirtinti
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-800"
                          >
                            Atšaukti
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(driver.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Ištrinti
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
