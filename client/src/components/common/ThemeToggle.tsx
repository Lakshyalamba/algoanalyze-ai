import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {compact ? null : <span>{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
