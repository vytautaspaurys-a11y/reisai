import { useState } from 'react'
import { TripSuccessMessage } from './components/TripSuccessMessage'
import { saveTrip } from './lib/saveTrip'
import { InvoiceScanPage } from './pages/InvoiceScanPage'
import { TripFormPage } from './pages/TripFormPage'
import type { TripDraft } from './types/trip'

function App() {
  const [view, setView] = useState<'form' | 'scan' | 'success'>('form')
  const [tripDraft, setTripDraft] = useState<TripDraft | null>(null)
  const [invoices, setInvoices] = useState<string[]>([])
  const [savedTripNumber, setSavedTripNumber] = useState('')

  function handleNewTrip() {
    setView('form')
    setTripDraft(null)
    setInvoices([])
    setSavedTripNumber('')
  }

  if (view === 'success' && savedTripNumber) {
    return <TripSuccessMessage tripNumber={savedTripNumber} onNewTrip={handleNewTrip} />
  }

  if (view === 'scan' && tripDraft) {
    return (
      <InvoiceScanPage
        trip={tripDraft}
        invoices={invoices}
        onInvoicesChange={setInvoices}
        onBack={() => setView('form')}
        onSave={async () => {
          const tripNumber = await saveTrip(tripDraft, invoices)
          setSavedTripNumber(tripNumber)
          setView('success')
        }}
      />
    )
  }

  return (
    <TripFormPage
      initialValues={tripDraft}
      onStartScanning={(draft) => {
        setTripDraft(draft)
        setView('scan')
      }}
    />
  )
}

export default App
