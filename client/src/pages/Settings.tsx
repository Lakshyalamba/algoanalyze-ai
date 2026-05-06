import { Database, KeyRound, Moon, Server, ShieldCheck, UserCircle } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user } = useAuth();

  return (
    <PageShell title="Settings" description="Review profile, theme preferences, and integration status.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-100">
              <UserCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Profile</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Authenticated with JWT.</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <InfoRow label="Name" value={user?.name || 'Not provided'} />
            <InfoRow label="Email" value={user?.email || 'Not available'} />
            <InfoRow
              label="Member since"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Theme preference</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Dark-mode friendly UI is ready for a future toggle.</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
            Theme switching placeholder. The UI components include dark mode classes for future persistence.
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">App info</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <StatusCard icon={Database} label="Database" value="Neon PostgreSQL via Prisma" />
          <StatusCard icon={Server} label="Backend" value="Node.js + Express API" />
          <StatusCard icon={KeyRound} label="AI" value="Gemini API server-side" />
        </div>
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <p className="font-medium">
            Your Gemini key is stored server-side and never exposed to the browser.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
      <dt className="font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-950 dark:text-slate-100">{value}</dd>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <Icon className="h-5 w-5 text-brand-600 dark:text-brand-100" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{value}</p>
    </div>
  );
}
