export type TripAttentionFilter = 'all' | 'no-invoices' | 'several-same-day' | 'long-invoices'

const MAX_INVOICE_NUMBER_LENGTH = 12

type TripForEditFilter = {
  driver_id: string
  trip_date: string
  invoices: { id: string; invoice_number?: string }[] | null
}

function hasSeveralSameDayTrips<T extends TripForEditFilter>(trips: T[]): Set<string> {
  const sameDayCounts = new Map<string, number>()

  for (const trip of trips) {
    const key = `${trip.driver_id}|${trip.trip_date}`
    sameDayCounts.set(key, (sameDayCounts.get(key) ?? 0) + 1)
  }

  return new Set(
    [...sameDayCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([key]) => key),
  )
}

export function filterTripsByAttention<T extends TripForEditFilter>(
  trips: T[],
  attention: TripAttentionFilter,
): T[] {
  if (attention === 'all') {
    return trips
  }

  if (attention === 'no-invoices') {
    return trips.filter((trip) => (trip.invoices?.length ?? 0) === 0)
  }

  if (attention === 'several-same-day') {
    const duplicateKeys = hasSeveralSameDayTrips(trips)

    return trips.filter((trip) => duplicateKeys.has(`${trip.driver_id}|${trip.trip_date}`))
  }

  return trips.filter((trip) =>
    (trip.invoices ?? []).some(
      (invoice) => (invoice.invoice_number?.length ?? 0) > MAX_INVOICE_NUMBER_LENGTH,
    ),
  )
}
