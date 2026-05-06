import { ShieldCheck } from 'lucide-react';

type EdgeCasesPanelProps = {
  edgeCases: string[];
};

export function EdgeCasesPanel({ edgeCases }: EdgeCasesPanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {edgeCases.map((edgeCase) => (
        <div
          key={edgeCase}
          className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          {edgeCase}
        </div>
      ))}
    </div>
  );
}
