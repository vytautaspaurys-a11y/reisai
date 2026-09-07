type InvoiceListProps = {
  invoices: string[]
  onRemove: (index: number) => void
  emptyMessage?: string
}

export function InvoiceList({
  invoices,
  onRemove,
  emptyMessage = 'Sąskaitų dar nėra.',
}: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {invoices.map((invoiceNumber, index) => (
        <li
          key={`${invoiceNumber}-${index}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <span className="text-sm font-medium text-slate-900">{invoiceNumber}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Pašalinti
          </button>
        </li>
      ))}
    </ul>
  )
}
