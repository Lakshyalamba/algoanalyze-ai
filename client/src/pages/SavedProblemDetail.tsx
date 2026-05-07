import { ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BugsPanel } from '../components/dashboard/BugsPanel';
import { DryRunTable } from '../components/dashboard/DryRunTable';
import { QuizPanel } from '../components/dashboard/QuizPanel';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { NotesGenerator } from '../components/notes/NotesGenerator';
import { PageShell } from '../components/PageShell';
import { DSAVisualizer } from '../components/visualizer/DSAVisualizer';
import { useToast } from '../context/ToastContext';
import {
  deleteSavedProblem,
  getSavedProblemById,
  type SavedProblem,
} from '../services/savedProblemApi';
import type { AnalysisResult, BugReport } from '../types/analysis';

function TextSection({ title, children }: { title: string; children?: string | null }) {
  if (!children) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{children}</p>
    </section>
  );
}

function itemToText(item: string | BugReport) {
  if (typeof item === 'string') return item;
  return item.title;
}

function ListSection({ title, items }: { title: string; items?: Array<string | BugReport> | null }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={itemToText(item)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            {itemToText(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

function buildAnalysisResultFromSavedProblem(savedProblem: SavedProblem): AnalysisResult {
  return {
    problemSummary: savedProblem.explanation?.problemSummary ?? '',
    questionExplanation: savedProblem.explanation?.questionExplanation ?? '',
    hinglishExplanation: savedProblem.explanation?.hinglishExplanation ?? '',
    pattern: savedProblem.pattern ?? '',
    difficulty: savedProblem.difficulty ?? '',
    timeComplexity: savedProblem.timeComplexity ?? '',
    spaceComplexity: savedProblem.spaceComplexity ?? '',
    bruteForceApproach: savedProblem.explanation?.bruteForceApproach ?? '',
    betterApproach: savedProblem.explanation?.betterApproach ?? '',
    optimizedApproach: savedProblem.explanation?.optimizedApproach ?? '',
    steps: savedProblem.visualizationSteps ?? [],
    dryRunTable: savedProblem.dryRunTable ?? [],
    bugsOrWarnings: savedProblem.bugsOrWarnings ?? [],
    edgeCases: savedProblem.edgeCases ?? [],
    similarProblems: savedProblem.similarProblems ?? [],
    quizQuestions: savedProblem.quizQuestions ?? [],
  };
}

export function SavedProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [savedProblem, setSavedProblem] = useState<SavedProblem | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSavedProblem() {
      if (!problemId) {
        setError('Saved problem ID is missing.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getSavedProblemById(problemId);

        if (isMounted) {
          setSavedProblem(result);
          setActiveStepIndex(0);
          setError('');
        }
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load saved problem.';
        if (isMounted) {
          setError(message);
          showToast(message, 'error');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadSavedProblem();

    return () => {
      isMounted = false;
    };
  }, [problemId, showToast]);

  async function handleDelete() {
    if (!problemId || isDeleting) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteSavedProblem(problemId);
      showToast('Deleted successfully.', 'success');
      navigate('/history');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete saved problem.';
      setError(message);
      showToast(message, 'error');
      setIsDeleting(false);
    }
  }

  return (
    <PageShell
      title={savedProblem?.title ?? 'Saved Problem'}
      description="Review the saved problem, code, AI analysis, visualization, and dry run."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          to="/history"
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to history
        </Link>
        {savedProblem ? (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => void handleDelete()}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-slate-900"
            aria-label="Delete saved problem"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        ) : null}
      </div>

      <ErrorAlert message={error} />

      {isLoading ? (
        <LoadingSkeleton label="Loading saved problem..." />
      ) : savedProblem ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Pattern" value={savedProblem.pattern ?? 'Unknown'} />
            <InfoCard label="Difficulty" value={savedProblem.difficulty ?? 'Unknown'} />
            <InfoCard label="Time" value={savedProblem.timeComplexity ?? 'Unknown'} />
            <InfoCard label="Space" value={savedProblem.spaceComplexity ?? 'Unknown'} />
          </div>

          <TextSection title="Problem statement">{savedProblem.problemStatement}</TextSection>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Code</h2>
            <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              <code>{savedProblem.code}</code>
            </pre>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextSection title="Sample input">{savedProblem.sampleInput}</TextSection>
            <TextSection title="Expected output">{savedProblem.expectedOutput}</TextSection>
          </div>

          {savedProblem.explanation ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Explanation</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TextBlock title="Problem summary" value={savedProblem.explanation.problemSummary} />
                <TextBlock
                  title="Question explanation"
                  value={savedProblem.explanation.questionExplanation}
                />
                <TextBlock
                  title="Hinglish explanation"
                  value={savedProblem.explanation.hinglishExplanation}
                />
                <TextBlock
                  title="Brute force approach"
                  value={savedProblem.explanation.bruteForceApproach}
                />
                <TextBlock
                  title="Better approach"
                  value={savedProblem.explanation.betterApproach}
                />
                <TextBlock
                  title="Optimized approach"
                  value={savedProblem.explanation.optimizedApproach}
                />
              </div>
            </section>
          ) : null}

          {savedProblem.visualizationSteps && savedProblem.visualizationSteps.length > 0 ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-sm font-semibold text-slate-950 dark:text-slate-100">Visualization</h2>
              <DSAVisualizer
                steps={savedProblem.visualizationSteps}
                activeStepIndex={activeStepIndex}
                codeChangedAfterAnalysis={false}
                onStepChange={setActiveStepIndex}
              />
            </section>
          ) : null}

          {savedProblem.dryRunTable && savedProblem.dryRunTable.length > 0 ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-sm font-semibold text-slate-950 dark:text-slate-100">Dry run table</h2>
              <DryRunTable rows={savedProblem.dryRunTable} />
            </section>
          ) : null}

          {savedProblem.bugsOrWarnings && savedProblem.bugsOrWarnings.length > 0 ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-sm font-semibold text-slate-950 dark:text-slate-100">Bugs or warnings</h2>
              <BugsPanel bugsOrWarnings={savedProblem.bugsOrWarnings} />
            </section>
          ) : null}
          <ListSection title="Edge cases" items={savedProblem.edgeCases} />
          <ListSection title="Similar problems" items={savedProblem.similarProblems} />

          <section>
            <NotesGenerator
              analysisResult={buildAnalysisResultFromSavedProblem(savedProblem)}
              title={savedProblem.title}
              problemStatement={savedProblem.problemStatement ?? ''}
              code={savedProblem.code}
              languageMode="english"
            />
          </section>

          {savedProblem.quizQuestions && savedProblem.quizQuestions.length > 0 ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-sm font-semibold text-slate-950 dark:text-slate-100">Quiz questions</h2>
              <QuizPanel quizQuestions={savedProblem.quizQuestions} />
            </section>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{value}</p>
    </div>
  );
}
