import { Link } from 'react-router-dom'
import { formatDateTime } from '../../lib/formatDate'

export type TripListItem = {
  id: string
  trip_number: string
  trip_date: string
  notes: string | null
  created_at: string
  driver_id: string
  drivers: { name: string } | null
  vehicles: { plate_number: string } | null
  invoices: { id: string; invoice_number?: string }[] | null
}

type TripTableProps = {
  trips: TripListItem[]
  editTo?: (trip: TripListItem) => string
}

export function TripTable({ trips, editTo }: TripTableProps) {
  return (
    <table className="min-w-full text-left text-sm text-slate-800">
      <thead>
        <tr className="border-b border-slate-200 text-slate-600">
          <th className="py-2 pr-3 font-medium">Numeris</th>
          <th className="py-2 pr-3 font-medium">Data</th>
          <th className="py-2 pr-3 font-medium">Registruota</th>
          <th className="py-2 pr-3 font-medium">Vairuotojas</th>
          <th className="py-2 pr-3 font-medium">Automobilis</th>
          <th className="py-2 pr-3 font-medium">Sąskaitos</th>
          <th className="py-2 pr-3 font-medium">Pastabos</th>
          {editTo ? <th className="py-2 font-medium">Veiksmai</th> : null}
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id} className="border-b border-slate-100">
            <td className="py-3 pr-3 font-medium">{trip.trip_number}</td>
            <td className="py-3 pr-3">{trip.trip_date}</td>
            <td className="py-3 pr-3 whitespace-nowrap">{formatDateTime(trip.created_at)}</td>
            <td className="py-3 pr-3">{trip.drivers?.name ?? '—'}</td>
            <td className="py-3 pr-3">{trip.vehicles?.plate_number ?? '—'}</td>
            <td className="py-3 pr-3">{trip.invoices?.length ?? 0}</td>
            <td className={editTo ? 'py-3 pr-3' : 'py-3'}>
              {trip.notes?.trim() ? trip.notes : '—'}
            </td>
            {editTo ? (
              <td className="py-3">
                <Link
                  to={editTo(trip)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Taisyti
                </Link>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
