import ExcelJS from 'exceljs'

export function exportFileName(prefix: string, extension: string): string {
  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${prefix}-${year}-${month}-${day}.${extension}`
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string): string {
  if (/[;"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

export function downloadCsv(prefix: string, header: string[], rows: string[][]): void {
  const lines = [header.join(';'), ...rows.map((row) => row.map(escapeCsvCell).join(';'))]
  const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], {
    type: 'text/csv;charset=utf-8',
  })
  downloadBlob(blob, exportFileName(prefix, 'csv'))
}

export async function downloadExcel(
  prefix: string,
  sheetName: string,
  columns: Partial<ExcelJS.Column>[],
  rows: Record<string, string | number>[],
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(sheetName)
  sheet.columns = columns

  for (const row of rows) {
    sheet.addRow(row)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  downloadBlob(blob, exportFileName(prefix, 'xlsx'))
}
