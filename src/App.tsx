import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminTripFormPage } from './pages/admin/AdminTripFormPage'
import { LoginPage } from './pages/admin/LoginPage'
import { ManageTripsPage } from './pages/admin/ManageTripsPage'
import { ProtectedAdmin } from './pages/admin/ProtectedAdmin'
import { DriversPage } from './pages/admin/DriversPage'
import { InvoicesPage } from './pages/admin/InvoicesPage'
import { TripEditPage } from './pages/admin/TripEditPage'
import { TripsPage } from './pages/admin/TripsPage'
import { VehiclesPage } from './pages/admin/VehiclesPage'
import { DriverApp } from './pages/DriverApp'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DriverApp />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="vehicles" replace />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="manage-trips" element={<ManageTripsPage />} />
          <Route path="manage-trips/new" element={<AdminTripFormPage />} />
          <Route path="manage-trips/:tripId" element={<TripEditPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
