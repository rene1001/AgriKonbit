// Simple export utilities for CSV and PDF-like (print) without extra deps

export function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) {
    console.warn('No data to export');
    return;
  }
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const escape = (val) => {
    if (val == null) return '';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };
  const csv = [headers.map(escape).join(',')]
    .concat(rows.map((row) => headers.map((h) => escape(row[h])).join(',')))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Minimal PDF-like export by opening a print window; user can "Save as PDF"
export function exportToPrintableHTML(title, htmlContent) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.open();
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${
    title || 'Export'
  }</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;}th{background:#f3f4f6;text-align:left}</style></head><body>${
    htmlContent || ''
  }</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
