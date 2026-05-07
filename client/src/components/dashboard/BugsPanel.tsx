import { CheckCircle2, TriangleAlert } from 'lucide-react';
import type { BugReport } from '../../types/analysis';

type BugsPanelProps = {
  bugsOrWarnings: Array<string | BugReport>;
};

function isBugReport(value: string | BugReport): value is BugReport {
  return typeof value === 'object' && value !== null && 'title' in value;
}

export function BugsPanel({ bugsOrWarnings }: BugsPanelProps) {
  if (bugsOrWarnings.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        No major bugs found.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bugsOrWarnings.map((bug, index) => (
        <li
          key={typeof bug === 'string' ? bug : `${bug.title}-${index}`}
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
        >
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              {isBugReport(bug) ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{bug.title}</p>
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold dark:bg-slate-950/70">
                      {bug.severity}
                    </span>
                  </div>
                  <p className="mt-2">{bug.explanation}</p>
                  {bug.fix ? <p className="mt-2 font-semibold">Fix: {bug.fix}</p> : null}
                  {bug.suggestedCode ? (
                    <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                      <code>{bug.suggestedCode}</code>
                    </pre>
                  ) : null}
                </>
              ) : (
                bug
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
