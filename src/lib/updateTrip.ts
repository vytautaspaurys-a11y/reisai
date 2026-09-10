import { supabase } from './supabase'

function getUpdateErrorMessage(error: unknown): string {
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

  if (rawMessage.includes('nerastas')) {
    return rawMessage
  }

  return 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
}

export async function updateAdminTrip(params: {
  tripId: string
  driverId: string
  vehicleId: string
  tripDate: string
  notes: string
  invoices: string[]
}): Promise<void> {
  const invoiceNumbers = params.invoices.map((invoice) => invoice.trim())

  if (params.invoices.some((invoice) => invoice.trim() === '')) {
    throw new Error('Sąskaitos numeris negali būti tuščias.')
  }

  const { error } = await supabase.rpc('update_admin_trip', {
    p_trip_id: params.tripId,
    p_driver_id: params.driverId,
    p_vehicle_id: params.vehicleId,
    p_trip_date: params.tripDate,
    p_notes: params.notes.trim() || null,
    p_invoice_numbers: invoiceNumbers,
  })

  if (error) {
    throw new Error(getUpdateErrorMessage(error))
  }
}

export async function deleteAdminTrip(tripId: string): Promise<void> {
  const { error } = await supabase.from('trips').delete().eq('id', tripId)

  if (error) {
    throw new Error('Nepavyko ištrinti reiso. Bandykite dar kartą.')
  }
}
