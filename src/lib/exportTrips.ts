import { downloadCsv, downloadExcel } from './exportFile'

export type TripExportRow = {
  tripNumber: string
  tripDate: string
  driverName: string
  vehiclePlate: string
  invoiceCount: number
}

export function downloadTripsCsv(rows: TripExportRow[]): void {
  downloadCsv(
    'reisai',
    ['Numeris', 'Data', 'Vairuotojas', 'Automobilis', 'Sąskaitos'],
    rows.map((row) => [
      row.tripNumber,
      row.tripDate,
      row.driverName,
      row.vehiclePlate,
      String(row.invoiceCount),
    ]),
  )
}

export async function downloadTripsExcel(rows: TripExportRow[]): Promise<void> {
  await downloadExcel(
    'reisai',
    'Reisai',
    [
      { header: 'Numeris', key: 'tripNumber', width: 16 },
      { header: 'Data', key: 'tripDate', width: 14 },
      { header: 'Vairuotojas', key: 'driverName', width: 24 },
      { header: 'Automobilis', key: 'vehiclePlate', width: 16 },
      { header: 'Sąskaitos', key: 'invoiceCount', width: 12 },
    ],
    rows,
  )
}
