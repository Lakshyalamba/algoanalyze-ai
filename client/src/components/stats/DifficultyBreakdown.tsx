import type { StatsOverview } from '../../services/statsApi';

type DifficultyBreakdownProps = {
  difficulty: StatsOverview['difficulty'];
};

const colorByDifficulty = {
  Easy: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard: 'bg-red-500',
  Unknown: 'bg-slate-400',
};

export function DifficultyBreakdown({ difficulty }: DifficultyBreakdownProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Difficulty breakdown</h2>
      <div className="mt-5 space-y-4">
        {difficulty.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {item.count} • {item.percentage}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${colorByDifficulty[item.name]}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
