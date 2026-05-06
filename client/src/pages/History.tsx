import { Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import {
  deleteSavedProblem,
  getSavedProblems,
  type SavedProblemListItem,
} from '../services/savedProblemApi';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function History() {
  const [savedProblems, setSavedProblems] = useState<SavedProblemListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSavedProblems() {
      try {
        const result = await getSavedProblems();

        if (isMounted) {
          setSavedProblems(result);
          setError('');
        }
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load saved problems.';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadSavedProblems();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDelete(id: string) {
    if (deletingId) return;

    setDeletingId(id);
    setError('');

    try {
      await deleteSavedProblem(id);
      setSavedProblems((currentProblems) =>
        currentProblems.filter((problem) => problem.id !== id),
      );
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete saved problem.';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageShell title="History" description="Review your saved AI analyses and DSA notes.">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading saved problems...
        </div>
      ) : savedProblems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No saved problems yet. Analyze a problem from the dashboard, then save it here.
        </div>
      ) : (
        <div className="grid gap-4">
          {savedProblems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-950">{problem.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Saved on {formatDate(problem.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/saved-problems/${problem.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === problem.id}
                    onClick={() => void handleDelete(problem.id)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {deletingId === problem.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoPill label="Pattern" value={problem.pattern ?? 'Unknown'} />
                <InfoPill label="Difficulty" value={problem.difficulty ?? 'Unknown'} />
                <InfoPill label="Time" value={problem.timeComplexity ?? 'Unknown'} />
                <InfoPill label="Space" value={problem.spaceComplexity ?? 'Unknown'} />
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
