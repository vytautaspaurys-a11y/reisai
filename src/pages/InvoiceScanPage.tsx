import { useEffect, useRef } from 'react'
import { InvoiceList } from '../components/InvoiceList'
import { formatDateWithWeekday } from '../lib/formatDate'
import { type TripDraft } from '../types/trip'

type InvoiceScanPageProps = {
  trip: TripDraft
  invoices: string[]
  onInvoicesChange: (invoices: string[]) => void
  onBack: () => void
  onSave: () => void
}

export function InvoiceScanPage({
  trip,
  invoices,
  onInvoicesChange,
  onBack,
  onSave,
}: InvoiceScanPageProps) {
  const scannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scannerInputRef.current?.focus()
  }, [])

  function handleScannerInput(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const trimmedNumber = event.currentTarget.value.trim()

    if (!trimmedNumber) {
      return
    }

    onInvoicesChange([...invoices, trimmedNumber])
    event.currentTarget.value = ''
    scannerInputRef.current?.focus()
  }

  function handleRemoveInvoice(index: number) {
    onInvoicesChange(invoices.filter((_, currentIndex) => currentIndex !== index))
    scannerInputRef.current?.focus()
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← Atgal
        </button>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Sąskaitų skenavimas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Skenuokite sąskaitas – kiekvienas numeris bus pridėtas automatiškai.
        </p>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <p>
            <span className="font-medium">Reisas:</span> {trip.tripNumber}
          </p>
          <p className="mt-1">
            <span className="font-medium">Automobilis:</span> {trip.vehiclePlate}
          </p>
          <p className="mt-1">
            <span className="font-medium">Vairuotojas:</span> {trip.driverName}
          </p>
          <p className="mt-1">
            <span className="font-medium">Data:</span> {formatDateWithWeekday(trip.tripDate)}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="invoice-scanner">
            Sąskaitos numeris
          </label>
          <input
            ref={scannerInputRef}
            id="invoice-scanner"
            type="text"
            autoComplete="off"
            placeholder="Skenuokite arba įveskite numerį ir paspauskite Enter"
            onKeyDown={handleScannerInput}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <p className="text-xs text-slate-500">
            Po kiekvieno skenavimo numeris pridedamas automatiškai.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-700">Nuskanuotos sąskaitos</p>
          <InvoiceList
            invoices={invoices}
            onRemove={handleRemoveInvoice}
            emptyMessage="Sąskaitų dar nėra. Pradėkite skenuoti."
          />
        </div>

        <button
          type="button"
          disabled={invoices.length === 0}
          onClick={onSave}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Išsaugoti reisą
        </button>
      </main>
    </div>
  )
}
