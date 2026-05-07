import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { AnalysisTabs, type AnalysisTab } from '../components/dashboard/AnalysisTabs';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { InputPanel } from '../components/dashboard/InputPanel';
import { PageShell } from '../components/PageShell';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createMockAnalysis } from '../lib/mockAnalysis';
import { analyzeCode } from '../services/api';
import { saveProblem } from '../services/savedProblemApi';
import type { AnalysisResult, LanguageMode } from '../types/analysis';

const starterCode = `class Solution:
    def solve(self):
        pass
`;

const dashboardDraftStorageKey = 'algoanalyze_dashboard_draft';

type DashboardDraft = {
  title: string;
  problemStatement: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  activeTab: AnalysisTab;
  analysisResult: AnalysisResult | null;
  activeStepIndex: number;
  analyzedCode: string | null;
};

function loadDashboardDraft(): Partial<DashboardDraft> {
  try {
    const rawDraft = localStorage.getItem(dashboardDraftStorageKey);
    if (!rawDraft) return {};
    const parsed = JSON.parse(rawDraft) as Partial<DashboardDraft>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function Dashboard() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [draftLoaded] = useState(loadDashboardDraft);
  const [title, setTitle] = useState(draftLoaded.title ?? '');
  const [problemStatement, setProblemStatement] = useState(draftLoaded.problemStatement ?? '');
  const [code, setCode] = useState(draftLoaded.code ?? starterCode);
  const [sampleInput, setSampleInput] = useState(draftLoaded.sampleInput ?? '');
  const [expectedOutput, setExpectedOutput] = useState(draftLoaded.expectedOutput ?? '');
  const languageMode: LanguageMode = 'english';
  const [activeTab, setActiveTab] = useState<AnalysisTab>(draftLoaded.activeTab ?? 'explanation');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    draftLoaded.analysisResult ?? null,
  );
  const [activeStepIndex, setActiveStepIndex] = useState(draftLoaded.activeStepIndex ?? 0);
  const [analyzedCode, setAnalyzedCode] = useState<string | null>(draftLoaded.analyzedCode ?? null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const codeChangedAfterAnalysis =
    analysisResult !== null && analyzedCode !== null && code !== analyzedCode;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const draft: DashboardDraft = {
        title,
        problemStatement,
        code,
        sampleInput,
        expectedOutput,
        activeTab,
        analysisResult,
        activeStepIndex,
        analyzedCode,
      };

      try {
        localStorage.setItem(dashboardDraftStorageKey, JSON.stringify(draft));
      } catch {
        // Avoid interrupting editing if storage quota or privacy settings block persistence.
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [
    activeStepIndex,
    activeTab,
    analysisResult,
    analyzedCode,
    code,
    expectedOutput,
    problemStatement,
    sampleInput,
    title,
  ]);

  async function handleAnalyze() {
    if (!problemStatement.trim()) {
      setError('Add a problem statement before analysis.');
      showToast('Problem statement is required.', 'error');
      return;
    }

    if (!code.trim()) {
      setError('Add Python code before analysis.');
      showToast('Code is required.', 'error');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeCode(
        {
          title,
          problemStatement,
          code,
          sampleInput,
          expectedOutput,
          languageMode,
        },
        token,
      );

      setAnalysisResult(result);
      setActiveStepIndex(0);
      setAnalyzedCode(code);
      setSaveMessage('');
      setSaveError('');
      setActiveTab('explanation');
      showToast('Analysis completed.', 'success');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to analyze code.';

      if (message.toLowerCase().includes('failed to fetch')) {
        setAnalysisResult(
          createMockAnalysis({
            title,
            problemStatement,
            sampleInput,
            expectedOutput,
          }),
        );
        setActiveStepIndex(0);
        setAnalyzedCode(code);
        setSaveMessage('');
        setSaveError('');
        setActiveTab('explanation');
        setError('Backend is unavailable. Showing a local development fallback response.');
        showToast('Backend unavailable. Showing fallback analysis.', 'info');
        return;
      }

      setError(message);
      showToast('Analysis failed.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleClear() {
    setTitle('');
    setProblemStatement('');
    setCode(starterCode);
    setSampleInput('');
    setExpectedOutput('');
    setActiveTab('explanation');
    setAnalysisResult(null);
    setActiveStepIndex(0);
    setAnalyzedCode(null);
    setIsAnalyzing(false);
    setIsSaving(false);
    setError('');
    setSaveMessage('');
    setSaveError('');
    try {
      localStorage.removeItem(dashboardDraftStorageKey);
    } catch {
      // Ignore storage cleanup failures.
    }
  }

  async function handleSaveAnalysis() {
    if (!analysisResult || isSaving) {
      return;
    }

    setSaveMessage('');
    setSaveError('');
    setIsSaving(true);

    try {
      await saveProblem({
        title: title.trim() || 'Untitled problem',
        problemStatement,
        code,
        sampleInput,
        expectedOutput,
        pattern: analysisResult.pattern,
        difficulty: analysisResult.difficulty,
        timeComplexity: analysisResult.timeComplexity,
        spaceComplexity: analysisResult.spaceComplexity,
        explanation: {
          problemSummary: analysisResult.problemSummary,
          questionExplanation: analysisResult.questionExplanation,
          hinglishExplanation: analysisResult.hinglishExplanation,
          bruteForceApproach: analysisResult.bruteForceApproach,
          betterApproach: analysisResult.betterApproach,
          optimizedApproach: analysisResult.optimizedApproach,
        },
        visualizationSteps: analysisResult.steps,
        dryRunTable: analysisResult.dryRunTable,
        bugsOrWarnings: analysisResult.bugsOrWarnings,
        edgeCases: analysisResult.edgeCases,
        similarProblems: analysisResult.similarProblems,
        quizQuestions: analysisResult.quizQuestions,
      });

      setSaveMessage('Analysis saved successfully');
      showToast('Saved successfully.', 'success');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save analysis.';
      setSaveError(message);
      showToast('Save failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageShell
      title="Dashboard"
      description="Analyze DSA problems, review Python solutions, and prepare for deeper Gemini-powered feedback."
    >
      <DashboardLayout
        inputPanel={
          <InputPanel
            title={title}
            problemStatement={problemStatement}
            code={code}
            sampleInput={sampleInput}
            expectedOutput={expectedOutput}
            analysisResult={analysisResult}
            activeStepIndex={activeStepIndex}
            codeChangedAfterAnalysis={codeChangedAfterAnalysis}
            isAnalyzing={isAnalyzing}
            error={error}
            onTitleChange={setTitle}
            onProblemStatementChange={setProblemStatement}
            onCodeChange={setCode}
            onSampleInputChange={setSampleInput}
            onExpectedOutputChange={setExpectedOutput}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        }
        analysisPanel={
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-3 h-3 w-64 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-20 animate-pulse rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                    />
                  ))}
                </div>
              </div>
            ) : null}
            {analysisResult ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Save this analysis</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Store this result in your history for later review.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveAnalysis}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                    aria-label="Save analysis"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    {isSaving ? 'Saving...' : 'Save Analysis'}
                  </button>
                </div>
                {saveMessage ? (
                  <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {saveMessage}
                  </div>
                ) : null}
                {saveError ? (
                  <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    {saveError}
                  </div>
                ) : null}
              </div>
            ) : null}

            <AnalysisTabs
              activeTab={activeTab}
              analysisResult={analysisResult}
              languageMode={languageMode}
              activeStepIndex={activeStepIndex}
              codeChangedAfterAnalysis={codeChangedAfterAnalysis}
              title={title}
              problemStatement={problemStatement}
              code={code}
              sampleInput={sampleInput}
              expectedOutput={expectedOutput}
              onActiveTabChange={setActiveTab}
              onStepChange={setActiveStepIndex}
            />
          </div>
        }
      />
    </PageShell>
  );
}
