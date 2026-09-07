/** Laikina logika: dienos eilės numeris visada 01. Vėliau skaičiuosime pagal tikrus reisus. */
export function buildTripNumber(tripDate: string, sequence = 1): string {
  const datePart = tripDate.replaceAll('-', '')
  const sequencePart = String(sequence).padStart(2, '0')

  return `${datePart}${sequencePart}`
}
