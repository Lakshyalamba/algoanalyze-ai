import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

const sampleItems = [
  { id: 'two-sum', title: 'Two Sum', status: 'Draft' },
  { id: 'valid-parentheses', title: 'Valid Parentheses', status: 'Saved' },
];

export function History() {
  return (
    <PageShell title="History" description="Saved problem reviews will appear here.">
      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
        {sampleItems.map((item) => (
          <Link
            key={item.id}
            to={`/saved-problems/${item.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
          >
            <span className="font-medium text-slate-950">{item.title}</span>
            <span className="text-sm text-slate-500">{item.status}</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

