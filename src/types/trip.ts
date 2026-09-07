export type TripDraft = {
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  tripDate: string
  tripNumber: string
}

export const TEMP_VEHICLES = [
  { id: '1', plateNumber: 'ABC 123' },
  { id: '2', plateNumber: 'XYZ 789' },
  { id: '3', plateNumber: 'KLT 456' },
]

export const TEMP_DRIVERS = [
  { id: '1', name: 'Jonas Petraitis' },
  { id: '2', name: 'Petras Jonaitis' },
  { id: '3', name: 'Ona Kazlauskienė' },
]

export function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const year = tomorrow.getFullYear()
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const day = String(tomorrow.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
