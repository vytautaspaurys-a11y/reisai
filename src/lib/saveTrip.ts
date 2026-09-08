import { supabase } from './supabase'
import type { TripDraft } from '../types/trip'

function getSaveErrorMessage(error: unknown): string {
  const rawMessage =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : ''

  if (rawMessage.includes('jau buvo naudotas')) {
    return rawMessage
  }

  if (rawMessage.includes('daugiau nei vieną kartą')) {
    return rawMessage
  }

  if (rawMessage.includes('99 reisai')) {
    return rawMessage
  }

  if (rawMessage.includes('bent vieną sąskaitą')) {
    return rawMessage
  }

  return 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
}

export async function saveTrip(trip: TripDraft, invoices: string[]): Promise<string> {
  const invoiceNumbers = invoices.map((invoice) => invoice.trim()).filter(Boolean)

  if (invoiceNumbers.length === 0) {
    throw new Error('Pridėkite bent vieną sąskaitą.')
  }

  const { data, error } = await supabase.rpc('create_trip', {
    p_driver_id: trip.driverId,
    p_vehicle_id: trip.vehicleId,
    p_trip_date: trip.tripDate,
    p_invoice_numbers: invoiceNumbers,
  })

  if (error) {
    throw new Error(getSaveErrorMessage(error))
  }

  if (!data) {
    throw new Error('Nepavyko išsaugoti reiso. Bandykite dar kartą.')
  }

  return data
}
