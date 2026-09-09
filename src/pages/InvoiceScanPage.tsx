import { useEffect, useRef, useState } from 'react'
import { BarcodeScanner } from '../components/BarcodeScanner'
import { InvoiceList } from '../components/InvoiceList'
import { formatDateWithWeekday } from '../lib/formatDate'
import { type TripDraft } from '../types/trip'

type InvoiceScanPageProps = {
  trip: TripDraft
  invoices: string[]
  onInvoicesChange: (invoices: string[]) => void
  onBack: () => void
  onSave: () => Promise<void>
}

export function InvoiceScanPage({
  trip,
  invoices,
  onInvoicesChange,
  onBack,
  onSave,
}: InvoiceScanPageProps) {
  const scannerInputRef = useRef<HTMLInputElement>(null)
  const [scanPreview, setScanPreview] = useState('')
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function focusScanner() {
    scannerInputRef.current?.focus()
  }

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsCameraOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!isCameraOpen) {
      focusScanner()
    }
  }, [invoices, isCameraOpen])

  function addInvoiceNumber(rawNumber: string) {
    const trimmedNumber = rawNumber.trim()

    if (!trimmedNumber) {
      return
    }

    onInvoicesChange([...invoices, trimmedNumber])
  }

  function handleScannerInput(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    addInvoiceNumber(event.currentTarget.value)
    event.currentTarget.value = ''
    setScanPreview('')
    focusScanner()
  }

  function handleRemoveInvoice(index: number) {
    onInvoicesChange(invoices.filter((_, currentIndex) => currentIndex !== index))
    focusScanner()
  }

  async function handleSave() {
    if (invoices.length === 0 || isSaving) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await onSave()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
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
          <p className="text-sm font-medium text-slate-700">Sąskaitos skenavimas</p>
          <div
            role="presentation"
            onClick={focusScanner}
            className="w-full cursor-text rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-100"
          >
            <p className="text-base font-semibold text-indigo-800">
              {scanPreview ? scanPreview : 'Laukiama skenavimo...'}
            </p>
            <p className="mt-2 text-xs text-indigo-700">
              Skanuokite brūkšninį kodą arba įveskite numerį ir paspauskite Enter.
            </p>
          </div>
          <label htmlFor="invoice-scanner" className="sr-only">
            Sąskaitos numeris
          </label>
          <input
            ref={scannerInputRef}
            id="invoice-scanner"
            type="text"
            autoComplete="off"
            autoFocus
            onChange={(event) => setScanPreview(event.target.value)}
            onBlur={() => {
              if (isCameraOpen) {
                return
              }

              window.setTimeout(() => {
                const activeElement = document.activeElement
                if (activeElement instanceof HTMLButtonElement || activeElement instanceof HTMLAnchorElement) {
                  return
                }
                focusScanner()
              }, 0)
            }}
            onKeyDown={handleScannerInput}
            className="sr-only"
          />

          {isCameraOpen ? (
            <BarcodeScanner
              onDetected={addInvoiceNumber}
              onClose={() => setIsCameraOpen(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              Skenuoti kamera
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-700">Nuskanuotos sąskaitos</p>
          <InvoiceList
            invoices={invoices}
            onRemove={handleRemoveInvoice}
            emptyMessage="Sąskaitų dar nėra. Pradėkite skenuoti."
          />
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          disabled={invoices.length === 0 || isSaving}
          onClick={() => {
            void handleSave()
          }}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? 'Saugoma...' : 'Išsaugoti reisą'}
        </button>
      </main>
    </div>
  )
}
