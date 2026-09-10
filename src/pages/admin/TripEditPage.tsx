import { Link, useParams } from 'react-router-dom'
import { EditableInvoiceList } from '../../components/EditableInvoiceList'
import { useTripEdit } from '../../hooks/useTripEdit'
import { getRelativeDayLabel, getWeekdayName } from '../../lib/formatDate'

const fieldClassName =
  'rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100'

export function TripEditPage() {
  const { tripId } = useParams()
  const edit = useTripEdit(tripId)
  const relativeDayLabel = edit.tripDate ? getRelativeDayLabel(edit.tripDate) : ''

  if (edit.isLoading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-lg">
        <p className="text-sm text-slate-600">Kraunama...</p>
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

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Taisyti reisą</h1>
      <p className="mt-1 text-sm text-slate-600">
        Galite pataisyti automobilį, vairuotoją, datą, pastabas ir sąskaitų numerius.
      </p>

      {edit.errorMessage && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {edit.errorMessage}
        </p>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={edit.handleSave}>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-sm font-medium text-slate-700">Reiso numeris</p>
          <p className="mt-1 text-lg font-semibold tracking-wide text-slate-900">
            {edit.tripNumber || '—'}
          </p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Automobilis
          <select
            value={edit.vehicleId}
            onChange={(event) => edit.setVehicleId(event.target.value)}
            required
            className={fieldClassName}
          >
            <option value="">Pasirinkite automobilį</option>
            {edit.vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Vairuotojas
          <select
            value={edit.driverId}
            onChange={(event) => edit.setDriverId(event.target.value)}
            required
            className={fieldClassName}
          >
            <option value="">Pasirinkite vairuotoją</option>
            {edit.drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Data
          <input
            type="date"
            value={edit.tripDate}
            onChange={(event) => edit.setTripDate(event.target.value)}
            required
            className={fieldClassName}
          />
          {edit.tripDate && (
            <span className="text-base font-semibold text-indigo-700">
              Pasirinkta diena: {getWeekdayName(edit.tripDate)}
              {relativeDayLabel ? `, ${relativeDayLabel}` : ''}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Pastabos
          <textarea
            value={edit.notes}
            onChange={(event) => edit.setNotes(event.target.value)}
            rows={3}
            className={fieldClassName}
          />
        </label>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-700">Sąskaitos</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={edit.invoiceInput}
              onChange={(event) => edit.setInvoiceInput(event.target.value)}
              onKeyDown={edit.handleInvoiceKeyDown}
              placeholder="Sąskaitos numeris"
              className={`w-full sm:flex-1 ${fieldClassName}`}
            />
            <button
              type="button"
              disabled={!edit.invoiceInput.trim() || edit.isAddingInvoice}
              onClick={() => {
                void edit.handleAddInvoice()
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {edit.isAddingInvoice ? 'Tikrinama...' : 'Pridėti'}
            </button>
          </div>
          <EditableInvoiceList
            invoices={edit.invoices}
            onChange={(index, value) => {
              edit.setInvoices((current) =>
                current.map((invoice, currentIndex) =>
                  currentIndex === index ? value : invoice,
                ),
              )
            }}
            onRemove={(index) => {
              edit.setInvoices((current) =>
                current.filter((_, currentIndex) => currentIndex !== index),
              )
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={!edit.isFormComplete || edit.isSaving || edit.isDeleting}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {edit.isSaving ? 'Saugoma...' : 'Išsaugoti pakeitimus'}
          </button>
          {edit.pendingDelete ? (
            <>
              <button
                type="button"
                disabled={edit.isDeleting}
                onClick={() => {
                  void edit.handleDelete()
                }}
                className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:bg-slate-300"
              >
                {edit.isDeleting ? 'Trinama...' : 'Patvirtinti ištrynimą'}
              </button>
              <button
                type="button"
                onClick={() => edit.setPendingDelete(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Atšaukti
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => edit.setPendingDelete(true)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Ištrinti reisą
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
