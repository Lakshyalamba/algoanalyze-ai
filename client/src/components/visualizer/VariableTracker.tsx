import { displayValue } from './visualizerUtils';

type VariableTrackerProps = {
  variables: Record<string, unknown>;
};

export function VariableTracker({ variables }: VariableTrackerProps) {
  const entries = Object.entries(variables ?? {});

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        No variables tracked for this step.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Variable</th>
            <th className="px-4 py-3">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-950">{key}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-700">{displayValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

