import { Brain, GitBranch, Gauge, ListChecks } from 'lucide-react';
import type { AnalysisResult, LanguageMode } from '../../types/analysis';

type ExplanationPanelProps = {
  analysisResult: AnalysisResult;
  languageMode: LanguageMode;
};

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Brain;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}

function TextBlock({ title, children }: { title: string; children: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{children}</p>
    </section>
  );
}

export function ExplanationPanel({ analysisResult, languageMode }: ExplanationPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Pattern" value={analysisResult.pattern} icon={GitBranch} />
        <InfoCard label="Difficulty" value={analysisResult.difficulty} icon={Gauge} />
        <InfoCard label="Time" value={analysisResult.timeComplexity} icon={Brain} />
        <InfoCard label="Space" value={analysisResult.spaceComplexity} icon={ListChecks} />
      </div>

      <TextBlock title="Problem summary">{analysisResult.problemSummary}</TextBlock>
      <TextBlock title="Question explanation">{analysisResult.questionExplanation}</TextBlock>
      {languageMode === 'hinglish' ? (
        <TextBlock title="Hinglish explanation">{analysisResult.hinglishExplanation}</TextBlock>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <TextBlock title="Brute force approach">{analysisResult.bruteForceApproach}</TextBlock>
        <TextBlock title="Better approach">{analysisResult.betterApproach}</TextBlock>
        <TextBlock title="Optimized approach">{analysisResult.optimizedApproach}</TextBlock>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Similar problems</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysisResult.similarProblems.map((problem) => (
            <span
              key={problem}
              className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-100"
            >
              {problem}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
