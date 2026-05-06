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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Recent saved problems</h2>
      <div className="mt-4 divide-y divide-slate-200">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/saved-problems/${problem.id}`}
            className="block py-3 transition hover:bg-slate-50"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{problem.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {problem.pattern} • {problem.difficulty}
                </p>
              </div>
              <span className="text-sm text-slate-500">{formatDate(problem.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
