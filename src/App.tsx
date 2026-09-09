import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminPlaceholderPage } from './pages/admin/AdminPlaceholderPage'
import { LoginPage } from './pages/admin/LoginPage'
import { ProtectedAdmin } from './pages/admin/ProtectedAdmin'
import { DriversPage } from './pages/admin/DriversPage'
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
          <Route path="trips" element={<AdminPlaceholderPage title="Reisai" />} />
        </Route>
      </Route>
    </Routes>
  )
}
