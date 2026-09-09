import { downloadCsv, downloadExcel } from './exportFile'

export type InvoiceExportRow = {
  tripNumber: string
  tripDate: string
  vehiclePlate: string
  driverName: string
  invoiceNumber: string
}

export function downloadInvoicesCsv(rows: InvoiceExportRow[]): void {
  downloadCsv(
    'saskaitos',
    ['Numeris', 'Data', 'Automobilis', 'Vairuotojas', 'Sąskaitos numeris'],
    rows.map((row) => [
      row.tripNumber,
      row.tripDate,
      row.vehiclePlate,
      row.driverName,
      row.invoiceNumber,
    ]),
  )
}

export async function downloadInvoicesExcel(rows: InvoiceExportRow[]): Promise<void> {
  await downloadExcel(
    'saskaitos',
    'Sąskaitos',
    [
      { header: 'Numeris', key: 'tripNumber', width: 16 },
      { header: 'Data', key: 'tripDate', width: 14 },
      { header: 'Automobilis', key: 'vehiclePlate', width: 16 },
      { header: 'Vairuotojas', key: 'driverName', width: 24 },
      { header: 'Sąskaitos numeris', key: 'invoiceNumber', width: 24 },
    ],
    rows,
  )
}
