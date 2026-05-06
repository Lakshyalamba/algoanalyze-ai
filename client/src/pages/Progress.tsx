import { BookOpenCheck, Layers, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ComplexityStats } from '../components/stats/ComplexityStats';
import { DifficultyBreakdown } from '../components/stats/DifficultyBreakdown';
import { RecentProblems } from '../components/stats/RecentProblems';
import { StatsCard } from '../components/stats/StatsCard';
import { TopicProgress } from '../components/stats/TopicProgress';
import { PageShell } from '../components/PageShell';
import { getStatsOverview, type StatsOverview } from '../services/statsApi';

export function Progress() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const result = await getStatsOverview();

        if (isMounted) {
          setOverview(result);
          setError('');
        }
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load progress stats.';
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageShell
      title="Progress"
      description="Track your topic coverage, difficulty mix, and learning patterns from saved analyses."
    >
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading progress stats...
        </div>
      ) : !overview || overview.totalProblems === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Save some analyses to see your progress.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              label="Total saved"
              value={overview.totalProblems}
              description="Saved analyses in your learning history."
              icon={BookOpenCheck}
            />
            <StatsCard
              label="Topics covered"
              value={overview.topics.length}
              description="Distinct DSA patterns from saved problems."
              icon={Layers}
            />
            <StatsCard
              label="Recent activity"
              value={overview.recentProblems.length}
              description="Latest saved analyses shown below."
              icon={Timer}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <TopicProgress topics={overview.topics} />
            <DifficultyBreakdown difficulty={overview.difficulty} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RecentProblems problems={overview.recentProblems} />
            <ComplexityStats
              timeComplexities={overview.complexityStats.commonTimeComplexities}
              spaceComplexities={overview.complexityStats.commonSpaceComplexities}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}
