import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function RecursionVisualizer({ state }: { state: VisualizerState }) {
  const calls = asArray(state.values);

  if (calls.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No recursion calls available.</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {calls.map((call, index) => {
          const active = isHighlighted(call, index, state.highlight);
          return (
            <motion.div
              key={`${index}-${displayValue(call)}`}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, scale: active ? 1.03 : 1 }}
              className={`rounded-md border px-4 py-3 font-mono text-sm ${
                active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
              }`}
            >
              {displayValue(call)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

