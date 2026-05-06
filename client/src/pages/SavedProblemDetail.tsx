import { useParams } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export function SavedProblemDetail() {
  const { problemId } = useParams();

  return (
    <PageShell
      title="Saved Problem"
      description={`Problem ID: ${problemId ?? 'unknown'}`}
    >
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">Review details</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Stored submissions, analysis, and notes will be displayed here after persistence is added.
        </p>
      </section>
    </PageShell>
  );
}

