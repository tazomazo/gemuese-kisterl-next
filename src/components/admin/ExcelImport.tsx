'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Category } from '@/types';
import Button from '@/components/ui/Button';

interface ImportRow {
  name: string;
  price: number;
  unit: string;
  category_id: string | null;
  available: boolean;
}

interface ExcelImportProps {
  categories: Category[];
  onImport: (_rows: ImportRow[]) => Promise<{ imported: number; errors: string[] } | null>;
}

export default function ExcelImport({ categories, onImport }: ExcelImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ImportRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.name.toLowerCase().trim(), c.id])
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null);
    setPreview([]);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);

        const rows: ImportRow[] = raw.map((r, i) => {
          const name = String(r['Name'] ?? r['name'] ?? '').trim();
          const price = parseFloat(String(r['Preis'] ?? r['price'] ?? '0').replace(',', '.'));
          const unit = String(r['Einheit'] ?? r['unit'] ?? 'kg').trim();
          const catName = String(r['Kategorie'] ?? r['category'] ?? '').trim().toLowerCase();
          const available = String(r['Verfügbar'] ?? r['available'] ?? 'ja').toLowerCase() !== 'nein';

          if (!name) throw new Error(`Zeile ${i + 2}: Name fehlt`);
          if (isNaN(price)) throw new Error(`Zeile ${i + 2}: Ungültiger Preis`);

          return {
            name,
            price,
            unit,
            category_id: categoryMap[catName] ?? null,
            available,
          };
        });

        setPreview(rows);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Datei konnte nicht gelesen werden');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    setLoading(true);
    const res = await onImport(preview);
    setResult(res);
    setLoading(false);
    if (res && res.errors.length === 0) {
      setPreview([]);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm text-gray-600">
          Excel-Datei mit den Spalten: <code className="rounded bg-gray-100 px-1">Name</code>,{' '}
          <code className="rounded bg-gray-100 px-1">Preis</code>,{' '}
          <code className="rounded bg-gray-100 px-1">Einheit</code>,{' '}
          <code className="rounded bg-gray-100 px-1">Kategorie</code>,{' '}
          <code className="rounded bg-gray-100 px-1">Verfügbar</code> (optional, Standard: ja)
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-200"
        />
      </div>

      {parseError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{parseError}</p>
      )}

      {preview.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            {preview.length} Zeile{preview.length !== 1 ? 'n' : ''} erkannt
          </p>
          <div className="max-h-48 overflow-auto rounded-lg border text-xs">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Preis</th>
                  <th className="px-3 py-2 text-left">Einheit</th>
                  <th className="px-3 py-2 text-left">Kategorie</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5">{r.name}</td>
                    <td className="px-3 py-1.5 text-right">{r.price.toFixed(2)} €</td>
                    <td className="px-3 py-1.5">{r.unit}</td>
                    <td className="px-3 py-1.5 text-gray-400">
                      {categories.find((c) => c.id === r.category_id)?.name ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-end">
            <Button onClick={handleImport} loading={loading}>
              {preview.length} Produkt{preview.length !== 1 ? 'e' : ''} importieren
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            result.errors.length === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
          }`}
        >
          <p>
            {result.imported} Produkt{result.imported !== 1 ? 'e' : ''} importiert.
          </p>
          {result.errors.map((e, i) => (
            <p key={i} className="text-xs text-red-600">
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
