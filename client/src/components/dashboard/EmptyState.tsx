import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-100">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-100">Ready to analyze</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
        Add a problem statement and Python solution, then run analysis to unlock explanation,
        visualizer, chatbot, bugs, quiz, and notes.
      </p>
    </div>
  );
}
