import {
  Bot,
  Bug,
  Gauge,
  GitBranch,
  LayoutDashboard,
  NotebookText,
  PlaySquare,
  Save,
  Table2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DottedBackground } from '../components/common/DottedBackground';
import { ThemeToggle } from '../components/common/ThemeToggle';

const features = [
  { title: 'Step-by-step visualizer', icon: PlaySquare },
  { title: 'Gemini chatbot', icon: Bot },
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
    <DottedBackground className="min-h-screen overflow-hidden text-slate-950 dark:text-white">
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white shadow-sm dark:bg-brand-500">
              AA
            </span>
            <span className="text-sm font-semibold sm:text-base">AlgoAnalyze AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Link
              to="/login"
              className="hidden min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-slate-950 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-900/70 dark:hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid h-screen max-w-7xl items-center gap-6 px-4 pb-5 pt-20 sm:px-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-brand-100 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI-powered DSA learning workspace
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            Visualize DSA Code. Understand Algorithms Faster.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            AlgoAnalyze AI turns Python DSA code into step-by-step visualizations, dry
            runs, short annotations, pattern detection, complexity analysis, and
            Gemini-powered explanations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-950/30 transition hover:bg-brand-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-950 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {workflow.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + index * 0.04 }}
                className="glass-panel rounded-lg px-3 py-3"
              >
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-100">0{index + 1}</span>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
          className="glass-panel hidden rounded-xl p-4 sm:block"
        >
          <div className="rounded-lg border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/80">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Current analysis</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Bubble Sort • Sorting</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                O(n²)
              </span>
            </div>
            <div className="mt-5 flex h-48 items-end gap-3 rounded-lg border border-slate-200 bg-slate-950 p-4 dark:border-white/10">
              {[5, 1, 4, 2, 8].map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ height: 20 }}
                  animate={{ height: 24 + value * 17 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`flex w-full max-w-14 items-end justify-center rounded-t-md ${
                    index === 1 || index === 2 ? 'bg-brand-500' : 'bg-slate-700'
                  }`}
                >
                  <span className="mb-2 text-xs font-semibold text-white">{value}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {features.slice(0, 6).map((feature) => (
                <div key={feature.title} className="rounded-md border border-slate-200 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <feature.icon className="h-4 w-4 text-brand-600 dark:text-brand-100" aria-hidden="true" />
                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </DottedBackground>
  );
}
