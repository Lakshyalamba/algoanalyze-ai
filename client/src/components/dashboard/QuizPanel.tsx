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
          className="group rounded-lg border border-slate-200 bg-white p-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-950">
            <span>
              {index + 1}. {item.question}
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

