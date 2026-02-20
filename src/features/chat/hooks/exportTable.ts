// src/shared/utils/exportTable.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel(headers: string[], rows: string[][], filename = 'table') {
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${filename}.xlsx`);
}

export function exportToCSV(headers: string[], rows: string[][], filename = 'table') {
  const data = [headers, ...rows].map(row => row.join(',')).join('\n');
  saveAs(new Blob([data], { type: 'text/csv;charset=utf-8;' }), `${filename}.csv`);
}