import { ChevronDown } from 'lucide-react';
import type { QuizQuestion } from '../../types/analysis';

type QuizPanelProps = {
  quizQuestions: QuizQuestion[];
};

export function QuizPanel({ quizQuestions }: QuizPanelProps) {
  return (
    <div className="space-y-3">
      {quizQuestions.map((item, index) => (
        <details
          key={item.question}
          className="group rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-950 dark:text-slate-100">
            <span>
              {index + 1}. {item.question}
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          {item.options?.length ? (
            <div className="mt-4 grid gap-2">
              {item.options.map((option) => {
                const isCorrect = option === item.correctAnswer;

                return (
                  <div
                    key={option}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50 font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                    }`}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {item.explanation || item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
