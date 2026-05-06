import type { ComplexityCount } from '../../services/statsApi';

type ComplexityStatsProps = {
  timeComplexities: ComplexityCount[];
  spaceComplexities: ComplexityCount[];
};

export function ComplexityStats({
  timeComplexities,
  spaceComplexities,
}: ComplexityStatsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Common complexities</h2>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ComplexityList title="Time complexity" items={timeComplexities} />
        <ComplexityList title="Space complexity" items={spaceComplexities} />
      </div>
    </section>
  );
}

function ComplexityList({ title, items }: { title: string; items: ComplexityCount[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.value}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <span className="font-mono text-sm font-semibold text-slate-950 dark:text-slate-100">{item.value}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
