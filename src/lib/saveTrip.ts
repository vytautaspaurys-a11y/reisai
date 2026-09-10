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

  if (rawMessage.includes('jau yra')) {
    return rawMessage
  }

  return 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
}

export async function saveTrip(
  trip: Pick<TripDraft, 'driverId' | 'vehicleId' | 'tripDate'>,
  invoices: string[],
  options: { notes?: string; allowEmptyInvoices?: boolean; tripNumber?: string } = {},
): Promise<string> {
  const invoiceNumbers = invoices.map((invoice) => invoice.trim()).filter(Boolean)
  const notes = options.notes?.trim() || null
  const tripNumber = options.tripNumber?.trim() || null

  if (invoiceNumbers.length === 0 && !options.allowEmptyInvoices) {
    throw new Error('Pridėkite bent vieną sąskaitą.')
  }

  const { data, error } = await supabase.rpc('create_trip', {
    p_driver_id: trip.driverId,
    p_vehicle_id: trip.vehicleId,
    p_trip_date: trip.tripDate,
    p_invoice_numbers: invoiceNumbers,
    p_notes: notes,
    p_trip_number: tripNumber,
  })

  if (error) {
    throw new Error(getSaveErrorMessage(error))
  }

  if (!data) {
    throw new Error('Nepavyko išsaugoti reiso. Bandykite dar kartą.')
  }

  return data
}
