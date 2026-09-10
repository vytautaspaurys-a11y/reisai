import { downloadExcel } from './exportFile'

export async function downloadTripImportTemplate(): Promise<void> {
  await downloadExcel(
    'reisu-sablonas',
    'Reisai',
    [
      { header: 'Numeris', key: 'tripNumber', width: 16 },
      { header: 'Data', key: 'tripDate', width: 14 },
      { header: 'Automobilis', key: 'vehiclePlate', width: 16 },
      { header: 'Vairuotojas', key: 'driverName', width: 24 },
      { header: 'Sąskaita', key: 'invoiceNumber', width: 24 },
      { header: 'Pastabos', key: 'notes', width: 28 },
    ],
    [
      {
        tripNumber: '2026091101',
        tripDate: '2026-09-11',
        vehiclePlate: 'ABC 123',
        driverName: 'Vardas Pavardė',
        invoiceNumber: '123456789012',
        notes: '',
      },
      {
        tripNumber: '2026091101',
        tripDate: '2026-09-11',
        vehiclePlate: 'ABC 123',
        driverName: 'Vardas Pavardė',
        invoiceNumber: '123456789013',
        notes: '',
      },
    ],
  )
}
