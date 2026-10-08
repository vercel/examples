export type CsvValue = string | number | boolean | null | undefined | Date

function escapeCell(value: CsvValue): string {
  if (value === null || value === undefined) return ''
  const text = value instanceof Date ? value.toISOString() : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** RFC 4180 CSV with a header row; `columns` fixes the column order. */
export function toCsv(
  rows: ReadonlyArray<Record<string, CsvValue>>,
  columns: ReadonlyArray<string>
): string {
  const lines = [columns.map(escapeCell).join(',')]
  for (const row of rows) {
    lines.push(columns.map((column) => escapeCell(row[column])).join(','))
  }
  return `${lines.join('\r\n')}\r\n`
}
