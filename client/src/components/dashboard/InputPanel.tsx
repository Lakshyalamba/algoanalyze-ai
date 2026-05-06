import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import { Eraser, FileCode2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import type { editor } from 'monaco-editor';
import type { AnalysisResult, LanguageMode } from '../../types/analysis';
import { LoadingButton } from './LoadingButton';

type InputPanelProps = {
  title: string;
  problemStatement: string;
  code: string;
  sampleInput: string;
  expectedOutput: string;
  languageMode: LanguageMode;
  analysisResult: AnalysisResult | null;
  activeStepIndex: number;
  codeChangedAfterAnalysis: boolean;
  isAnalyzing: boolean;
  error: string;
  onTitleChange: (value: string) => void;
  onProblemStatementChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onSampleInputChange: (value: string) => void;
  onExpectedOutputChange: (value: string) => void;
  onLanguageModeChange: (value: LanguageMode) => void;
  onAnalyze: () => void;
  onClear: () => void;
};

const fieldClass =
  'mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500';

type MonacoEditor = Parameters<OnMount>[0];

function getLineCount(code: string) {
  return code.split('\n').length;
}

export function InputPanel({
  title,
  problemStatement,
  code,
  sampleInput,
  expectedOutput,
  languageMode,
  analysisResult,
  activeStepIndex,
  codeChangedAfterAnalysis,
  isAnalyzing,
  error,
  onTitleChange,
  onProblemStatementChange,
  onCodeChange,
  onSampleInputChange,
  onExpectedOutputChange,
  onLanguageModeChange,
  onAnalyze,
  onClear,
}: InputPanelProps) {
  const editorRef = useRef<MonacoEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationIdsRef = useRef<string[]>([]);

  const activeLine = analysisResult?.steps[activeStepIndex]?.line;
  const editorLineCount = useMemo(() => getLineCount(code), [code]);
  const hasActiveLine =
    typeof activeLine === 'number' &&
    Number.isInteger(activeLine) &&
    activeLine > 0 &&
    activeLine <= editorLineCount;

  const clearDecorations = () => {
    if (!editorRef.current) {
      decorationIdsRef.current = [];
      return;
    }

    decorationIdsRef.current = editorRef.current.deltaDecorations(decorationIdsRef.current, []);
  };

  const handleEditorMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
  };

  useEffect(() => {
    const editorInstance = editorRef.current;
    const monacoInstance = monacoRef.current;
    const model = editorInstance?.getModel();

    if (!editorInstance || !monacoInstance || !model || !hasActiveLine) {
      clearDecorations();
      return;
    }

    const decorations: editor.IModelDeltaDecoration[] = [
      {
        range: new monacoInstance.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: 'algo-current-line',
          glyphMarginClassName: 'algo-current-line-glyph',
          overviewRuler: {
            color: 'rgba(20, 184, 166, 0.7)',
            position: monacoInstance.editor.OverviewRulerLane.Center,
          },
        },
      },
    ];

    decorationIdsRef.current = editorInstance.deltaDecorations(
      decorationIdsRef.current,
      decorations,
    );

    return () => {
      if (editorRef.current) {
        decorationIdsRef.current = editorRef.current.deltaDecorations(decorationIdsRef.current, []);
      }
    };
  }, [activeLine, hasActiveLine]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-brand-500">
          <FileCode2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Problem workspace</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paste Python code and generate AI analysis.</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Problem title
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className={fieldClass}
            placeholder="Two Sum"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Problem statement
          <textarea
            value={problemStatement}
            onChange={(event) => onProblemStatementChange(event.target.value)}
            className={`${fieldClass} min-h-28 resize-y leading-6`}
            placeholder="Paste the DSA problem statement here..."
          />
        </label>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Python code</label>
              {analysisResult ? (
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {hasActiveLine
                    ? `Current Line: ${activeLine}`
                    : 'No active line selected.'}
                </p>
              ) : null}
            </div>
            <div className="rounded-md bg-slate-100 p-1 dark:bg-slate-950">
              {(['english', 'hinglish'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onLanguageModeChange(mode)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    languageMode === mode
                      ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-800 dark:text-brand-100'
                      : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          {codeChangedAfterAnalysis ? (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
              Code changed after analysis. Re-run analysis for accurate steps.
            </div>
          ) : null}
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            <Editor
              height="350px"
              defaultLanguage="python"
              language="python"
              theme="vs-dark"
              value={code}
              onMount={handleEditorMount}
              onChange={(value) => onCodeChange(value ?? '')}
              options={{
                glyphMargin: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Sample input
            <textarea
              value={sampleInput}
              onChange={(event) => onSampleInputChange(event.target.value)}
              className={`${fieldClass} min-h-24 resize-y font-mono`}
              placeholder="[2, 7, 11, 15], target = 9"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Expected output
            <textarea
              value={expectedOutput}
              onChange={(event) => onExpectedOutputChange(event.target.value)}
              className={`${fieldClass} min-h-24 resize-y font-mono`}
              placeholder="[0, 1]"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <LoadingButton type="button" isLoading={isAnalyzing} onClick={onAnalyze}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </LoadingButton>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Clear workspace"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
