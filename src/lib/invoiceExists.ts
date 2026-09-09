import { supabase } from './supabase'

export async function invoiceNumberExists(invoiceNumber: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('invoice_number_exists', {
    p_invoice_number: invoiceNumber.trim(),
  })

  if (error) {
    throw new Error('Nepavyko patikrinti sąskaitos numerio. Bandykite dar kartą.')
  }

  return Boolean(data)
}
