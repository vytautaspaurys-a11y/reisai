const WEEKDAY_NAMES_LT = [
  'Sekmadienis',
  'Pirmadienis',
  'Antradienis',
  'Trečiadienis',
  'Ketvirtadienis',
  'Penktadienis',
  'Šeštadienis',
] as const

export function getWeekdayName(tripDate: string): string {
  const [year, month, day] = tripDate.split('-').map(Number)

  if (!year || !month || !day) {
    return ''
  }

  const date = new Date(year, month - 1, day)
  return WEEKDAY_NAMES_LT[date.getDay()] ?? ''
}

export function formatDateWithWeekday(tripDate: string): string {
  const weekday = getWeekdayName(tripDate)

  if (!weekday) {
    return tripDate
  }

  return `${tripDate}, ${weekday.toLowerCase()}`
}
