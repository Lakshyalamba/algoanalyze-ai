import { useState } from 'react';
import { AnalysisTabs, type AnalysisTab } from '../components/dashboard/AnalysisTabs';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { InputPanel } from '../components/dashboard/InputPanel';
import { PageShell } from '../components/PageShell';
import { useAuth } from '../context/AuthContext';
import { createMockAnalysis } from '../lib/mockAnalysis';
import { analyzeCode } from '../services/api';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

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
    setIsAnalyzing(false);
    setError('');
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
          <AnalysisTabs
            activeTab={activeTab}
            analysisResult={analysisResult}
            languageMode={languageMode}
            onActiveTabChange={setActiveTab}
          />
        }
      />
    </PageShell>
  );
}
