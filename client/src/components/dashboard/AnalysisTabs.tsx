import {
  Bot,
  Bug,
  FileText,
  HelpCircle,
  ListChecks,
  Route,
  Table2,
} from 'lucide-react';
import type { AnalysisResult, LanguageMode } from '../../types/analysis';
import { ChatbotPanel } from '../chat/ChatbotPanel';
import { BugsPanel } from './BugsPanel';
import { DryRunTable } from './DryRunTable';
import { EdgeCasesPanel } from './EdgeCasesPanel';
import { EmptyState } from './EmptyState';
import { ExplanationPanel } from './ExplanationPanel';
import { QuizPanel } from './QuizPanel';
import { DSAVisualizer } from '../visualizer/DSAVisualizer';

export type AnalysisTab =
  | 'explanation'
  | 'visualizer'
  | 'dryRun'
  | 'chatbot'
  | 'bugs'
  | 'edgeCases'
  | 'quiz';

type AnalysisTabsProps = {
  activeTab: AnalysisTab;
  analysisResult: AnalysisResult | null;
  languageMode: LanguageMode;
  activeStepIndex: number;
  codeChangedAfterAnalysis: boolean;
  problemStatement: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  onActiveTabChange: (tab: AnalysisTab) => void;
  onStepChange: (stepIndex: number) => void;
};

const tabs = [
  { id: 'explanation', label: 'Explanation', icon: FileText },
  { id: 'visualizer', label: 'Visualizer', icon: Route },
  { id: 'dryRun', label: 'Dry Run', icon: Table2 },
  { id: 'chatbot', label: 'Chatbot', icon: Bot },
  { id: 'bugs', label: 'Bugs', icon: Bug },
  { id: 'edgeCases', label: 'Edge Cases', icon: ListChecks },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
] satisfies Array<{ id: AnalysisTab; label: string; icon: typeof FileText }>;

export function AnalysisTabs({
  activeTab,
  analysisResult,
  languageMode,
  activeStepIndex,
  codeChangedAfterAnalysis,
  problemStatement,
  code,
  sampleInput,
  expectedOutput,
  onActiveTabChange,
  onStepChange,
}: AnalysisTabsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Analysis results</h2>
        <p className="mt-1 text-sm text-slate-500">Mock insights for the current solution.</p>
      </div>

      <div className="border-b border-slate-200 px-3 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onActiveTabChange(tab.id)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[420px] p-5">
        {!analysisResult && activeTab !== 'chatbot' ? (
          <EmptyState />
        ) : (
          renderTab({
            tab: activeTab,
            analysisResult,
            languageMode,
            activeStepIndex,
            codeChangedAfterAnalysis,
            problemStatement,
            code,
            sampleInput,
            expectedOutput,
            onStepChange,
          })
        )}
      </div>
    </section>
  );
}

type RenderTabParams = {
  tab: AnalysisTab;
  analysisResult: AnalysisResult | null;
  languageMode: LanguageMode;
  activeStepIndex: number;
  codeChangedAfterAnalysis: boolean;
  problemStatement: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  onStepChange: (stepIndex: number) => void;
};

function renderTab({
  tab,
  analysisResult,
  languageMode,
  activeStepIndex,
  codeChangedAfterAnalysis,
  problemStatement,
  code,
  sampleInput,
  expectedOutput,
  onStepChange,
}: RenderTabParams) {
  if (tab === 'chatbot') {
    return (
      <ChatbotPanel
        problemStatement={problemStatement}
        code={code}
        sampleInput={sampleInput}
        expectedOutput={expectedOutput}
        languageMode={languageMode}
        analysisContext={analysisResult}
      />
    );
  }

  if (!analysisResult) {
    return <EmptyState />;
  }

  if (tab === 'explanation') {
    return <ExplanationPanel analysisResult={analysisResult} languageMode={languageMode} />;
  }

  if (tab === 'visualizer') {
    return (
      <DSAVisualizer
        steps={analysisResult.steps}
        activeStepIndex={activeStepIndex}
        codeChangedAfterAnalysis={codeChangedAfterAnalysis}
        onStepChange={onStepChange}
      />
    );
  }

  if (tab === 'dryRun') {
    return <DryRunTable rows={analysisResult.dryRunTable} />;
  }

  if (tab === 'bugs') {
    return <BugsPanel bugsOrWarnings={analysisResult.bugsOrWarnings} />;
  }

  if (tab === 'edgeCases') {
    return <EdgeCasesPanel edgeCases={analysisResult.edgeCases} />;
  }

  return <QuizPanel quizQuestions={analysisResult.quizQuestions} />;
}
