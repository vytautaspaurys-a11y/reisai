import { useState } from 'react'
import { InvoiceScanPage } from './pages/InvoiceScanPage'
import { TripFormPage } from './pages/TripFormPage'
import type { TripDraft } from './types/trip'

function App() {
  const [view, setView] = useState<'form' | 'scan'>('form')
  const [tripDraft, setTripDraft] = useState<TripDraft | null>(null)
  const [invoices, setInvoices] = useState<string[]>([])

  if (view === 'scan' && tripDraft) {
    return (
      <InvoiceScanPage
        trip={tripDraft}
        invoices={invoices}
        onInvoicesChange={setInvoices}
        onBack={() => setView('form')}
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
