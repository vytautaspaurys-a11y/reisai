export type InvoiceListItem = {
  id: string
  invoice_number: string
  created_at: string
  trips: {
    trip_number: string
    trip_date: string
    notes: string | null
    drivers: { name: string } | null
    vehicles: { plate_number: string } | null
  } | null
}

type InvoiceTableProps = {
  invoices: InvoiceListItem[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <table className="min-w-full text-left text-sm text-slate-800">
      <thead>
        <tr className="border-b border-slate-200 text-slate-600">
          <th className="py-2 pr-3 font-medium">Numeris</th>
          <th className="py-2 pr-3 font-medium">Data</th>
          <th className="py-2 pr-3 font-medium">Automobilis</th>
          <th className="py-2 pr-3 font-medium">Vairuotojas</th>
          <th className="py-2 pr-3 font-medium">Sąskaitos numeris</th>
          <th className="py-2 font-medium">Pastabos</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id} className="border-b border-slate-100">
            <td className="py-3 pr-3 font-medium">{invoice.trips?.trip_number ?? '—'}</td>
            <td className="py-3 pr-3">{invoice.trips?.trip_date ?? '—'}</td>
            <td className="py-3 pr-3">{invoice.trips?.vehicles?.plate_number ?? '—'}</td>
            <td className="py-3 pr-3">{invoice.trips?.drivers?.name ?? '—'}</td>
            <td className="py-3 pr-3">{invoice.invoice_number}</td>
            <td className="py-3">{invoice.trips?.notes?.trim() ? invoice.trips.notes : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
