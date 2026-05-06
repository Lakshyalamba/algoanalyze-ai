import { MessageSquareText } from 'lucide-react';

type AnnotationCardProps = {
  annotation: string;
};

export function AnnotationCard({ annotation }: AnnotationCardProps) {
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-100">
        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
        Current Step Annotation
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {annotation || 'No annotation was generated for this step.'}
      </p>
    </div>
  );
}
