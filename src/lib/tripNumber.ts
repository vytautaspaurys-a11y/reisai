/** Formoje rodomas preliminarus numeris. Tikras eilės numeris skaičiuojamas išsaugant. */
export function buildTripNumber(tripDate: string, sequence = 1): string {
  const datePart = tripDate.replaceAll('-', '')
  const sequencePart = String(sequence).padStart(2, '0')

  return `${datePart}${sequencePart}`
}
