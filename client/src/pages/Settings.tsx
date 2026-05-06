import { PageShell } from '../components/PageShell';

export function Settings() {
  return (
    <PageShell title="Settings" description="Manage workspace preferences and future integrations.">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">Integration status</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Neon PostgreSQL</dt>
            <dd className="font-medium text-slate-950">Connected through Prisma</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Gemini API</dt>
            <dd className="font-medium text-slate-950">Not connected</dd>
          </div>
        </dl>
      </section>
    </PageShell>
  );
}
