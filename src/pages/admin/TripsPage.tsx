import { useEffect, useState } from 'react'
import { downloadTripsCsv, downloadTripsExcel } from '../../lib/exportTrips'
import { supabase } from '../../lib/supabase'
import { TripTable, type TripListItem } from './TripTable'

type FilterOption = {
  id: string
  label: string
}

const selectClassName =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export function TripsPage() {
  const [trips, setTrips] = useState<TripListItem[]>([])
  const [vehicles, setVehicles] = useState<FilterOption[]>([])
  const [drivers, setDrivers] = useState<FilterOption[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [driverId, setDriverId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const searchTerm = search.trim()
  const hasFilters = Boolean(dateFrom || dateTo || driverId || vehicleId || searchTerm)

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [vehiclesResult, driversResult] = await Promise.all([
          supabase.from('vehicles').select('id, plate_number').order('plate_number'),
          supabase.from('drivers').select('id, name').order('name'),
        ])

        if (vehiclesResult.error || driversResult.error) {
          throw vehiclesResult.error ?? driversResult.error
        }

        setVehicles(
          (vehiclesResult.data ?? []).map((row) => ({
            id: row.id,
            label: row.plate_number,
          })),
        )
        setDrivers(
          (driversResult.data ?? []).map((row) => ({
            id: row.id,
            label: row.name,
          })),
        )
      } catch {
        setErrorMessage('Nepavyko įkelti filtrų sąrašų. Bandykite dar kartą.')
      }
    }

    void loadFilterOptions()
  }, [])

  useEffect(() => {
    async function loadTrips() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        let query = supabase
          .from('trips')
          .select(
            'id, trip_number, trip_date, created_at, drivers(name), vehicles(plate_number), invoices(id)',
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

        if (vehicleId) {
          query = query.eq('vehicle_id', vehicleId)
        }

        if (searchTerm) {
          const { data: matchingInvoices, error: invoiceError } = await supabase
            .from('invoices')
            .select('trip_id')
            .ilike('invoice_number', `%${searchTerm}%`)

          if (invoiceError) {
            throw invoiceError
          }

          const tripIds = [
            ...new Set((matchingInvoices ?? []).map((row) => row.trip_id)),
          ]

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
  }, [dateFrom, dateTo, driverId, vehicleId, searchTerm])

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setDriverId('')
    setVehicleId('')
    setSearch('')
  }

  function toExportRows() {
    return trips.map((trip) => ({
      tripNumber: trip.trip_number,
      tripDate: trip.trip_date,
      driverName: trip.drivers?.name ?? '',
      vehiclePlate: trip.vehicles?.plate_number ?? '',
      invoiceCount: trip.invoices?.length ?? 0,
    }))
  }

  function handleExportCsv() {
    if (trips.length === 0) {
      return
    }

    try {
      downloadTripsCsv(toExportRows())
    } catch {
      setErrorMessage('Nepavyko eksportuoti į CSV. Bandykite dar kartą.')
    }
  }

  async function handleExportExcel() {
    if (trips.length === 0) {
      return
    }

    try {
      await downloadTripsExcel(toExportRows())
    } catch {
      setErrorMessage('Nepavyko eksportuoti į Excel. Bandykite dar kartą.')
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reisai</h1>
          <p className="mt-1 text-sm text-slate-600">Naujausi reisai rodomi viršuje.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isLoading || trips.length === 0}
            onClick={() => {
              void handleExportExcel()
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Eksportuoti į Excel
          </button>
          <button
            type="button"
            disabled={isLoading || trips.length === 0}
            onClick={handleExportCsv}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            Eksportuoti į CSV
          </button>
        </div>
      </div>

      <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Paieška
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Reiso arba sąskaitos numeris"
          className={selectClassName}
        />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Automobilis
          <select
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            className={selectClassName}
          >
            <option value="">Visi automobiliai</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.label}
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
        ) : trips.length === 0 ? (
          <p className="text-sm text-slate-600">
            {hasFilters ? 'Reisų pagal pasirinktus filtrus nėra.' : 'Reisų dar nėra.'}
          </p>
        ) : (
          <TripTable trips={trips} />
        )}
      </div>
    </section>
  )
}
