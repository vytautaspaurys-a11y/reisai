import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

const emptyForm = {
  plate_number: '',
  make: '',
  company: '',
  is_active: true,
}

function getVehicleErrorMessage(error: unknown): string {
  const rawMessage =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : ''
  const rawCode =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : ''

  if (rawCode === '23503' || rawMessage.toLowerCase().includes('foreign key')) {
    return 'Šio automobilio negalima ištrinti, nes jis naudojamas reisuose.'
  }

  return 'Nepavyko išsaugoti automobilio. Bandykite dar kartą.'
}

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  async function loadVehicles() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, plate_number, make, company, is_active, created_at')
        .order('plate_number')

      if (error) {
        throw error
      }

      setVehicles(data ?? [])
    } catch {
      setErrorMessage('Nepavyko įkelti automobilių. Bandykite dar kartą.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
    setPendingDeleteId(null)
    setErrorMessage('')
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingId(vehicle.id)
    setForm({
      plate_number: vehicle.plate_number,
      make: vehicle.make,
      company: vehicle.company,
      is_active: vehicle.is_active,
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
      plate_number: form.plate_number.trim(),
      make: form.make.trim(),
      company: form.company.trim(),
      is_active: form.is_active,
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('vehicles').update(payload).eq('id', editingId)
        if (error) {
          throw error
        }
      } else {
        const { error } = await supabase.from('vehicles').insert(payload)
        if (error) {
          throw error
        }
      }

      closeForm()
      await loadVehicles()
    } catch (error) {
      setErrorMessage(getVehicleErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(vehicleId: string) {
    setErrorMessage('')

    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)
      if (error) {
        throw error
      }

      setPendingDeleteId(null)
      await loadVehicles()
    } catch (error) {
      setErrorMessage(getVehicleErrorMessage(error))
      setPendingDeleteId(null)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Automobiliai</h1>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Pridėti automobilį
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
            {editingId ? 'Taisyti automobilį' : 'Naujas automobilis'}
          </p>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Automobilio numeris
            <input
              value={form.plate_number}
              onChange={(event) => setForm((current) => ({ ...current, plate_number: event.target.value }))}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Markė
            <input
              value={form.make}
              onChange={(event) => setForm((current) => ({ ...current, make: event.target.value }))}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Įmonė
            <input
              value={form.company}
              onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
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
        ) : vehicles.length === 0 ? (
          <p className="text-sm text-slate-600">Automobilių dar nėra.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-800">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 pr-3 font-medium">Numeris</th>
                <th className="py-2 pr-3 font-medium">Markė</th>
                <th className="py-2 pr-3 font-medium">Įmonė</th>
                <th className="py-2 pr-3 font-medium">Sąraše</th>
                <th className="py-2 font-medium">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-slate-100">
                  <td className="py-3 pr-3 font-medium">{vehicle.plate_number}</td>
                  <td className="py-3 pr-3">{vehicle.make}</td>
                  <td className="py-3 pr-3">{vehicle.company}</td>
                  <td className="py-3 pr-3">{vehicle.is_active ? 'Taip' : 'Ne'}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(vehicle)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Taisyti
                      </button>
                      {pendingDeleteId === vehicle.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              void handleDelete(vehicle.id)
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
                          onClick={() => setPendingDeleteId(vehicle.id)}
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
