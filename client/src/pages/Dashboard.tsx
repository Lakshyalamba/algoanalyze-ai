import { useState } from 'react';
import { Save } from 'lucide-react';
import { AnalysisTabs, type AnalysisTab } from '../components/dashboard/AnalysisTabs';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { InputPanel } from '../components/dashboard/InputPanel';
import { PageShell } from '../components/PageShell';
import { useAuth } from '../context/AuthContext';
import { createMockAnalysis } from '../lib/mockAnalysis';
import { analyzeCode } from '../services/api';
import { saveProblem } from '../services/savedProblemApi';
import type { AnalysisResult, LanguageMode } from '../types/analysis';

const starterCode = `class Solution:
    def solve(self):
        pass
`;

export function Dashboard() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [code, setCode] = useState(starterCode);
  const [sampleInput, setSampleInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('english');
  const [activeTab, setActiveTab] = useState<AnalysisTab>('explanation');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [analyzedCode, setAnalyzedCode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const codeChangedAfterAnalysis =
    analysisResult !== null && analyzedCode !== null && code !== analyzedCode;

  async function handleAnalyze() {
    if (!code.trim()) {
      setError('Add Python code before analysis.');
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
        return;
      }

      setError(message);
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
    setLanguageMode('english');
    setActiveTab('explanation');
    setAnalysisResult(null);
    setActiveStepIndex(0);
    setAnalyzedCode(null);
    setIsAnalyzing(false);
    setIsSaving(false);
    setError('');
    setSaveMessage('');
    setSaveError('');
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
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save analysis.';
      setSaveError(message);
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
            languageMode={languageMode}
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
            onLanguageModeChange={setLanguageMode}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        }
        analysisPanel={
          <div className="space-y-4">
            {analysisResult ? (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-950">Save this analysis</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Store this result in your history for later review.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveAnalysis}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
