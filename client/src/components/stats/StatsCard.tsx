import type { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
};

export function StatsCard({ label, value, description, icon: Icon }: StatsCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </article>
  );
}
