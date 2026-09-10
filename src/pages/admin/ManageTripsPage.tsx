import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TripImportPanel } from '../../components/TripImportPanel'
import { filterTripsByAttention, type TripAttentionFilter } from '../../lib/filterTripsNeedingEdit'
import { supabase } from '../../lib/supabase'
import { TripTable, type TripListItem } from './TripTable'

type FilterOption = {
  id: string
  label: string
}

const selectClassName =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export function ManageTripsPage() {
  const [trips, setTrips] = useState<TripListItem[]>([])
  const [drivers, setDrivers] = useState<FilterOption[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [driverId, setDriverId] = useState('')
  const [search, setSearch] = useState('')
  const [attention, setAttention] = useState<TripAttentionFilter>('all')
  const [listVersion, setListVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const searchTerm = search.trim()
  const hasFilters = Boolean(dateFrom || dateTo || driverId || searchTerm || attention !== 'all')
  const visibleTrips = filterTripsByAttention(trips, attention)

  useEffect(() => {
    async function loadDrivers() {
      try {
        const { data, error } = await supabase.from('drivers').select('id, name').order('name')

        if (error) {
          throw error
        }

        setDrivers(
          (data ?? []).map((row) => ({
            id: row.id,
            label: row.name,
          })),
        )
      } catch {
        setErrorMessage('Nepavyko įkelti filtrų sąrašų. Bandykite dar kartą.')
      }
    }

    void loadDrivers()
  }, [])

  useEffect(() => {
    async function loadTrips() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        let query = supabase
          .from('trips')
          .select(
            'id, trip_number, trip_date, notes, created_at, driver_id, drivers(name), vehicles(plate_number), invoices(id, invoice_number)',
          )
          .order('created_at', { ascending: false })

        if (dateFrom) {
          query = query.gte('trip_date', dateFrom)
        }

        if (dateTo) {
          query = query.lte('trip_date', dateTo)
        }

        if (driverId) {
          query = query.eq('driver_id', driverId)
        }

        if (searchTerm) {
          const { data: matchingInvoices, error: invoiceError } = await supabase
            .from('invoices')
            .select('trip_id')
            .ilike('invoice_number', `%${searchTerm}%`)

          if (invoiceError) {
            throw invoiceError
          }

          const tripIds = [...new Set((matchingInvoices ?? []).map((row) => row.trip_id))]

          if (tripIds.length > 0) {
            query = query.or(`trip_number.ilike.%${searchTerm}%,id.in.(${tripIds.join(',')})`)
          } else {
            query = query.ilike('trip_number', `%${searchTerm}%`)
          }
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setTrips((data as TripListItem[] | null) ?? [])
      } catch {
        setErrorMessage('Nepavyko įkelti reisų. Bandykite dar kartą.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTrips()
  }, [dateFrom, dateTo, driverId, searchTerm, listVersion])

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setDriverId('')
    setSearch('')
    setAttention('all')
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tvarkyti reisus</h1>
          <p className="mt-1 text-sm text-slate-600">
            Taisykite jau išsaugotus reisus arba užregistruokite naują.
          </p>
        </div>
        <Link
          to="/admin/manage-trips/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Naujas reisas
        </Link>
      </div>

      <TripImportPanel onImported={() => setListVersion((current) => current + 1)} />

      <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Rodyti
        <select
          value={attention}
          onChange={(event) => setAttention(event.target.value as TripAttentionFilter)}
          className={selectClassName}
        >
          <option value="all">Visi reisai</option>
          <option value="no-invoices">Reisai be sąskaitų</option>
          <option value="several-same-day">Keli to paties vairuotojo reisai</option>
          <option value="long-invoices">Sąskaitos ilgesnės nei 12 simbolių</option>
        </select>
        <span className="font-normal text-slate-500">
          „Keli to paties vairuotojo reisai“ rodo tą pačią dieną. Ilgesnės sąskaitos dažnai būna
          su papildomu skanerio skaitmeniu.
        </span>
      </label>

      <label className="mt-3 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Paieška
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Reiso arba sąskaitos numeris"
          className={selectClassName}
        />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Data nuo
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className={selectClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Data iki
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className={selectClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Vairuotojas
          <select
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            className={selectClassName}
          >
            <option value="">Visi vairuotojai</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Išvalyti filtrus
        </button>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-slate-600">Kraunama...</p>
        ) : visibleTrips.length === 0 ? (
          <p className="text-sm text-slate-600">
            {hasFilters ? 'Reisų pagal pasirinktus filtrus nėra.' : 'Reisų dar nėra.'}
          </p>
        ) : (
          <TripTable
            trips={visibleTrips}
            editTo={(trip) => `/admin/manage-trips/${trip.id}`}
          />
        )}
      </div>
    </section>
  )
}
