const WEEKDAY_NAMES_LT = [
  'Sekmadienis',
  'Pirmadienis',
  'Antradienis',
  'Trečiadienis',
  'Ketvirtadienis',
  'Penktadienis',
  'Šeštadienis',
] as const

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getWeekdayName(tripDate: string): string {
  const [year, month, day] = tripDate.split('-').map(Number)

  if (!year || !month || !day) {
    return ''
  }

  const date = new Date(year, month - 1, day)
  return WEEKDAY_NAMES_LT[date.getDay()] ?? ''
}

export function getRelativeDayLabel(tripDate: string): string {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if (tripDate === toIsoDate(today)) {
    return 'Šiandien'
  }

  if (tripDate === toIsoDate(tomorrow)) {
    return 'Rytoj'
  }

  return ''
}

export function formatDateWithWeekday(tripDate: string): string {
  const weekday = getWeekdayName(tripDate)

  if (!weekday) {
    return tripDate
  }

  return `${tripDate}, ${weekday.toLowerCase()}`
}

export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime)

  if (Number.isNaN(date.getTime())) {
    return isoDateTime
  }

  return date.toLocaleString('lt-LT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
