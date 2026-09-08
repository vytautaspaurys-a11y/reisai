import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type VehicleOption = {
  id: string
  plateNumber: string
}

export type DriverOption = {
  id: string
  name: string
}

export function useActiveLists() {
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [drivers, setDrivers] = useState<DriverOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadLists() {
      try {
        const [vehiclesResult, driversResult] = await Promise.all([
          supabase
            .from('vehicles')
            .select('id, plate_number')
            .eq('is_active', true)
            .order('plate_number'),
          supabase.from('drivers').select('id, name').eq('is_active', true).order('name'),
        ])

        if (vehiclesResult.error) {
          throw vehiclesResult.error
        }

        if (driversResult.error) {
          throw driversResult.error
        }

        setVehicles(
          (vehiclesResult.data ?? []).map((row) => ({
            id: row.id,
            plateNumber: row.plate_number,
          })),
        )
        setDrivers(
          (driversResult.data ?? []).map((row) => ({
            id: row.id,
            name: row.name,
          })),
        )
        setErrorMessage('')
      } catch {
        setErrorMessage('Nepavyko įkelti automobilių ir vairuotojų. Bandykite dar kartą.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLists()
  }, [])

  return { vehicles, drivers, isLoading, errorMessage }
}
