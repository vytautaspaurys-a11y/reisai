import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { InvoiceList } from '../../components/InvoiceList'
import { useActiveLists } from '../../hooks/useActiveLists'
import { getRelativeDayLabel, getWeekdayName } from '../../lib/formatDate'
import { invoiceNumberExists } from '../../lib/invoiceExists'
import { saveTrip } from '../../lib/saveTrip'
import { buildTripNumber } from '../../lib/tripNumber'
import { getTomorrowDate } from '../../types/trip'

const fieldClassName =
  'rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100'

export function AdminTripFormPage() {
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [tripDate, setTripDate] = useState(getTomorrowDate())
  const [notes, setNotes] = useState('')
  const [invoices, setInvoices] = useState<string[]>([])
  const [invoiceInput, setInvoiceInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingInvoice, setIsAddingInvoice] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [savedTripNumber, setSavedTripNumber] = useState('')
  const { vehicles, drivers, isLoading, errorMessage: listsError } = useActiveLists()

  const tripNumber = buildTripNumber(tripDate)
  const relativeDayLabel = getRelativeDayLabel(tripDate)

  function resetForm() {
    setVehicleId('')
    setDriverId('')
    setTripDate(getTomorrowDate())
    setNotes('')
    setInvoices([])
    setInvoiceInput('')
    setErrorMessage('')
    setSavedTripNumber('')
  }

  async function addInvoiceNumber(rawNumber: string): Promise<string | null> {
    const trimmedNumber = rawNumber.trim()

    if (!trimmedNumber) {
      return null
    }

    if (invoices.some((invoice) => invoice.trim() === trimmedNumber)) {
      setErrorMessage('Ši sąskaita jau pridėta prie šio reiso.')
      return null
    }

    const alreadyUsed = await invoiceNumberExists(trimmedNumber)

    if (alreadyUsed) {
      setErrorMessage(`Sąskaitos numeris ${trimmedNumber} jau buvo naudotas kitame reise.`)
      return null
    }

    return trimmedNumber
  }

  async function handleAddInvoice() {
    if (isAddingInvoice) {
      return
    }

    setIsAddingInvoice(true)
    setErrorMessage('')

    try {
      const addedNumber = await addInvoiceNumber(invoiceInput)

      if (!addedNumber) {
        return
      }

      setInvoices((current) => [...current, addedNumber])
      setInvoiceInput('')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nepavyko patikrinti sąskaitos numerio. Bandykite dar kartą.'
      setErrorMessage(message)
    } finally {
      setIsAddingInvoice(false)
    }
  }

  function handleInvoiceKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    void handleAddInvoice()
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSaving) {
      return
    }

    if (isLoading) {
      setErrorMessage('Palaukite, kol bus įkelti automobiliai ir vairuotojai.')
      return
    }

    if (!vehicleId) {
      setErrorMessage('Pasirinkite automobilį.')
      return
    }

    if (!driverId) {
      setErrorMessage('Pasirinkite vairuotoją.')
      return
    }

    if (!tripDate) {
      setErrorMessage('Pasirinkite datą.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      let invoicesToSave = invoices
      const pendingInvoice = invoiceInput.trim()

      if (pendingInvoice) {
        const addedNumber = await addInvoiceNumber(pendingInvoice)

        if (!addedNumber) {
          return
        }

        invoicesToSave = [...invoices, addedNumber]
        setInvoices(invoicesToSave)
        setInvoiceInput('')
      }

      const createdTripNumber = await saveTrip(
        { driverId, vehicleId, tripDate },
        invoicesToSave,
        { notes, allowEmptyInvoices: true },
      )
      setSavedTripNumber(createdTripNumber)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (savedTripNumber) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Reisas išsaugotas</h1>
        <p className="mt-2 text-sm text-slate-600">
          Reisas <span className="font-semibold text-slate-900">{savedTripNumber}</span> sėkmingai
          išsaugotas.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Registruoti kitą reisą
          </button>
          <Link
            to="/admin/manage-trips"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Atgal
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <Link
        to="/admin/manage-trips"
        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
      >
        ← Atgal
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Naujas reisas</h1>
      <p className="mt-1 text-sm text-slate-600">
        Sąskaitas pridėti nebūtina – reisą galima išsaugoti ir be jų.
      </p>

      {(errorMessage || listsError) && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage || listsError}
        </p>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSave}>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-sm font-medium text-slate-700">Reiso numeris</p>
          <p className="mt-1 text-lg font-semibold tracking-wide text-slate-900">{tripNumber}</p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Automobilis
          <select
            value={vehicleId}
            disabled={isLoading || Boolean(listsError)}
            onChange={(event) => setVehicleId(event.target.value)}
            required
            className={fieldClassName}
          >
            <option value="">{isLoading ? 'Kraunama...' : 'Pasirinkite automobilį'}</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plateNumber}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Vairuotojas
          <select
            value={driverId}
            disabled={isLoading || Boolean(listsError)}
            onChange={(event) => setDriverId(event.target.value)}
            required
            className={fieldClassName}
          >
            <option value="">{isLoading ? 'Kraunama...' : 'Pasirinkite vairuotoją'}</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Data
          <input
            type="date"
            value={tripDate}
            onChange={(event) => setTripDate(event.target.value)}
            required
            className={fieldClassName}
          />
          {tripDate && (
            <span className="text-base font-semibold text-indigo-700">
              Pasirinkta diena: {getWeekdayName(tripDate)}
              {relativeDayLabel ? `, ${relativeDayLabel}` : ''}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Pastabos
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className={fieldClassName}
          />
        </label>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-700">Sąskaitos</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={invoiceInput}
              onChange={(event) => setInvoiceInput(event.target.value)}
              onKeyDown={handleInvoiceKeyDown}
              placeholder="Sąskaitos numeris"
              className={`w-full sm:flex-1 ${fieldClassName}`}
            />
            <button
              type="button"
              disabled={!invoiceInput.trim() || isAddingInvoice}
              onClick={() => {
                void handleAddInvoice()
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {isAddingInvoice ? 'Tikrinama...' : 'Pridėti'}
            </button>
          </div>
          <InvoiceList
            invoices={invoices}
            onRemove={(index) => {
              setInvoices((current) =>
                current.filter((_, currentIndex) => currentIndex !== index),
              )
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? 'Saugoma...' : 'Išsaugoti reisą'}
        </button>
      </form>
    </section>
  )
}
