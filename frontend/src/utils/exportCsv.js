/**
 * CatatCuan CSV Export Utility
 * Exports structured array data directly to a downloadable CSV file.
 * Includes UTF-8 BOM so Microsoft Excel cleanly renders characters and rupiah currency.
 *
 * @param {string} filename - File name without .csv extension
 * @param {Array<{ label: string, key: string | ((row: any) => any) }>} columns
 * @param {Array<object>} rows
 * @returns {boolean} Success status
 */
export function exportToCsv(filename, columns, rows) {
  if (!rows || rows.length === 0) return false

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  // Header row
  const headerRow = columns.map((col) => escapeCell(col.label)).join(';')

  // Data rows
  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        const val = typeof col.key === 'function' ? col.key(row) : row[col.key]
        return escapeCell(val)
      })
      .join(';')
  )

  // Prepend BOM (\uFEFF) for native Excel UTF-8 compatibility
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}

export default exportToCsv

