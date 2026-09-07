import { useState } from 'react'

const TEMP_VEHICLES = [
  { id: '1', plateNumber: 'ABC 123' },
  { id: '2', plateNumber: 'XYZ 789' },
  { id: '3', plateNumber: 'KLT 456' },
]

const TEMP_DRIVERS = [
  { id: '1', name: 'Jonas Petraitis' },
  { id: '2', name: 'Petras Jonaitis' },
  { id: '3', name: 'Ona Kazlauskienė' },
]

function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const year = tomorrow.getFullYear()
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const day = String(tomorrow.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function TripFormPage() {
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [tripDate, setTripDate] = useState(getTomorrowDate)

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Naujas reisas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pasirinkite automobilį, vairuotoją ir datą.
        </p>

        <form className="mt-6 flex flex-col gap-4">
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
          </label>
        </form>
      </main>
    </div>
  )
}
