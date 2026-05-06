import type { DryRunRow } from '../../types/analysis';

type DryRunTableProps = {
  rows: DryRunRow[];
};

export function DryRunTable({ rows }: DryRunTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Step</th>
              <th className="px-4 py-3">Line</th>
              <th className="px-4 py-3">Variables</th>
              <th className="px-4 py-3">Output</th>
              <th className="px-4 py-3">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr key={row.step}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-950">
                  {row.step}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.line}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {JSON.stringify(row.variables)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.output}</td>
                <td className="px-4 py-3 text-slate-600">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
