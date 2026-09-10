import { supabase } from './supabase'

export async function invoiceNumberExists(
  invoiceNumber: string,
  options: { excludeTripId?: string } = {},
): Promise<boolean> {
  const trimmedNumber = invoiceNumber.trim()

  if (options.excludeTripId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('invoice_number', trimmedNumber)
      .neq('trip_id', options.excludeTripId)
      .limit(1)

    if (error) {
      throw new Error('Nepavyko patikrinti sąskaitos numerio. Bandykite dar kartą.')
    }

    return (data ?? []).length > 0
  }

  const { data, error } = await supabase.rpc('invoice_number_exists', {
    p_invoice_number: trimmedNumber,
  })

  if (error) {
    throw new Error('Nepavyko patikrinti sąskaitos numerio. Bandykite dar kartą.')
  }

  return Boolean(data)
}
