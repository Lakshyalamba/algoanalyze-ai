type SuggestedQuestionsProps = {
  questions: string[];
  isDisabled?: boolean;
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({
  questions,
  isDisabled = false,
  onSelect,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          disabled={isDisabled}
          onClick={() => onSelect(question)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
