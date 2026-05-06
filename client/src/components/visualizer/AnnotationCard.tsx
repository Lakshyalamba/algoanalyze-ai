import { MessageSquareText } from 'lucide-react';

type AnnotationCardProps = {
  annotation: string;
};

export function AnnotationCard({ annotation }: AnnotationCardProps) {
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-600">
        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
        Annotation
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {annotation || 'No annotation was generated for this step.'}
      </p>
    </div>
  );
}

