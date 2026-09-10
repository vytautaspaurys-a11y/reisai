import ExcelJS from 'exceljs'

export type TripImportError = {
  rowNumber: number
  message: string
}

type ImportField = 'number' | 'date' | 'driver' | 'vehicle' | 'invoice' | 'notes'

type ParsedInvoiceRow = {
  rowNumber: number
  tripNumber: string
  tripDate: string
  driverName: string
  vehiclePlate: string
  invoice: string
  notes: string
}

export type GroupedTrip = {
  rowNumber: number
  tripNumber: string
  tripDate: string
  driverName: string
  vehiclePlate: string
  notes: string
  invoices: string[]
}

const HEADER_ALIASES: Record<string, ImportField> = {
  numeris: 'number',
  tripnumber: 'number',
  number: 'number',
  data: 'date',
  date: 'date',
  tripdate: 'date',
  vairuotojas: 'driver',
  driver: 'driver',
  automobilis: 'vehicle',
  vehicle: 'vehicle',
  saskaita: 'invoice',
  saskaitosnumeris: 'invoice',
  invoice: 'invoice',
  invoicenumber: 'invoice',
  pastabos: 'notes',
  pastaba: 'notes',
  notes: 'notes',
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll('ą', 'a')
    .replaceAll('č', 'c')
    .replaceAll('ę', 'e')
    .replaceAll('ė', 'e')
    .replaceAll('į', 'i')
    .replaceAll('š', 's')
    .replaceAll('ų', 'u')
    .replaceAll('ū', 'u')
    .replaceAll('ž', 'z')
    .replaceAll(/[^a-z0-9]+/g, '')
}

export function normalizeName(value: string): string {
  return value.trim().toLowerCase().replaceAll(/\s+/g, ' ')
}

export function normalizePlate(value: string): string {
  return value.trim().toUpperCase().replaceAll(/\s+/g, '')
}

function getCellText(cell: ExcelJS.Cell): string {
  const value = cell.value

  if (value == null || value instanceof Date) {
    return ''
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'object') {
    if ('text' in value && typeof value.text === 'string') {
      return value.text.trim()
    }

    if ('result' in value && value.result != null && !(value.result instanceof Date)) {
      return String(value.result).trim()
    }

    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join('').trim()
    }
  }

  return ''
}

function toIsoDate(year: number, month: number, day: number): string | null {
  if (!year || !month || !day) {
    return null
  }

  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateString(raw: string): string | null {
  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (isoMatch) {
    return toIsoDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]))
  }

  const ltMatch = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (ltMatch) {
    return toIsoDate(Number(ltMatch[3]), Number(ltMatch[2]), Number(ltMatch[1]))
  }

  return null
}

function getCellDate(cell: ExcelJS.Cell): string | null {
  const value = cell.value

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toIsoDate(value.getFullYear(), value.getMonth() + 1, value.getDate())
  }

  if (typeof value === 'number') {
    const excelEpoch = Date.UTC(1899, 11, 30) + value * 86400000
    const date = new Date(excelEpoch)
    return toIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
  }

  if (typeof value === 'object' && value && 'result' in value && value.result instanceof Date) {
    return toIsoDate(
      value.result.getFullYear(),
      value.result.getMonth() + 1,
      value.result.getDate(),
    )
  }

  const text = getCellText(cell)
  return text ? parseDateString(text) : null
}

async function parseWorkbook(file: File): Promise<ParsedInvoiceRow[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(await file.arrayBuffer())
  const sheet = workbook.worksheets[0]

  if (!sheet) {
    throw new Error('Excel faile nėra lapo su duomenimis.')
  }

  const headerRow = sheet.getRow(1)
  const columnMap = new Map<number, ImportField>()

  headerRow.eachCell((cell, columnNumber) => {
    const alias = HEADER_ALIASES[normalizeHeader(getCellText(cell))]
    if (alias) {
      columnMap.set(columnNumber, alias)
    }
  })

  const mapped = new Set(columnMap.values())
  if (
    !mapped.has('number') ||
    !mapped.has('date') ||
    !mapped.has('driver') ||
    !mapped.has('vehicle') ||
    !mapped.has('invoice') ||
    !mapped.has('notes')
  ) {
    throw new Error(
      'Pirma eilutė turi turėti stulpelius: Numeris, Data, Automobilis, Vairuotojas, Sąskaita, Pastabos. Galite atsisiųsti šabloną.',
    )
  }

  const rows: ParsedInvoiceRow[] = []

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }

    const values: Partial<Record<ImportField, ExcelJS.Cell>> = {}

    columnMap.forEach((field, columnNumber) => {
      values[field] = row.getCell(columnNumber)
    })

    const tripNumber = values.number ? getCellText(values.number) : ''
    const driverName = values.driver ? getCellText(values.driver) : ''
    const vehiclePlate = values.vehicle ? getCellText(values.vehicle) : ''
    const invoice = values.invoice ? getCellText(values.invoice) : ''
    const notes = values.notes ? getCellText(values.notes) : ''
    const tripDate = values.date ? getCellDate(values.date) : null

    if (!tripNumber && !driverName && !vehiclePlate && !invoice && !notes && !tripDate) {
      return
    }

    rows.push({
      rowNumber,
      tripNumber,
      tripDate: tripDate ?? '',
      driverName,
      vehiclePlate,
      invoice,
      notes,
    })
  })

  if (rows.length === 0) {
    throw new Error('Excel faile nėra reisų eilučių.')
  }

  return rows
}

function groupRowsByTripNumber(rows: ParsedInvoiceRow[]): {
  groups: GroupedTrip[]
  errors: TripImportError[]
} {
  const groups = new Map<string, GroupedTrip>()
  const errors: TripImportError[] = []
  const failedKeys = new Set<string>()

  for (const row of rows) {
    if (!row.tripNumber) {
      errors.push({ rowNumber: row.rowNumber, message: 'Nenurodytas reiso numeris.' })
      continue
    }

    const key = row.tripNumber.trim()
    const existing = groups.get(key)

    if (!existing) {
      groups.set(key, {
        rowNumber: row.rowNumber,
        tripNumber: key,
        tripDate: row.tripDate,
        driverName: row.driverName,
        vehiclePlate: row.vehiclePlate,
        notes: row.notes,
        invoices: row.invoice ? [row.invoice] : [],
      })
      continue
    }

    if (existing.tripDate !== row.tripDate) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Numeris ${key}: data nesutampa su ankstesnėmis eilutėmis.`,
      })
      failedKeys.add(key)
      continue
    }

    if (normalizeName(existing.driverName) !== normalizeName(row.driverName)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Numeris ${key}: vairuotojas nesutampa su ankstesnėmis eilutėmis.`,
      })
      failedKeys.add(key)
      continue
    }

    if (normalizePlate(existing.vehiclePlate) !== normalizePlate(row.vehiclePlate)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Numeris ${key}: automobilis nesutampa su ankstesnėmis eilutėmis.`,
      })
      failedKeys.add(key)
      continue
    }

    if (row.notes && existing.notes && row.notes !== existing.notes) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Numeris ${key}: pastabos nesutampa su ankstesnėmis eilutėmis.`,
      })
      failedKeys.add(key)
      continue
    }

    if (row.notes && !existing.notes) {
      existing.notes = row.notes
    }

    if (row.invoice) {
      existing.invoices.push(row.invoice)
    }
  }

  return {
    groups: [...groups.entries()]
      .filter(([key]) => !failedKeys.has(key))
      .map(([, group]) => group),
    errors,
  }
}

export async function parseTripImportExcel(file: File): Promise<{
  groups: GroupedTrip[]
  errors: TripImportError[]
}> {
  const rows = await parseWorkbook(file)
  return groupRowsByTripNumber(rows)
}
