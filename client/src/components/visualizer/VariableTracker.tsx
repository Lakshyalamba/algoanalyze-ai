import { displayValue } from './visualizerUtils';

type VariableTrackerProps = {
  variables: Record<string, unknown>;
};

export function VariableTracker({ variables }: VariableTrackerProps) {
  const entries = Object.entries(variables ?? {});

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        No variables tracked for this step.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Variable Tracker</h3>
      </div>
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Variable</th>
            <th className="px-4 py-3">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-950 dark:text-slate-100">{key}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{displayValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
