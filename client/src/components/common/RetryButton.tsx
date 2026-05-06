import { RotateCcw } from 'lucide-react';

type RetryButtonProps = {
  onRetry: () => void;
  label?: string;
};

export function RetryButton({ onRetry, label = 'Retry' }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
