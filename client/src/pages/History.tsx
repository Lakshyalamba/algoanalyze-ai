import { Eye, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { RetryButton } from '../components/common/RetryButton';
import { PageShell } from '../components/PageShell';
import { useToast } from '../context/ToastContext';
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
  const { showToast } = useToast();
  const [savedProblems, setSavedProblems] = useState<SavedProblemListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredProblems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return savedProblems
      .filter((problem) => {
        const matchesSearch =
          !normalizedQuery ||
          problem.title.toLowerCase().includes(normalizedQuery) ||
          (problem.pattern ?? '').toLowerCase().includes(normalizedQuery);
        const matchesDifficulty =
          difficultyFilter === 'all' ||
          (problem.difficulty ?? 'Unknown').toLowerCase() === difficultyFilter;

        return matchesSearch && matchesDifficulty;
      })
      .sort((first, second) => {
        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();
        return sortOrder === 'newest' ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [difficultyFilter, savedProblems, searchQuery, sortOrder]);

  const loadSavedProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getSavedProblems();

      setSavedProblems(result);
      setError('');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load saved problems.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSavedProblems();
  }, [loadSavedProblems]);

  async function handleDelete(id: string) {
    if (deletingId) return;

    setDeletingId(id);
    setError('');

    try {
      await deleteSavedProblem(id);
      setSavedProblems((currentProblems) =>
        currentProblems.filter((problem) => problem.id !== id),
      );
      showToast('Deleted successfully.', 'success');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete saved problem.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageShell title="History" description="Search, filter, and revisit your saved AI analyses.">
      <ErrorAlert message={error} />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_160px]">
          <label className="relative block">
            <span className="sr-only">Search saved analyses</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Search by title or pattern"
            />
          </label>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Filter by difficulty"
          >
            <option value="all">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="unknown">Unknown</option>
          </select>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as 'newest' | 'oldest')}
            className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Sort saved analyses"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </section>

      {isLoading ? (
        <LoadingSkeleton label="Loading saved problems..." />
      ) : savedProblems.length === 0 ? (
        <EmptyState
          title="No saved analyses yet"
          description="Analyze and save your first problem."
        />
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          title="No matching analyses"
          description="No saved analyses match your filters."
          action={<RetryButton label="Clear filters" onRetry={() => {
            setSearchQuery('');
            setDifficultyFilter('all');
            setSortOrder('newest');
          }} />}
        />
      ) : (
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">{problem.title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Saved on {formatDate(problem.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/saved-problems/${problem.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === problem.id}
                    onClick={() => void handleDelete(problem.id)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-slate-950"
                    aria-label={`Delete ${problem.title}`}
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
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}
