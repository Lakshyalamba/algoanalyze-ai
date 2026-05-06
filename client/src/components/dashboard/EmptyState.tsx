import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">Ready to analyze</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
        Add a problem statement and Python solution, then run a mock analysis preview.
      </p>
    </div>
  );
}

