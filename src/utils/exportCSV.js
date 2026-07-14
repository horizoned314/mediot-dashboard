/**
 * Export an array of objects to a CSV file download.
 * @param {Array<object>} rows
 * @param {string} filename
 */
export function exportCSV(rows, filename = 'data.csv') {
  if (!rows || rows.length === 0) return;

  // Build header from first row keys (filter internal _ keys)
  const keys = Object.keys(rows[0]).filter(k => !k.startsWith('_'));
  const header = keys.join(',');

  const body = rows.map(row =>
    keys.map(k => {
      const val = row[k] ?? '';
      // Wrap in quotes if contains comma or newline
      const str = String(val);
      return str.includes(',') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  ).join('\n');

  const csv     = `${header}\n${body}`;
  const blob    = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url     = URL.createObjectURL(blob);
  const anchor  = document.createElement('a');
  anchor.href   = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
