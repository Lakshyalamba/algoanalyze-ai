import type { StatsGroup } from '../../services/statsApi';

type TopicProgressProps = {
  topics: StatsGroup[];
};

export function TopicProgress({ topics }: TopicProgressProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Topic-wise progress</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Grouped dynamically from saved problem patterns.</p>
      </div>

      <div className="mt-5 space-y-4">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{topic.name}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {topic.count} saved • {topic.percentage}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
