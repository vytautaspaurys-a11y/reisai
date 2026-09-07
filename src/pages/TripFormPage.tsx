import { useState } from 'react'
import { getWeekdayName } from '../lib/formatDate'
import { buildTripNumber } from '../lib/tripNumber'
import {
  getTomorrowDate,
  TEMP_DRIVERS,
  TEMP_VEHICLES,
  type TripDraft,
} from '../types/trip'

type TripFormPageProps = {
  initialValues?: TripDraft | null
  onStartScanning: (draft: TripDraft) => void
}

export function TripFormPage({ initialValues, onStartScanning }: TripFormPageProps) {
  const [vehicleId, setVehicleId] = useState(initialValues?.vehicleId ?? '')
  const [driverId, setDriverId] = useState(initialValues?.driverId ?? '')
  const [tripDate, setTripDate] = useState(initialValues?.tripDate ?? getTomorrowDate())
  const tripNumber = buildTripNumber(tripDate)

  const isFormComplete = Boolean(vehicleId && driverId && tripDate)

  function handleStartScanning() {
    if (!isFormComplete) {
      return
    }

    const vehicle = TEMP_VEHICLES.find((item) => item.id === vehicleId)
    const driver = TEMP_DRIVERS.find((item) => item.id === driverId)

    if (!vehicle || !driver) {
      return
    }

    onStartScanning({
      vehicleId,
      vehiclePlate: vehicle.plateNumber,
      driverId,
      driverName: driver.name,
      tripDate,
      tripNumber,
    })
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Naujas reisas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pasirinkite automobilį, vairuotoją ir datą, tada skenuokite sąskaitas.
        </p>

        <form className="mt-6 flex flex-col gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-sm font-medium text-slate-700">Reiso numeris</p>
            <p className="mt-1 text-lg font-semibold tracking-wide text-slate-900">
              {tripNumber}
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Automobilis
            <select
              value={vehicleId}
              onChange={(event) => setVehicleId(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Pasirinkite automobilį</option>
              {TEMP_VEHICLES.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Vairuotojas
            <select
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Pasirinkite vairuotoją</option>
              {TEMP_DRIVERS.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Data
            <input
              type="date"
              value={tripDate}
              onChange={(event) => setTripDate(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {tripDate && (
              <span className="text-base font-semibold text-indigo-700">
                Pasirinkta diena: {getWeekdayName(tripDate)}
              </span>
            )}
          </label>

          <button
            type="button"
            disabled={!isFormComplete}
            onClick={handleStartScanning}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Skenuoti sąskaitas
          </button>
        </form>
      </main>
    </div>
  )
}
