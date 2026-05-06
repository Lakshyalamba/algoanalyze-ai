import { Link } from 'react-router-dom';
import type { RecentProblem } from '../../services/statsApi';

type RecentProblemsProps = {
  problems: RecentProblem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function RecentProblems({ problems }: RecentProblemsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Recent saved problems</h2>
      <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/saved-problems/${problem.id}`}
            className="block rounded-md px-2 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-slate-100">{problem.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {problem.pattern} • {problem.difficulty}
                </p>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(problem.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
