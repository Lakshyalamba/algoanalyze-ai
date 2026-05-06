import { BookOpenCheck, Layers, Timer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { RetryButton } from '../components/common/RetryButton';
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

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getStatsOverview();

      setOverview(result);
      setError('');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load progress stats.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStats();
  }, [loadStats]);

  return (
    <PageShell
      title="Progress"
      description="Track your topic coverage, difficulty mix, and learning patterns from saved analyses."
    >
      <ErrorAlert message={error} />

      {isLoading ? (
        <LoadingSkeleton label="Loading progress stats..." />
      ) : !overview || overview.totalProblems === 0 ? (
        <EmptyState
          title="No progress yet"
          description="Save analyses to unlock topic progress, difficulty mix, and complexity trends."
          action={error ? <RetryButton onRetry={() => void loadStats()} /> : undefined}
        />
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
