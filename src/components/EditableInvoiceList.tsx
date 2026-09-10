type EditableInvoiceListProps = {
  invoices: string[]
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
  emptyMessage?: string
}

export function EditableInvoiceList({
  invoices,
  onChange,
  onRemove,
  emptyMessage = 'Sąskaitų dar nėra.',
}: EditableInvoiceListProps) {
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
          key={`invoice-${index}`}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <input
            type="text"
            value={invoiceNumber}
            onChange={(event) => onChange(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
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
