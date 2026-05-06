import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-100">
            Code analysis workspace
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            AlgoAnalyze AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            A focused workspace for saving algorithm problems, reviewing solution history,
            and preparing for AI-assisted code analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

