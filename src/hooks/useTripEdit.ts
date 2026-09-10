import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoiceNumberExists } from '../lib/invoiceExists'
import { supabase } from '../lib/supabase'
import { deleteAdminTrip, updateAdminTrip } from '../lib/updateTrip'

export type ListOption = {
  id: string
  label: string
}

export function useTripEdit(tripId: string | undefined) {
  const navigate = useNavigate()
  const [tripNumber, setTripNumber] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [tripDate, setTripDate] = useState('')
  const [notes, setNotes] = useState('')
  const [invoices, setInvoices] = useState<string[]>([])
  const [invoiceInput, setInvoiceInput] = useState('')
  const [vehicles, setVehicles] = useState<ListOption[]>([])
  const [drivers, setDrivers] = useState<ListOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingInvoice, setIsAddingInvoice] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isFormComplete = Boolean(tripId && vehicleId && driverId && tripDate && !isLoading)

  useEffect(() => {
    async function loadTrip() {
      if (!tripId) {
        setErrorMessage('Reisas nerastas.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const [tripResult, vehiclesResult, driversResult] = await Promise.all([
          supabase
            .from('trips')
            .select('trip_number, trip_date, notes, driver_id, vehicle_id, invoices(invoice_number)')
            .eq('id', tripId)
            .order('created_at', { referencedTable: 'invoices', ascending: true })
            .single(),
          supabase.from('vehicles').select('id, plate_number').order('plate_number'),
          supabase.from('drivers').select('id, name').order('name'),
        ])

        if (tripResult.error || !tripResult.data) {
          throw tripResult.error ?? new Error('Reisas nerastas.')
        }

        if (vehiclesResult.error || driversResult.error) {
          throw vehiclesResult.error ?? driversResult.error
        }

        const trip = tripResult.data
        setTripNumber(trip.trip_number)
        setVehicleId(trip.vehicle_id)
        setDriverId(trip.driver_id)
        setTripDate(trip.trip_date)
        setNotes(trip.notes ?? '')
        setInvoices((trip.invoices ?? []).map((invoice) => invoice.invoice_number))
        setVehicles(
          (vehiclesResult.data ?? []).map((row) => ({
            id: row.id,
            label: row.plate_number,
          })),
        )
        setDrivers(
          (driversResult.data ?? []).map((row) => ({
            id: row.id,
            label: row.name,
          })),
        )
      } catch {
        setErrorMessage('Nepavyko įkelti reiso. Bandykite dar kartą.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTrip()
  }, [tripId])

  async function handleAddInvoice() {
    const trimmedNumber = invoiceInput.trim()

    if (!trimmedNumber || isAddingInvoice || !tripId) {
      return
    }

    if (invoices.some((invoice) => invoice.trim() === trimmedNumber)) {
      setErrorMessage('Ši sąskaita jau pridėta prie šio reiso.')
      return
    }

    setIsAddingInvoice(true)
    setErrorMessage('')

    try {
      const alreadyUsed = await invoiceNumberExists(trimmedNumber, { excludeTripId: tripId })

      if (alreadyUsed) {
        setErrorMessage(`Sąskaitos numeris ${trimmedNumber} jau buvo naudotas kitame reise.`)
        return
      }

      setInvoices((current) => [...current, trimmedNumber])
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

    if (!tripId || !isFormComplete || isSaving) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await updateAdminTrip({
        tripId,
        driverId,
        vehicleId,
        tripDate,
        notes,
        invoices,
      })
      navigate('/admin/manage-trips')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko išsaugoti reiso. Bandykite dar kartą.'
      setErrorMessage(message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!tripId || isDeleting) {
      return
    }

    setIsDeleting(true)
    setErrorMessage('')

    try {
      await deleteAdminTrip(tripId)
      navigate('/admin/manage-trips')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nepavyko ištrinti reiso. Bandykite dar kartą.'
      setErrorMessage(message)
      setPendingDelete(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    tripNumber,
    vehicleId,
    setVehicleId,
    driverId,
    setDriverId,
    tripDate,
    setTripDate,
    notes,
    setNotes,
    invoices,
    setInvoices,
    invoiceInput,
    setInvoiceInput,
    vehicles,
    drivers,
    isLoading,
    isSaving,
    isAddingInvoice,
    isDeleting,
    pendingDelete,
    setPendingDelete,
    errorMessage,
    isFormComplete,
    handleAddInvoice,
    handleInvoiceKeyDown,
    handleSave,
    handleDelete,
  }
}
