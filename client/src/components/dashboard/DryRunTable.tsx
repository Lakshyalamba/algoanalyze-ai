import type { DryRunRow } from '../../types/analysis';

type DryRunTableProps = {
  rows: DryRunRow[];
};

export function DryRunTable({ rows }: DryRunTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Step</th>
              <th className="px-4 py-3">Line</th>
              <th className="px-4 py-3">Variables</th>
              <th className="px-4 py-3">Output</th>
              <th className="px-4 py-3">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
            {rows.map((row) => (
              <tr key={row.step}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-950 dark:text-slate-100">
                  {row.step}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{row.line}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {JSON.stringify(row.variables)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{row.output}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
