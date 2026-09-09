export type TripListItem = {
  id: string
  trip_number: string
  trip_date: string
  created_at: string
  drivers: { name: string } | null
  vehicles: { plate_number: string } | null
  invoices: { id: string }[] | null
}

type TripTableProps = {
  trips: TripListItem[]
}

export function TripTable({ trips }: TripTableProps) {
  return (
    <table className="min-w-full text-left text-sm text-slate-800">
      <thead>
        <tr className="border-b border-slate-200 text-slate-600">
          <th className="py-2 pr-3 font-medium">Numeris</th>
          <th className="py-2 pr-3 font-medium">Data</th>
          <th className="py-2 pr-3 font-medium">Vairuotojas</th>
          <th className="py-2 pr-3 font-medium">Automobilis</th>
          <th className="py-2 font-medium">Sąskaitos</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id} className="border-b border-slate-100">
            <td className="py-3 pr-3 font-medium">{trip.trip_number}</td>
            <td className="py-3 pr-3">{trip.trip_date}</td>
            <td className="py-3 pr-3">{trip.drivers?.name ?? '—'}</td>
            <td className="py-3 pr-3">{trip.vehicles?.plate_number ?? '—'}</td>
            <td className="py-3">{trip.invoices?.length ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
