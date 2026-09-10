import { useRef, useState } from 'react'
import { downloadTripImportTemplate } from '../lib/downloadTripImportTemplate'
import { importTripsFromExcel } from '../lib/importTrips'

type TripImportPanelProps = {
  onImported: () => void
}

export function TripImportPanel({ onImported }: TripImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [rowErrors, setRowErrors] = useState<string[]>([])

  async function handleFileChange(file: File | undefined) {
    if (!file || isImporting) {
      return
    }

    setIsImporting(true)
    setSuccessMessage('')
    setErrorMessage('')
    setRowErrors([])

    try {
      const result = await importTripsFromExcel(file)

      if (result.importedCount > 0) {
        setSuccessMessage(`Įkelta reisų: ${result.importedCount}.`)
        onImported()
      }

      if (result.errors.length > 0) {
        setRowErrors(
          result.errors.map((error) => `Eilutė ${error.rowNumber}: ${error.message}`),
        )
        if (result.importedCount === 0) {
          setErrorMessage('Nepavyko įkelti reisų. Pataisykite pažymėtas eilutes.')
        }
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Nepavyko importuoti Excel failo. Bandykite dar kartą.',
      )
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-800">Importuoti iš Excel</p>
      <p className="mt-1 text-sm text-slate-600">
        Lentelėje turi būti stulpeliai Numeris, Data, Automobilis, Vairuotojas, Sąskaita, Pastabos.
        Kiekviena sąskaita rašoma atskiroje eilutėje. Tas pats numeris sujungia eilutes į vieną reisą
        ir lieka programoje.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isImporting}
          onClick={() => {
            void downloadTripImportTemplate()
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:bg-slate-100"
        >
          Atsisiųsti šabloną
        </button>
        <button
          type="button"
          disabled={isImporting}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50 disabled:bg-slate-100"
        >
          {isImporting ? 'Importuojama...' : 'Pasirinkti Excel failą'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(event) => {
            void handleFileChange(event.target.files?.[0])
          }}
        />
      </div>
      {successMessage && (
        <p className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      {rowErrors.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
          {rowErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
