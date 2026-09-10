import { supabase } from './supabase'
import { saveTrip } from './saveTrip'
import {
  normalizeName,
  normalizePlate,
  parseTripImportExcel,
  type GroupedTrip,
  type TripImportError,
} from './parseTripImportExcel'

export type { TripImportError }

export type TripImportResult = {
  importedCount: number
  errors: TripImportError[]
}

type ListMatch = {
  id: string
  label: string
}

function findMatch(items: ListMatch[], value: string, kind: 'name' | 'plate'): ListMatch | null {
  const needle = kind === 'plate' ? normalizePlate(value) : normalizeName(value)

  return (
    items.find((item) =>
      kind === 'plate' ? normalizePlate(item.label) === needle : normalizeName(item.label) === needle,
    ) ?? null
  )
}

async function saveGroupedTrip(
  group: GroupedTrip,
  drivers: ListMatch[],
  vehicles: ListMatch[],
): Promise<TripImportError | null> {
  if (!group.tripDate) {
    return { rowNumber: group.rowNumber, message: 'Nenurodyta data.' }
  }

  const driver = findMatch(drivers, group.driverName, 'name')
  if (!driver) {
    return {
      rowNumber: group.rowNumber,
      message: `Vairuotojas „${group.driverName || '—'}“ nerastas.`,
    }
  }

  const vehicle = findMatch(vehicles, group.vehiclePlate, 'plate')
  if (!vehicle) {
    return {
      rowNumber: group.rowNumber,
      message: `Automobilis „${group.vehiclePlate || '—'}“ nerastas.`,
    }
  }

  try {
    await saveTrip(
      { driverId: driver.id, vehicleId: vehicle.id, tripDate: group.tripDate },
      group.invoices,
      { allowEmptyInvoices: true, tripNumber: group.tripNumber, notes: group.notes },
    )
    return null
  } catch (error) {
    return {
      rowNumber: group.rowNumber,
      message:
        error instanceof Error ? error.message : 'Nepavyko išsaugoti reiso. Bandykite dar kartą.',
    }
  }
}

export async function importTripsFromExcel(file: File): Promise<TripImportResult> {
  const { groups, errors } = await parseTripImportExcel(file)
  const [vehiclesResult, driversResult] = await Promise.all([
    supabase.from('vehicles').select('id, plate_number'),
    supabase.from('drivers').select('id, name'),
  ])

  if (vehiclesResult.error || driversResult.error) {
    throw new Error('Nepavyko įkelti automobilių ir vairuotojų. Bandykite dar kartą.')
  }

  const vehicles: ListMatch[] = (vehiclesResult.data ?? []).map((row) => ({
    id: row.id,
    label: row.plate_number,
  }))
  const drivers: ListMatch[] = (driversResult.data ?? []).map((row) => ({
    id: row.id,
    label: row.name,
  }))

  const result: TripImportResult = {
    importedCount: 0,
    errors,
  }

  for (const group of groups) {
    const error = await saveGroupedTrip(group, drivers, vehicles)
    if (error) {
      result.errors.push(error)
    } else {
      result.importedCount += 1
    }
  }

  return result
}
