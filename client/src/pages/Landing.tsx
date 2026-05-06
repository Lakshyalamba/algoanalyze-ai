import {
  Bot,
  Bug,
  Gauge,
  GitBranch,
  Languages,
  LayoutDashboard,
  NotebookText,
  PlaySquare,
  Save,
  Table2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Step-by-step visualizer', icon: PlaySquare },
  { title: 'Gemini chatbot', icon: Bot },
  { title: 'Hinglish explanations', icon: Languages },
  { title: 'Dry run table', icon: Table2 },
  { title: 'Pattern detection', icon: GitBranch },
  { title: 'Complexity analyzer', icon: Gauge },
  { title: 'Bug finder', icon: Bug },
  { title: 'Saved history', icon: Save },
  { title: 'Progress dashboard', icon: LayoutDashboard },
  { title: 'Revision notes', icon: NotebookText },
];

const workflow = [
  'Paste problem and code',
  'Analyze with Gemini',
  'Visualize step by step',
  'Save and revise',
];

export function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-brand-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI-powered DSA learning workspace
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Visualize DSA Code. Understand Algorithms Faster.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            AlgoAnalyze AI turns Python DSA code into step-by-step visualizations, dry
            runs, short annotations, pattern detection, complexity analysis, and
            Gemini-powered English/Hinglish explanations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-950/30 transition hover:bg-brand-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30"
        >
          <div className="rounded-lg border border-white/10 bg-slate-900 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-sm font-semibold">Current analysis</p>
                <p className="mt-1 text-xs text-slate-400">Two Sum • Hash Map</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                O(n)
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {['Line 4: store complement', 'Line 7: target found', 'Edge: duplicate values'].map(
                (item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-sm text-slate-200">{item}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.03] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold tracking-tight">Everything needed to revise DSA</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-sm"
              >
                <feature.icon className="h-5 w-5 text-brand-100" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold tracking-tight">Simple workflow</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {workflow.map((step, index) => (
              <article key={step} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500 text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
