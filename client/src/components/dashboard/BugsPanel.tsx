import { CheckCircle2, TriangleAlert } from 'lucide-react';

type BugsPanelProps = {
  bugsOrWarnings: string[];
};

export function BugsPanel({ bugsOrWarnings }: BugsPanelProps) {
  if (bugsOrWarnings.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        No major bugs found.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bugsOrWarnings.map((bug) => (
        <li
          key={bug}
          className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {bug}
        </li>
      ))}
    </ul>
  );
}

